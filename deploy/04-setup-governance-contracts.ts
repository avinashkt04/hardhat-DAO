import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "hardhat";

const setupContracts: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const timeLock = await ethers.getContractAt(
    "TimeLock",
    (
      await get("TimeLock")
    ).address
  );
  const governor = await ethers.getContractAt(
    "GovernorContract",
    (
      await get("GovernorContract")
    ).address
  );
  log("Setting up roles...");
  const proposerRole = await timeLock.PROPOSER_ROLE();
  const executorRole = await timeLock.EXECUTOR_ROLE();
  const adminRole = await timeLock.DEFAULT_ADMIN_ROLE();

  const proposerTx = await timeLock.grantRole(proposerRole, governor.target);
  await proposerTx.wait(1);
  const executorTx = await timeLock.grantRole(executorRole, governor.target);
  await executorTx.wait(1);
  const revokeTx = await timeLock.revokeRole(adminRole, deployer);
  await revokeTx.wait(1);
};

export default setupContracts;
setupContracts.tags = ["all", "setup"];
