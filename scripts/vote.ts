import { deployments, ethers, network } from "hardhat";
import {
  developmentChains,
  proposalFile,
  VOTING_PERIOD,
} from "../helper-hardhat-config";
import * as fs from "fs";
import { moveBlocks } from "../utils/move-blocks";

const index = 0;

async function main(proposalIndex: number) {
  const proposals = JSON.parse(fs.readFileSync(proposalFile, "utf-8"));
  const proposalId = proposals[network.config.chainId!][proposalIndex];
  // 0 = Against, 1 = For, 2 = Abstain
  const voteWay = 1;
  const governor = await ethers.getContractAt(
    "GovernorContract",
    (
      await deployments.get("GovernorContract")
    ).address
  );
  const reason = "I like a do da cha cha";
  const voteTxResponse = await governor.castVoteWithReason(
    proposalId,
    voteWay,
    reason
  );
  await voteTxResponse.wait(1);
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }
  console.log("Voted! Ready to go!");
}

main(index)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
