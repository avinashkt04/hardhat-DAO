import { deployments, ethers, network } from "hardhat";
import {
  developmentChains,
  FUNC,
  NEW_STORE_VALUE,
  PROPOSAL_DESCRIPTION,
  proposalFile,
  VOTING_DELAY,
} from "../helper-hardhat-config";
import { moveBlocks } from "../utils/move-blocks";
import * as fs from "fs";

export async function propose(
  args: any[],
  functionToCall: string,
  proposalDescription: string
) {
  const governor = await ethers.getContractAt(
    "GovernorContract",
    (
      await deployments.get("GovernorContract")
    ).address
  );
  const box = await ethers.getContractAt(
    "Box",
    (
      await deployments.get("Box")
    ).address
  );
  const encodedFunctionCall = box.interface.encodeFunctionData(
    // @ts-ignore
    functionToCall,
    args
  );
  console.log(`Proposing ${functionToCall} on ${box.target} with ${args}`);
  console.log(`Proposal Description: \n ${proposalDescription}`);
  const proposeTx = await governor.propose(
    [box.target],
    [0],
    [encodedFunctionCall],
    proposalDescription
  );
  const proposeReceipt = await proposeTx.wait(1);

  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1);
  }

  const proposalId = (proposeReceipt!.logs[0] as any).args.proposalId;
  console.log(`Proposal created with id: ${proposalId}`);
  let proposals = JSON.parse(fs.readFileSync(proposalFile, "utf-8"));
  proposals[network.config.chainId!.toString()].push(proposalId.toString());
  fs.writeFileSync(proposalFile, JSON.stringify(proposals, null, 2));
}

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
