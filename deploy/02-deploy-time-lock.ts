import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, MIN_DELAY } from "../helper-hardhat-config";
import { verify } from "../utils/verify";


const deployTimeLock: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("Deploying Timelock...");
  const timeLock = await deploy("TimeLock", {
    from: deployer,
    args: [MIN_DELAY, [], []],
    log: true,
    waitConfirmations: developmentChains.includes(network.name) ? 1 : 5,
  });
  log(`Deployed timelock to address: ${timeLock.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    verify(timeLock.address, []);
  }

};

export default deployTimeLock;
