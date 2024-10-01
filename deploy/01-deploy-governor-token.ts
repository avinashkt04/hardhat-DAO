import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../helper-hardhat-config";
import { verify } from "../utils/verify";
import { ethers } from "hardhat";

const deployGovernanceToken: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("Deploying GovernanceToken...");
  const governanceToken = await deploy("GovernanceToken", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: developmentChains.includes(network.name) ? 1 : 5,
  });
  log(`Deployed governance token to address: ${governanceToken.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    verify(governanceToken.address, []);
  }

  await delegate(governanceToken.address, deployer);
  log("Delegated!");
};

const delegate = async (
  governanceTokenAddress: string,
  delegatedAccount: string
) => {
  const governaceToken = await ethers.getContractAt(
    "GovernanceToken",
    governanceTokenAddress
  );
  const tx = await governaceToken.delegate(delegatedAccount);
  await tx.wait(1);
  console.log(
    `Checkpoints: ${await governaceToken.numCheckpoints(delegatedAccount)}`
  );
};

export default deployGovernanceToken;
