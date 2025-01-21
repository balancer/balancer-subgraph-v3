import { Address, Bytes } from "@graphprotocol/graph-ts";

import { handlePoolCreated, PoolType } from "./common";
import { PoolCreated } from "../types/QuantAMMWeightedPoolFactory/QuantAMMWeightedPoolFactory";
import { QuantAMMWeightedPool } from "../types/QuantAMMWeightedPoolFactory/QuantAMMWeightedPool";
import { QuantAMMWeightedPoolDetails } from "../types/schema";

const CATEGORIES = ["filter", "overview", "deployment", "ruleDetail"];

const NAMES = [
  ["chain"], // filter
  ["adaptabilityScore"], // overview
  ["chain"], // deployment
  ["ruleName", "updateInterval"], // ruleDetail
];

function handleQuantAMMWeightedPoolParams(poolAddress: Address): Bytes {
  let quantAMMWeightedPool = QuantAMMWeightedPool.bind(poolAddress);
  let quantAMMWeightedPoolDetails = new QuantAMMWeightedPoolDetails(
    poolAddress
  );

  quantAMMWeightedPoolDetails.poolDetails = [];

  CATEGORIES.forEach((category, index) => {
    NAMES[index].forEach((name) => {
      let poolDetailResult = quantAMMWeightedPool.try_getPoolDetail(
        category,
        name
      );
      if (!poolDetailResult.reverted) {
        const values = [
          category,
          name,
          poolDetailResult.value.getValue0(),
          poolDetailResult.value.getValue1(),
        ];
        quantAMMWeightedPoolDetails.poolDetails!.push(values);
      }
    });
  });

  quantAMMWeightedPoolDetails.save();
  return quantAMMWeightedPoolDetails.id;
}

export function handleQuantAMMWeightedPoolCreated(event: PoolCreated): void {
  handlePoolCreated(
    event.params.pool,
    event.address, // Factory
    PoolType.QuantAMMWeighted,
    1,
    handleQuantAMMWeightedPoolParams,
    "poolDetail"
  );
}
