export const MIN_DELAY = 3600;
export const VOTING_PERIOD = 5;
export const VOTING_DELAY = 1;
export const QUORUM_PERCENTAGE = 4;
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const NEW_STORE_VALUE = 77;
export const FUNC = "store";
export const PROPOSAL_DESCRIPTION = "Proposal #1: Store 77 in the Box!";
export const proposalFile = "proposals.json";

const networkConfig = {
  31337: {
    name: "localhost",
    callbackGasLimit: "500000", // 500,000 gas
  },
  11155111: {
    name: "sepolia",
    callbackGasLimit: "500000", // 500,000 gas
  },
};

const developmentChains = ["localhost", "hardhat"];

export { networkConfig, developmentChains };
