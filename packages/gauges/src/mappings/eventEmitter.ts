import { LogArgument } from "../types/EventEmitter/EventEmitter";
import { Pool, LiquidityGauge, GaugeInjector } from "../types/schema";
import { GaugeInjector as GaugeInjectorTemplate } from "../types/templates";
import { setRewardData } from "../helpers/gauge";
import { bytesToAddress } from "../helpers/misc";

export function handleLogArgument(event: LogArgument): void {
  const identifier = event.params.identifier.toHexString();

  // convention: identifier = keccak256(function_name)
  // keccak256(setPreferentialGauge) = 0x88aea7780a038b8536bb116545f59b8a089101d5e526639d3c54885508ce50e2
  if (
    identifier ==
    "0x88aea7780a038b8536bb116545f59b8a089101d5e526639d3c54885508ce50e2"
  ) {
    setPreferentialGauge(event);
  }
  // keccak256(setChildChainGaugeRewardsData) = 0x685ed9250f0df428a962860f87b2d95fbbd38473b0f6773f3650d19ffbbb9fb5
  if (
    identifier ==
    "0x94e5a0dff823a8fce9322f522279854e2370a9ef309a74a7a86367e2a2872b2d"
  ) {
    setGaugeRewardsData(event);
  }
  // keccak256(setGaugeInjector) = 0x109783b117ecbf8caf4e937abaf494b965e5d90c4d1b010b27eb2a3be80eaf21
  if (
    identifier ==
    "0x109783b117ecbf8caf4e937abaf494b965e5d90c4d1b010b27eb2a3be80eaf21"
  ) {
    setGaugeInjector(event);
  }
}

function setGaugeRewardsData(event: LogArgument): void {
  /**
   * Sets the reward data for all reward tokens of a given gauge
   *
   * @param message - The gauge address (eg. 0x12345abce... - all lowercase)
   */
  const gaugeAddress = event.params.message;
  const gauge = LiquidityGauge.load(gaugeAddress.toHexString());
  if (!gauge) return;

  const rewardTokens = gauge.rewardTokensList;
  if (!rewardTokens) return;

  for (let i: i32 = 0; i < rewardTokens.length; i++) {
    setRewardData(
      bytesToAddress(gaugeAddress),
      bytesToAddress(rewardTokens[i])
    );
  }
}

function setPreferentialGauge(event: LogArgument): void {
  /**
   * Sets/Unsets a gauge as the preferential gauge
   * It is expected that a new gauge will be set as preferential after unsetting the old one
   *
   * @param message - The gauge address (eg. 0x12345abce... - all lowercase)
   * @param value - 0 if prefentialGauge is to be set false; any other value sets it to true
   */ //
  const gaugeId = event.params.message.toHexString();
  const gauge = LiquidityGauge.load(gaugeId);
  if (!gauge) return;

  if (event.params.value.toI32() == 0) {
    gauge.isPreferentialGauge = false;
    // Update Pool's preferentialGauge

    let poolId = gauge.pool;
    if (poolId === null) return;

    let pool = Pool.load(poolId);
    if (pool == null) return;

    pool.preferentialGauge = "";
    pool.save();
  } else {
    gauge.isPreferentialGauge = true;
    // Update Pool's preferentialGauge

    let poolId = gauge.pool;
    if (poolId === null) return;

    let pool = Pool.load(poolId);
    if (pool == null) return;

    pool.preferentialGauge = gaugeId;
    pool.save();
  }
  gauge.save();
}

export function setGaugeInjector(event: LogArgument): void {
  /**
   * Sets a new GaugeInjector - creates entity and template
   *
   * @param message - The GaugeInjector address (eg. 0x12345abce... - all lowercase)
   */
  const injectorId = event.params.message.toHexString();

  let injector = GaugeInjector.load(injectorId);
  if (injector) return; // already exists, no need to re-create it

  injector = new GaugeInjector(injectorId);
  injector.save();

  const injectorAddress = bytesToAddress(event.params.message);
  GaugeInjectorTemplate.create(injectorAddress);
}
