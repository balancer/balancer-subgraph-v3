import { EmissionsInjection } from "../types/templates/GaugeInjector/GaugeInjector";
import { setRewardData } from "../helpers/gauge";

export function handleEmissionsInjection(event: EmissionsInjection): void {
  setRewardData(event.params.gauge, event.params.token);
}
