import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  developmentChains,
  QUORUM_PERCENTAGE,
  VOTING_DELAY,
  VOTING_PERIOD,
} from "../helper-hardhat-config";
import { verify } from "../utils/verify";

const deployGovernorContract: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const governaceToken = await get("GovernanceToken");
  const timeLock = await get("TimeLock");
  log("Deploying Governor Contract...");
  const governorContract = await deploy("GovernorContract", {
    from: deployer,
    args: [
      governaceToken.address,
      timeLock.address,
      VOTING_DELAY,
      VOTING_PERIOD,
      QUORUM_PERCENTAGE,
    ],
    log: true,
    waitConfirmations: developmentChains.includes(network.name) ? 1 : 5,
  });
  log(`Deployed governorContract to address: ${governorContract.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    verify(governorContract.address, []);
  }
};

export default deployGovernorContract;
deployGovernorContract.tags = ["all", "governor"];
