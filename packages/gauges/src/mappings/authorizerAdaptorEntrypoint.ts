import { Bytes } from "@graphprotocol/graph-ts";
import { ActionPerformed } from "../types/AuthorizerAdaptorEntrypoint/authorizerAdaptorEntrypoint";
import { bytesToAddress } from "../helpers/misc";
import { setRewardData } from "../helpers/gauge";
import { LiquidityGauge } from "../types/schema";

/**
 * When a reward token is added to a gauge via the AuthorizerAdaptorEntrypoint, we set the reward data for that token
 * In doing so, we create the reward token entity if it does not exist, as well as an entry in the gauge's rewardTokensList
 */
function handleAddRewardToken(event: ActionPerformed): void {
  const gaugeAddress = event.params.target;
  const callData = event.params.data;
  // parse callData, which is a 4-byte selector, followed by a 32-byte token address followed by a 32-byte distributor address
  let token = Bytes.fromUint8Array(callData.subarray(16, 36));
  let tokenAddress = bytesToAddress(token);

  let gauge = LiquidityGauge.load(gaugeAddress.toHexString());
  if (!gauge) return;

  setRewardData(gaugeAddress, tokenAddress);
}

export function handleActionPerformed(event: ActionPerformed): void {
  const selector = event.params.selector.toHexString();
  if (selector == "0xe8de0d4d") {
    // add_reward(_reward_token (address), _distributor (address))
    handleAddRewardToken(event);
  }
}
