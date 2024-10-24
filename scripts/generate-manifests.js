const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const networksData = JSON.parse(fs.readFileSync('networks.json', 'utf8'));

function replacePlaceholders(template, network, networkData) {
  let result = template.replace(/{{ network }}/g, network);
  
  for (const [contractName, contractData] of Object.entries(networkData)) {
    result = result.replace(new RegExp(`{{ ${contractName}\\.address }}`, 'g'), contractData.address);
    result = result.replace(new RegExp(`{{ ${contractName}\\.startBlock }}`, 'g'), contractData.startBlock.toString());
  }
  
  return result;
}

['v3-pools', 'v3-vault'].forEach(subgraph => {
  const templatePath = path.join('subgraphs', subgraph, 'template.yaml');
  
  if (!fs.existsSync(templatePath)) {
    console.log(`No template found for ${subgraph}, skipping...`);
    return;
  }
  
  const template = fs.readFileSync(templatePath, 'utf8');

  Object.entries(networksData).forEach(([network, networkData]) => {
    const config = replacePlaceholders(template, network, networkData);
    const outputPath = path.join('subgraphs', subgraph, `subgraph.${network}.yaml`);
    fs.writeFileSync(outputPath, config);
    console.log(`Generated ${outputPath}`);
  });
});

console.log('🎉 v3 subgraphs successfully generated\n');
