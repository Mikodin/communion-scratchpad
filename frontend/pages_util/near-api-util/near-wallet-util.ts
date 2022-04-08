import * as nearAPI from "near-api-js";
const { connect, keyStores, WalletConnection } = nearAPI;

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
    const wallet = new nearAPI.WalletAccount(near, null);
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
): Promise<nearAPI.WalletConnection> {
  const wallet = new WalletConnection(rawNear, null);

  if (wallet.isSignedIn()) {
    return wallet;
  }

  await wallet.requestSignIn(
    "example-contract.testnet", // contract requesting access
    "Example App", // optional
    "http://localhost:3000", // optional
    "http://localhost:3000" // optional
  );

  return wallet;
}

export async function signOutFromNearWallet(
  wallet: nearAPI.WalletConnection
): Promise<void> {
  await wallet.signOut();
  await wallet._keyStore.clear();
  // @TODO figure out where that this is coming from :)
  localStorage.removeItem("undefined_wallet_auth_key");
}
