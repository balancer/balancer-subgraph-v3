#!/bin/bash

# Exit on error
set -e

# Configuration
GRAPH_NODE="https://api.subgraph.ormilabs.com/deploy"
IPFS_NODE="https://api.subgraph.ormilabs.com/ipfs"
DEPLOY_KEY="${ORMI_DEPLOY_KEY}"

# Check if deploy key is set
if [ -z "$DEPLOY_KEY" ]; then
  echo "Error: ORMI_DEPLOY_KEY environment variable is not set"
  exit 1
fi

# Get the latest git commit hash
VERSION=$(git rev-parse --short HEAD)

if [ -z "$VERSION" ]; then
  echo "Error: Failed to get git commit hash"
  exit 1
fi

echo "Using git commit hash as version: ${VERSION}"
echo ""

# Get subgraph type (required) and network (optional)
if [ -z "$1" ]; then
  echo "Error: Subgraph type is required (v3-vault or v3-pools)"
  exit 1
fi

SUBGRAPH_TYPE="$1"

if [ "$SUBGRAPH_TYPE" != "v3-vault" ] && [ "$SUBGRAPH_TYPE" != "v3-pools" ]; then
  echo "Error: Invalid subgraph type. Must be 'v3-vault' or 'v3-pools'"
  exit 1
fi

echo "Deploying ${SUBGRAPH_TYPE} subgraphs..."
echo ""

# List of networks to deploy
if [ -n "$2" ]; then
  # Use the network provided as second argument
  NETWORKS=("$2")
  echo "Deploying to specific network: ${2}"
else
  # Deploy to all networks
  NETWORKS=(
    "mainnet"
    "polygon"
    "arbitrum-one"
    "gnosis"
    "optimism"
    "avalanche"
    "polygon-zkevm"
    "base"
    "sonic"
    "hyperevm"
    "plasma"
    "xlayer"
    "monad"
    "sepolia"
  )
fi

echo "Deploying with version ${VERSION}..."
echo ""

FAILED=0

# Deploy each network
for network in "${NETWORKS[@]}"; do
  SUBGRAPH_NAME="${SUBGRAPH_TYPE}-${network}-smol"

  # Use subgraph.yaml for mainnet, otherwise use network-specific file
  if [ "$network" = "mainnet" ]; then
    SUBGRAPH_FILE="subgraph.yaml"
  else
    SUBGRAPH_FILE="subgraph.${network}.yaml"
  fi

  # Check if subgraph file exists
  if [ ! -f "subgraphs/${SUBGRAPH_TYPE}/$SUBGRAPH_FILE" ]; then
    echo "Warning: ${SUBGRAPH_FILE} not found, skipping..."
    continue
  fi

  echo "Deploying ${SUBGRAPH_NAME}..."
  echo "  Version: ${VERSION}"

  # Deploy the subgraph
  echo "  Deploying..."
  if (cd "subgraphs/${SUBGRAPH_TYPE}" && npx graph deploy "$SUBGRAPH_NAME" "$SUBGRAPH_FILE" \
    --node "$GRAPH_NODE" \
    --ipfs "$IPFS_NODE" \
    --deploy-key "$DEPLOY_KEY" \
    --version-label "${VERSION}"); then
    echo "  ✓ Successfully deployed ${SUBGRAPH_NAME} ${VERSION}"
  else
    echo "  ✗ Failed to deploy ${SUBGRAPH_NAME}"
    FAILED=1
  fi

  echo ""
done

if [ "$FAILED" -eq 1 ]; then
  echo "Deployment completed with errors!"
  exit 1
fi

echo "Deployment complete!"
