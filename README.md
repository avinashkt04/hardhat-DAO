# Hardhat DAO

This project implements a decentralized autonomous organization (DAO) using Hardhat. It includes smart contracts for governance, token management, and time-locked proposal execution. The structure of the project is modular, with separate files for each contract and organized directories for easy navigation.

## Interacting with the DAO
The DAO is primarily interacted with through proposals created on the `GovernorContract`. Proposals can be created by any account with sufficient voting power. Once a proposal is created, it will go through the following stages:
1. **Proposal Creation**: Create a proposal to change the state of the `Box` contract or other contracts controlled by the DAO.
2. **Voting**: Token holders vote on the proposal using their `GovernanceToken`.
3. **Queueing**: Once the proposal passes, it is added to the `Timelock` queue.
4. **Execution**: After the minimum delay set in `Timelock`, the proposal can be executed, making the changes effective.

## Prerequisites

Before you get started, make sure you have the following:
- **Yarn**: Package manager for managing dependencies and running scripts.
- **Node.js**: Version 18 or higher.

## Cloning

To clone this repository to your local machine, go to the location and run the following command in terminal:

```bash
git clone https://github.com/avinashkt04/hardhat-DAO.git
```
## Getting Started

### Contract Deployment

1. **Install Dependencies:**
    
    ```bash
    yarn install
    ```
2. **Deploy Contract:**

    ```bash
    hh deploy
    ```

    Or, to deploy the contract to a specific network (e.g., Sepolia):

    ```bash
    hh deploy --network sepolia
    ```

## Testing Contracts
To run the tests defined in the `test` directory, use the following command:

```bash
hh test
```

## Running Scripts
To run any script in the `scripts` directory (e.g., a script named `propose.ts`), use:
```bash
hh run scripts/propose.ts
```
Or, to run a script on a specific network:
```bash
hh run scripts/propose.ts --network sepolia
```

## Configuration for Testnets
Before deploying or testing on a testnet like Sepolia, create a `.env` file in the `contract` directory with the following content:
```dotenv
SEPOLIA_RPC_URL=<sepolia_rpc_url>
PRIVATE_KEY=<your_wallet_private_key>
ETHERSCAN_API_KEY=<your_etherscan_api_key>
```
Replace  <sepolia_rpc_url>, <your_wallet_private_key>, and <your_etherscan_api_key> with your actual values.