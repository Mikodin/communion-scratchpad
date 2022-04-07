import type { NextPage } from "next";
import { useState, useEffect } from "react";
import type { Near, WalletConnection } from "near-api-js";

import getNearConfig from "../pages_util/near-api-util/near-config";
import initNearWallet, {
  signInToNearWallet,
  signOutFromNearWallet,
} from "../pages_util/near-api-util/near-wallet-util";

const Home: NextPage = () => {
  const [near, setNear] = useState<Near>();
  const [wallet, setWallet] = useState<WalletConnection>();

  const initNear = async (): Promise<void> => {
    try {
      const nearConfig = getNearConfig("dev");
      const rawNear = await initNearWallet(nearConfig);
      if (rawNear) {
        setNear(rawNear.near);
        if (rawNear.wallet.isSignedIn()) {
          setWallet(rawNear.wallet);
        }
        console.log("initNear", rawNear);
      }
    } catch (e) {
      console.log("initNear error", e);
    }
  };

  const connectWallet = async (): Promise<void> => {
    try {
      if (near) {
        const signedInWallet = await signInToNearWallet(near);
        setWallet(signedInWallet);
      }
    } catch (e) {
      console.log("connectWallet error", e);
    }
  };

  const signOutOfWallet = async (): Promise<void> => {
    try {
      if (wallet) {
        const signedOutWallet = await signOutFromNearWallet(wallet);
        setWallet(undefined);
        console.log(signedOutWallet);
      }
    } catch (e) {
      console.log("signOutOfWallet", e);
    }
  };

  useEffect(() => {
    try {
      initNear();
    } catch (error) {
      console.log("error on mount", error);
    }
  }, []);

  return (
    <div className="flex flex-col">
      <main className="p-5">
        <h1 className="text-center text-3xl">
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        <h1 className="text-center text-3xl font-bold">
          Hello Tailwind, you so cute 🧡!
        </h1>

        {!wallet && <button onClick={connectWallet}>Connect Wallet</button>}
        {wallet && (
          <div>
            <p>{wallet.getAccountId()}</p>
            <button onClick={signOutOfWallet}>Sign Out of Wallet</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
