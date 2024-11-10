import {
  VotingEscrowLock,
  VotingEscrow,
  LockSnapshot,
  OmniVotingEscrowLock,
} from "../types/schema";
import { UserBalToChain } from "../types/OmniVotingEscrow/omniVotingEscrow";
import { UserBalFromChain } from "../types/OmniVotingEscrowChild/omniVotingEscrowChild";
import { Deposit, Supply, Withdraw } from "../types/VotingEscrow/votingEscrow";
import { LOCK_MAXTIME, ZERO, ZERO_BD } from "../helpers/constants";
import {
  getLockSnapshotId,
  getOmniVotingEscrowId,
  getVotingEscrowId,
} from "../helpers/gauge";
import { scaleDownBPT, scaleUp } from "../helpers/maths";
import { createUserEntity } from "../helpers/misc";

export function handleDeposit(event: Deposit): void {
  let userAddress = event.params.provider;
  createUserEntity(userAddress);

  let id = getVotingEscrowId(userAddress, event.address);
  let votingShare = VotingEscrowLock.load(id);

  if (votingShare == null) {
    votingShare = new VotingEscrowLock(id);
    votingShare.user = userAddress.toHexString();
    votingShare.votingEscrowID = event.address.toHexString();
    votingShare.lockedBalance = ZERO_BD;
  }

  let blockTimestamp = event.block.timestamp;
  let depositAmount = scaleDownBPT(event.params.value);

  votingShare.unlockTime = event.params.locktime;
  votingShare.updatedAt = blockTimestamp.toI32();

  votingShare.lockedBalance = votingShare.lockedBalance.plus(depositAmount);

  const slopeBI = scaleUp(votingShare.lockedBalance, 18).div(LOCK_MAXTIME);
  const biasBI = slopeBI.times(votingShare.unlockTime.minus(blockTimestamp));
  votingShare.slope = scaleDownBPT(slopeBI);
  votingShare.bias = scaleDownBPT(biasBI);
  votingShare.timestamp = blockTimestamp.toI32();

  votingShare.save();

  const snapshotId = getLockSnapshotId(userAddress, blockTimestamp.toI32());
  let lockSnapshot = LockSnapshot.load(snapshotId);

  if (lockSnapshot == null) {
    lockSnapshot = new LockSnapshot(snapshotId);
    lockSnapshot.timestamp = votingShare.updatedAt;
    lockSnapshot.user = userAddress.toHexString();
    lockSnapshot.slope = votingShare.slope;
    lockSnapshot.bias = votingShare.bias;
  }

  lockSnapshot.save();
}

export function handleWithdraw(event: Withdraw): void {
  let userAddress = event.params.provider;
  createUserEntity(userAddress);

  let id = getVotingEscrowId(userAddress, event.address);
  let votingShare = VotingEscrowLock.load(id);

  if (votingShare == null) return;

  votingShare = new VotingEscrowLock(id);
  votingShare.user = userAddress.toHexString();
  votingShare.votingEscrowID = event.address.toHexString();
  votingShare.lockedBalance = ZERO_BD;
  votingShare.updatedAt = event.block.timestamp.toI32();
  votingShare.save();
}

export function handleSupply(event: Supply): void {
  let id = event.address.toHexString();
  let votingEscrow = VotingEscrow.load(id);

  if (votingEscrow == null) {
    votingEscrow = new VotingEscrow(id);
  }

  votingEscrow.stakedSupply = scaleDownBPT(event.params.supply);
  votingEscrow.save();
}

export function handleUserBalFromChain(event: UserBalFromChain): void {
  if (event.params.userPoint.slope.equals(ZERO)) return;

  let userAddress = event.params.user;
  createUserEntity(userAddress);

  let id = getVotingEscrowId(userAddress, event.address);
  let votingShare = VotingEscrowLock.load(id);

  if (votingShare == null) {
    votingShare = new VotingEscrowLock(id);
    votingShare.user = userAddress.toHexString();

    // if the VotingEscrow entity doesn't exist, create it
    let votingEscrowID = event.address.toHexString();
    let votingEscrow = VotingEscrow.load(votingEscrowID);
    if (votingEscrow == null) {
      votingEscrow = new VotingEscrow(votingEscrowID);
      votingEscrow.save();
    }

    votingShare.votingEscrowID = votingEscrowID;
  }

  votingShare.updatedAt = event.block.timestamp.toI32();

  const lockedBalanceBI = event.params.userPoint.slope.times(LOCK_MAXTIME);
  votingShare.lockedBalance = scaleDownBPT(lockedBalanceBI);

  votingShare.slope = scaleDownBPT(event.params.userPoint.slope);
  votingShare.bias = scaleDownBPT(event.params.userPoint.bias);
  votingShare.timestamp = event.params.userPoint.ts.toI32();
  votingShare.unlockTime = event.params.userPoint.ts.plus(
    event.params.userPoint.bias.div(event.params.userPoint.slope)
  );

  votingShare.save();
}

export function handleUserBalToChain(event: UserBalToChain): void {
  let userAddress = event.params.localUser;
  createUserEntity(userAddress);

  let contractAddress = event.address;
  let dstChainId = event.params.dstChainId;

  let id = getOmniVotingEscrowId(userAddress, contractAddress, dstChainId);
  let omniLock = OmniVotingEscrowLock.load(id);

  if (omniLock == null) {
    omniLock = new OmniVotingEscrowLock(id);
    omniLock.localUser = userAddress.toHexString();
    omniLock.votingEscrowID = "0xc128a9954e6c874ea3d62ce62b468ba073093f25";
    omniLock.dstChainId = event.params.dstChainId;
  }

  omniLock.bias = scaleDownBPT(event.params.userPoint.bias);
  omniLock.slope = scaleDownBPT(event.params.userPoint.slope);
  omniLock.timestamp = event.params.userPoint.ts.toI32();
  omniLock.remoteUser = event.params.remoteUser;

  omniLock.save();
}
