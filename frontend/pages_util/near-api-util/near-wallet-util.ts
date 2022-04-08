import * as nearAPI from "near-api-js";
const { WalletConnection } = nearAPI;

import type { NearConfig } from "./near-config";

export default async function initNearWallet(config: NearConfig): Promise<
  | {
      near: nearAPI.Near;
      wallet: nearAPI.WalletConnection;
      accountId: string;
    }
  | undefined
> {
  try {
    const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
    const near = await nearAPI.connect(
      // @ts-expect-error
      Object.assign(
        {
          deps: { keyStore },
        },
        config
      )
    );
    const wallet = new nearAPI.WalletAccount(near, "communion-scratchpad");
    const accountId = wallet.getAccountId();

    return {
      near,
      wallet,
      accountId,
    };
  } catch (error) {
    console.log("Error in initNearWallet", error);
  }
}

export async function signInToNearWallet(
  rawNear: nearAPI.Near
): Promise<nearAPI.WalletConnection | undefined> {
  try {
    const wallet = new WalletConnection(rawNear, "communion-scratchpad");

    if (wallet.isSignedIn()) {
      return wallet;
    }

    await wallet.requestSignIn(
      "mikedev-scratchpad-counter.testnet", // contract requesting access
      "Scratchpad Counter", // optional
      "http://localhost:3000", // optional
      "http://localhost:3000" // optional
    );

    return wallet;
  } catch (error) {
    console.error("Error in signInToNearWallet", error);
  }
}

export async function signOutFromNearWallet(
  wallet: nearAPI.WalletConnection
): Promise<void> {
  try {
    await wallet.signOut();
    await wallet._keyStore.clear();
    // @TODO figure out where that this is coming from :)
    localStorage.removeItem("communion-scratchpad_wallet_auth_key");
  } catch (error) {
    console.error("Error in signOutFromNearWallet", error);
  }
}
