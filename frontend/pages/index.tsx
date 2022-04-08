import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import type { Near, WalletConnection } from "near-api-js";

import getNearConfig from "../pages_util/near-api-util/near-config";
import initNearWallet, {
  signInToNearWallet,
  signOutFromNearWallet,
} from "../pages_util/near-api-util/near-wallet-util";

const Home: NextPage = () => {
  const router = useRouter();
  const [near, setNear] = useState<Near>();
  const [wallet, setWallet] = useState<WalletConnection>();

  const initNear = async (): Promise<void> => {
    const nearConfig = getNearConfig("dev");
    const rawNear = await initNearWallet(nearConfig);

    if (rawNear) {
      setNear(rawNear.near);
      if (rawNear.wallet.isSignedIn()) {
        setWallet(rawNear.wallet);
      }
      console.log("initNear", rawNear);
    }
  };

  const connectWallet = async (): Promise<void> => {
    if (near) {
      const signedInWallet = await signInToNearWallet(near);
      setWallet(signedInWallet);
    }
  };

  const signOutOfWallet = async (): Promise<void> => {
    if (wallet) {
      await signOutFromNearWallet(wallet);
      setWallet(undefined);
      router.push("/");
    }
  };

  useEffect(() => {
    initNear();
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
