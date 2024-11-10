import { Address, BigInt, Bytes, log } from '@graphprotocol/graph-ts';

import {
  LiquidityGauge,
  GaugeShare,
  RewardToken,
  GaugeVote,
  GaugeType,
} from '../types/schema';
import {
  CONTROLLER_ADDRESS,
  ZERO,
  ZERO_ADDRESS,
  ZERO_BD,
  isL1Factory,
} from './constants';
import { LiquidityGauge as LiquidityGaugeTemplate } from '../types/templates/LiquidityGauge/LiquidityGauge';
import {
  bytesToAddress,
  createUserEntity,
  getTokenDecimals,
  getTokenSymbol,
} from './misc';
import { GaugeController } from '../types/GaugeController/GaugeController';
import { scaleDown } from './maths';
import { ChildChainStreamer } from '../types/templates/ChildChainStreamer/ChildChainStreamer';
import { ChildChainLiquidityGaugeV2 } from '../types/templates/ChildChainStreamer/ChildChainLiquidityGaugeV2';

export function getRewardTokenId(
  tokenAddress: Address,
  gaugeAddress: Address,
): string {
  return tokenAddress.toHex().concat('-').concat(gaugeAddress.toHex());
}

/**
 * Returns the reward token entity for a given gauge and token address
 * Creates the entity if it does not exist, as well as an entry in the gauge's rewardTokensList
 */
export function getRewardToken(
  tokenAddress: Address,
  gaugeAddress: Address,
): RewardToken {
  let id = getRewardTokenId(tokenAddress, gaugeAddress);
  let rewardToken = RewardToken.load(id);

  if (rewardToken == null) {
    rewardToken = new RewardToken(id);
    rewardToken.gauge = gaugeAddress.toHexString();
    rewardToken.symbol = getTokenSymbol(tokenAddress);
    rewardToken.decimals = getTokenDecimals(tokenAddress);
    rewardToken.totalDeposited = ZERO_BD;
    rewardToken.save();

    let gauge = LiquidityGauge.load(gaugeAddress.toHex());
    if (!gauge) return rewardToken;
    let rewardTokensList = gauge.rewardTokensList;
    if (rewardTokensList == null) {
      rewardTokensList = new Array<Bytes>(1);
      rewardTokensList[0] = tokenAddress;
    } else {
      rewardTokensList.push(tokenAddress);
    }
    gauge.rewardTokensList = rewardTokensList;
    gauge.save();
  }

  return rewardToken;
}

export function getLiquidityGauge(
  gaugeAddress: Address,
  poolAddress: Address,
): LiquidityGauge {
  let gauge = LiquidityGauge.load(gaugeAddress.toHexString());

  if (gauge == null) {
    gauge = new LiquidityGauge(gaugeAddress.toHexString());
    gauge.poolAddress = poolAddress;
    gauge.factory = ZERO_ADDRESS;
    gauge.totalSupply = ZERO_BD;
    gauge.isPreferentialGauge = false;
    gauge.isKilled = false;

    let gaugeToken = LiquidityGaugeTemplate.bind(gaugeAddress);
    let symbolCall = gaugeToken.try_symbol();
    if (!symbolCall.reverted) {
      gauge.symbol = symbolCall.value;
    }

    gauge.save();
  }

  return gauge;
}

export function getGaugeShareId(
  userAddress: Address,
  gaugeAddress: Address,
): string {
  return userAddress.toHex().concat('-').concat(gaugeAddress.toHex());
}

export function createGaugeShare(
  userAddress: Address,
  gaugeAddress: Address,
): GaugeShare {
  createUserEntity(userAddress);
  let id = getGaugeShareId(userAddress, gaugeAddress);

  let gaugeShare = new GaugeShare(id);
  gaugeShare.user = userAddress.toHexString();
  gaugeShare.gauge = gaugeAddress.toHexString();
  gaugeShare.balance = ZERO_BD;
  gaugeShare.save();

  return gaugeShare;
}

export function getGaugeShare(
  userAddress: Address,
  gaugeAddress: Address,
): GaugeShare {
  let id = getGaugeShareId(userAddress, gaugeAddress);
  let gaugeShare = GaugeShare.load(id);

  if (gaugeShare == null) {
    return createGaugeShare(userAddress, gaugeAddress);
  }

  return gaugeShare;
}

export function getGaugeId(gaugeAddress: Address, gaugeType: BigInt): string {
  return gaugeAddress.toHex().concat('-').concat(gaugeType.toString());
}

export function getGaugeIdFromController(gaugeAddress: Address): string {
  let controller = GaugeController.bind(CONTROLLER_ADDRESS);
  let gaugeTypesCall = controller.try_gauge_types(gaugeAddress);
  let gaugeType = gaugeTypesCall.reverted ? ZERO : gaugeTypesCall.value;
  let gaugeId = getGaugeId(gaugeAddress, gaugeType);

  return gaugeId;
}

export function getOmniVotingEscrowId(
  userAddress: Address,
  votingEscrowAddress: Address,
  chainId: i32,
): string {
  return userAddress
    .toHex()
    .concat('-')
    .concat(votingEscrowAddress.toHex())
    .concat('-')
    .concat(chainId.toString());
}

export function getVotingEscrowId(
  userAddress: Address,
  votingEscrowAddress: Address,
): string {
  return userAddress.toHex().concat('-').concat(votingEscrowAddress.toHex());
}

export function getLockSnapshotId(
  userAddress: Address,
  timestamp: i32,
): string {
  return userAddress.toHex().concat('-').concat(timestamp.toString());
}

export function getGaugeVoteId(
  userAddress: Address,
  gaugeAddress: Address,
): string {
  return userAddress.toHex().concat('-').concat(gaugeAddress.toHex());
}

export function getGaugeVote(
  userAddress: Address,
  gaugeAddress: Address,
): GaugeVote {
  let id = getGaugeVoteId(userAddress, gaugeAddress);
  let gaugeVote = GaugeVote.load(id);

  if (gaugeVote == null) {
    gaugeVote = new GaugeVote(id);
    gaugeVote.user = userAddress.toHexString();
    gaugeVote.gauge = getGaugeIdFromController(gaugeAddress);
    gaugeVote.save();
  }

  return gaugeVote;
}

function getTypeName(typeNumber: BigInt): string {
  let controller = GaugeController.bind(CONTROLLER_ADDRESS);
  let nameCall = controller.try_gauge_type_names(typeNumber);
  let name = nameCall.reverted ? '' : nameCall.value;

  return name;
}

export function getGaugeType(typeNumber: BigInt): GaugeType {
  let typeId = typeNumber.toString();
  let type = GaugeType.load(typeId);

  if (type == null) {
    type = new GaugeType(typeId);
    type.name = getTypeName(typeNumber);
  }

  type.save();

  return type;
}

// Define a simple struct to hold the data returned by calls to reward_data()
class RewardData {
  rate: BigInt = ZERO;

  period_finish: BigInt = ZERO;

  received: BigInt = ZERO;

  // eslint-disable-next-line
  reverted: boolean = false;
}

/**
 * Sets the reward data for a reward token of a given gauge
 * If the token does not exist on the gauge, it will be created
 */
export function setRewardData(
  gaugeAddress: Address,
  tokenAddress: Address,
): void {
  let gauge = LiquidityGauge.load(gaugeAddress.toHex());
  if (!gauge) return;

  // On L1 gauges and child chains gauges V2, reward data is stored in the gauge itself
  // On child chains gauges V1, reward data is stored in the streamer contract
  // Moreover, the output of reward_data() is different for mainnet vs child chain gauges V1 vs child chain gauges V2.
  // This means we can't reuse the same contract on .bind, so we make speficic functions for each case

  let reward_data: RewardData;
  let streamer = gauge.streamer;
  if (streamer) {
    let streamerAddress = bytesToAddress(streamer);
    reward_data = readRewardDataFromStreamer(streamerAddress, tokenAddress);
  } else if (isL1Factory(Address.fromString(gauge.factory))) {
    reward_data = readRewardDataFromL1Gauge(gaugeAddress, tokenAddress);
  } else {
    reward_data = readRewardDataFromChildChainLiquidityGaugeV2(
      gaugeAddress,
      tokenAddress,
    );
  }

  if (reward_data.reverted) return;

  // getRewardToken will create the token if it does not exist
  const rewardToken = getRewardToken(tokenAddress, gaugeAddress);
  rewardToken.periodFinish = reward_data.period_finish;
  rewardToken.rate = scaleDown(reward_data.rate, rewardToken.decimals);
  if (reward_data.received.gt(ZERO)) {
    rewardToken.totalDeposited = scaleDown(
      reward_data.received,
      rewardToken.decimals,
    );
  }
  rewardToken.save();
}

function readRewardDataFromStreamer(
  streamerAddress: Address,
  tokenAddress: Address,
): RewardData {
  let rewardData = new RewardData();
  let streamerContract = ChildChainStreamer.bind(streamerAddress);
  let rewardDataCall = streamerContract.try_reward_data(tokenAddress);
  if (rewardDataCall.reverted) {
    log.warning(
      'readRewardDataFromStreamer Call to reward_data() failed: {} {}',
      [streamerAddress.toHexString(), tokenAddress.toHexString()],
    );
    rewardData.reverted = true;
  } else {
    rewardData.rate = rewardDataCall.value.rate;
    rewardData.period_finish = rewardDataCall.value.period_finish;
    rewardData.received = rewardDataCall.value.received;
  }
  return rewardData;
}

function readRewardDataFromL1Gauge(
  gaugeAddress: Address,
  tokenAddress: Address,
): RewardData {
  let rewardData = new RewardData();
  let gaugeContract = LiquidityGaugeTemplate.bind(gaugeAddress);
  let rewardDataCall = gaugeContract.try_reward_data(tokenAddress);
  if (rewardDataCall.reverted) {
    log.warning(
      'readRewardDataFromL1Gauge Call to reward_data() failed: {} {}',
      [gaugeAddress.toHexString(), tokenAddress.toHexString()],
    );
    rewardData.reverted = true;
  } else {
    rewardData.rate = rewardDataCall.value.rate;
    rewardData.period_finish = rewardDataCall.value.period_finish;
  }
  return rewardData;
}

function readRewardDataFromChildChainLiquidityGaugeV2(
  gaugeAddress: Address,
  tokenAddress: Address,
): RewardData {
  let rewardData = new RewardData();
  let gaugeContract = ChildChainLiquidityGaugeV2.bind(gaugeAddress);
  let rewardDataCall = gaugeContract.try_reward_data(tokenAddress);
  if (rewardDataCall.reverted) {
    log.warning(
      'readRewardDataFromChildChainLiquidityGaugeV2 Call to reward_data() failed: {} {}',
      [gaugeAddress.toHexString(), tokenAddress.toHexString()],
    );
    rewardData.reverted = true;
  } else {
    rewardData.rate = rewardDataCall.value.rate;
    rewardData.period_finish = rewardDataCall.value.period_finish;
  }
  return rewardData;
}
