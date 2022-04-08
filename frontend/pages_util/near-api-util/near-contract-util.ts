import * as nearAPI from "near-api-js";
import type { NearConfig } from "././near-config";

export async function initCounterContract(
  wallet: nearAPI.WalletConnection,
  nearConfig: NearConfig
): Promise<nearAPI.Contract> {
  const methodOptions = {
    viewMethods: ["get_num"],
    changeMethods: ["increment", "decrement"],
  };

  const contract = new nearAPI.Contract(
    wallet.account(),
    nearConfig.contractName,
    methodOptions
  );

  return contract;
}

export async function callGetNumFromContract(
  counterContract: nearAPI.Contract
) {
  // @ts-expect-error
  const num: number = await counterContract.get_num();
  console.log(num);
  return num;
}

export async function callIncrementFromContract(
  counterContract: nearAPI.Contract
) {
  // @ts-expect-error
  await counterContract.increment();
  const num: number = await callGetNumFromContract(counterContract);
  return num;
}

export async function callDecrementFromContract(
  counterContract: nearAPI.Contract
) {
  // @ts-expect-error
  await counterContract.decrement();
  const num: number = await callGetNumFromContract(counterContract);
  return num;
}
