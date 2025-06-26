# Symmetric v4 Subgraphs

This repository contains the subgraph implementations for Balancer v3, including pools and vault subgraphs. It's structured as a monorepo using pnpm workspaces.

## Preliminary Deployments

| Subgraph | Version | Endpoint                                                                                  |
| -------- | ------- | ----------------------------------------------------------------------------------------- |
| Vault    | 0.0.1   | https://api.studio.thegraph.com/query/87733/symmetric-v-4-sepolia-vault/version/latest    |
| Pools    | 0.0.1   | https://api.studio.thegraph.com/query/87733/symmetric-v-4-sepolia-pools/version/latest    |

## Prerequisites

- Node.js (v18 or later)
- pnpm (v7 or later)

## Setup

1. Install dependencies:

   ```
   pnpm install
   ```

2. Generate manifests:

   ```
   pnpm generate-manifests
   ```

   Note: Subgraph manifests (subgraph.yaml) define the smart contracts to index and how to map event data to entities.

3. Generate types for all subgraphs:

   ```
   pnpm codegen
   ```

   Note: Codegen creates AssemblyScript classes for each smart contract ABI in subgraph.yaml.

## Development

### Working on a Specific Subgraph

To run commands for a specific subgraph:

```
pnpm pools <command>  # For pools subgraph
pnpm vault <command>  # For vault subgraph
```

For example, to build the pools subgraph:

```
pnpm pools build
```

### Extending the Subgraphs

As Balancer expands to new networks or introduces new pool types, you may need to extend the subgraphs. We've provided detailed documentation to guide you through these processes:

- [Adding Support for New Pool Types](docs/new-pool-types.md)
  If you're building your own pools on Balancer and want to integrate them with the subgraph, this provides a step-by-step guide on how to extend the subgraph to support your new pool type. This ensures that your pool is integrated with Balancer's infraestructure.
- [Adding Support for New Networks](docs/support-new-networks.md)
  This guide walks you through the process of adding a new network to the subgraph. It covers updating the `networks.json` file, modifying the GitHub Actions workflow, and generating the necessary manifests.

## Deployment

Deployment is handled automatically by GitHub Actions when pushing to the `main` branch. The workflow will:

1. Generate manifests for all subgraphs
2. Generate code for all subgraphs
3. Build and deploy each subgraph to The Graph's hosted service

To deploy manually, ensure you have the necessary credentials and run:

```
pnpm pools codegen:sepolia
pnpm pools build
pnpm pools deploy:sepolia

pnpm vault codegen:sepolia
pnpm vault build
pnpm vault deploy:sepolia
```
