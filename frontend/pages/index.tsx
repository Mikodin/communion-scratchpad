import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import type { Near, WalletConnection } from "near-api-js";
import type { AccountBalance } from "near-api-js/lib/account";

import getNearConfig from "../pages_util/near-api-util/near-config";
import initNearWallet, {
  signInToNearWallet,
  signOutFromNearWallet,
} from "../pages_util/near-api-util/near-wallet-util";

const Home: NextPage = () => {
  const router = useRouter();
  const [near, setNear] = useState<Near>();
  const [wallet, setWallet] = useState<WalletConnection>();
  const [walletBalance, setWalletBalance] = useState<AccountBalance>();

  const initNear = async (): Promise<void> => {
    const nearConfig = getNearConfig("dev");
    const rawNear = await initNearWallet(nearConfig);

    if (rawNear) {
      setNear(rawNear.near);
      if (rawNear.wallet.isSignedIn()) {
        setWallet(rawNear.wallet);
        console.log(await rawNear.wallet.account().getAccountDetails());
        console.log(await rawNear.wallet.account().getAccountBalance());
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
    if (!near) {
      initNear();
    }
  }, [near]);

  useEffect(() => {
    console.log("fire once");
    const getWalletBalance = async (): Promise<void> => {
      if (wallet) {
        const balance = await wallet.account().getAccountBalance();
        setWalletBalance(balance);
      }
    };
    getWalletBalance();
  }, [wallet]);

  return (
    <div className="">
      <main>
        <div className="flex flex-col place-items-center p-5">
          <h1 className="text-3xl">Welcome to some NEAR goodness</h1>

          {wallet ? (
            <>
              <p>{wallet.getAccountId()}</p>
              <button onClick={signOutOfWallet}>Sign Out of Wallet</button>
              <p>Balance: {walletBalance?.available}</p>
            </>
          ) : (
            <button onClick={connectWallet}>Connect Wallet</button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
