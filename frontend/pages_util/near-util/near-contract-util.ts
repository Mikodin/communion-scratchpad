import * as nearAPI from "near-api-js";
import type { NearConfig } from "./near-config";

export interface CounterNearContract extends nearAPI.Contract {
  increment: () => Promise<void>;
  decrement: () => Promise<void>;
  get_num: () => Promise<number>;
}

export async function initCounterContract(
  wallet: nearAPI.WalletConnection,
  nearConfig: NearConfig
): Promise<CounterNearContract> {
  const methodOptions = {
    viewMethods: ["get_num"],
    changeMethods: ["increment", "decrement"],
  };

  const contract = new nearAPI.Contract(
    wallet.account(),
    nearConfig.contractName,
    methodOptions
  );

  // @ts-expect-error - increment, decrement, get_num are added via the methodOptions
  return contract;
}

export async function callGetNumFromContract(
  counterContract: CounterNearContract
) {
  const num: number = await counterContract.get_num();
  return num;
}

export async function callIncrementFromContract(
  counterContract: CounterNearContract
) {
  await counterContract.increment();
  const num: number = await callGetNumFromContract(counterContract);
  return num;
}

export async function callDecrementFromContract(
  counterContract: CounterNearContract
) {
  await counterContract.decrement();
  const num: number = await callGetNumFromContract(counterContract);
  return num;
}
