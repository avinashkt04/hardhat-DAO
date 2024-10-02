import { deployments, ethers } from "hardhat";
import { Box, GovernorContract, TimeLock } from "../../typechain-types";
import { GovernanceToken } from "../../typechain-types/contracts/GovernanceToken.sol";
import { expect } from "chai";
import {
  FUNC,
  MIN_DELAY,
  NEW_STORE_VALUE,
  PROPOSAL_DESCRIPTION,
  VOTING_DELAY,
  VOTING_PERIOD,
} from "../../helper-hardhat-config";
import { moveBlocks } from "../../utils/move-blocks";
import { moveTime } from "../../utils/move-time";

describe("Governor Flow", () => {
  let governor: GovernorContract;
  let timeLock: TimeLock;
  let governaceToken: GovernanceToken;
  let box: Box;
  const voteWay = 1;
  const reason = "I lika do da cha cha";
  beforeEach(async () => {
    await deployments.fixture(["all"]);
    governor = await ethers.getContractAt(
      "GovernorContract",
      (
        await deployments.get("GovernorContract")
      ).address
    );
    timeLock = await ethers.getContractAt(
      "TimeLock",
      (
        await deployments.get("TimeLock")
      ).address
    );
    governaceToken = await ethers.getContractAt(
      "GovernanceToken",
      (
        await deployments.get("GovernanceToken")
      ).address
    );
    box = await ethers.getContractAt(
      "Box",
      (
        await deployments.get("Box")
      ).address
    );
  });

  it("can only be changed through governance", async () => {
    await expect(box.store(55)).to.be.revertedWithCustomError(
      box,
      "OwnableUnauthorizedAccount"
    );
  });

  it("proposes, votes, waits, queues and then executes", async () => {
    // propose
    const encodedFunctionCall = await box.interface.encodeFunctionData(FUNC, [
      NEW_STORE_VALUE,
    ]);
    const proposeTx = await governor.propose(
      [box.target],
      [0],
      [encodedFunctionCall],
      PROPOSAL_DESCRIPTION
    );
    const boxStartingValue = await box.retrieve();
    console.log(`Propose starting value: ${boxStartingValue.toString()}`);
    const proposeReceipt = await proposeTx.wait(1);
    const proposalId = (proposeReceipt!.logs![0] as any).args!.proposalId;
    let proposalState = await governor.state(proposalId);
    console.log(`Current proposal state: ${proposalState.toString()}`);

    await moveBlocks(VOTING_DELAY + 1);

    // vote
    const voteTxResponse = await governor.castVoteWithReason(proposalId, voteWay, reason);
    await voteTxResponse.wait(1);
    proposalState = await governor.state(proposalId);
    console.log(`Current proposal state: ${proposalState.toString()}`);
    await moveBlocks(VOTING_PERIOD + 1);

    // queue & execute
    const descriptionHash = ethers.id(PROPOSAL_DESCRIPTION);
    const queueTx = await governor.queue([box.target], [0], [encodedFunctionCall], descriptionHash);
    await queueTx.wait(1);
    await moveTime(MIN_DELAY + 1);
    await moveBlocks(1);

    proposalState = await governor.state(proposalId);
    console.log(`Current proposal state: ${proposalState.toString()}`);

    console.log("Executing...");
    const exTx = await governor.execute([box.target], [0], [encodedFunctionCall], descriptionHash);
    await exTx.wait(1);
    const boxEndingValue = await box.retrieve()
    console.log(`Box ending value THROUGH GOVERNANCE IS: ${boxEndingValue.toString()}`)
  });
});
