import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import type { Near, WalletConnection, Contract } from "near-api-js";
import type { AccountBalance } from "near-api-js/lib/account";

import getNearConfig from "../pages_util/near-api-util/near-config";
import initNearWallet, {
  signInToNearWallet,
  signOutFromNearWallet,
} from "../pages_util/near-api-util/near-wallet-util";
import {
  initCounterContract,
  callGetNumFromContract,
  callIncrementFromContract,
  callDecrementFromContract,
} from "../pages_util/near-api-util/near-contract-util";

const Home: NextPage = () => {
  const router = useRouter();
  const [near, setNear] = useState<Near>();
  const [wallet, setWallet] = useState<WalletConnection>();
  const [counterContract, setCounterContract] = useState<Contract>();
  const [counterContractValue, setCounterContractValue] = useState<number>();
  const [walletBalance, setWalletBalance] = useState<AccountBalance>();

  const initNear = async (): Promise<void> => {
    console.log("Init Near");
    const nearConfig = getNearConfig("dev");
    const rawNear = await initNearWallet(nearConfig);

    if (rawNear) {
      setNear(rawNear.near);
    }

    if (rawNear?.wallet.isSignedIn()) {
      setWallet(rawNear.wallet);
    }
  };

  const initNearCounterContract = async (): Promise<void> => {
    if (!counterContract && near && wallet) {
      const contract = await initCounterContract(wallet, getNearConfig("dev"));
      console.log(contract);
      setCounterContract(contract);
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

  const getWalletBalance = async (): Promise<void> => {
    if (wallet) {
      console.log("getWalletBalance");
      const balance = await wallet.account().getAccountBalance();
      setWalletBalance(balance);
    }
  };

  useEffect(() => {
    const initAsync = async (): Promise<void> => {
      if (!near) {
        await initNear();
      }
    };

    initAsync();
  }, [near]);

  useEffect(() => {
    const initAsync = async (): Promise<void> => {
      if (wallet) {
        await getWalletBalance();
      }
    };
    initAsync();
  }, [wallet]);

  useEffect(() => {
    const initAsync = async (): Promise<void> => {
      await initNearCounterContract();
    };

    initAsync();
  }, [near, wallet]);

  const callCounterContract = async (contractFn: Function): Promise<void> => {
    const num = await contractFn(counterContract);
    await getWalletBalance();
    setCounterContractValue(num);
  };

  return (
    <div className="">
      <main>
        <div className="flex flex-col place-items-center p-5">
          <h1 className="text-3xl">Welcome to some NEAR goodness</h1>

          {wallet ? (
            <>
              <p>Connected Wallet: {wallet.getAccountId()}</p>
              <p>Balance: {walletBalance?.available}</p>

              <button
                type={"button"}
                onClick={signOutOfWallet}
                className="mt-10 bg-rose-400 text-white py-2 px-4 rounded-full"
              >
                Sign Out of Wallet
              </button>
            </>
          ) : (
            <button
              type={"button"}
              onClick={connectWallet}
              className="mt-10 bg-blue-400 text-white py-2 px-4 rounded-full"
            >
              Connect Wallet
            </button>
          )}

          {wallet && counterContract && (
            <>
              <button
                onClick={async () => {
                  callCounterContract(callGetNumFromContract);
                }}
              >
                Get Counter Number
              </button>
              <button
                onClick={async () => {
                  callCounterContract(callIncrementFromContract);
                }}
              >
                Increment
              </button>
              <button
                onClick={async () => {
                  callCounterContract(callDecrementFromContract);
                }}
              >
                Decrement
              </button>
              <p>Counter Num: {counterContractValue}</p>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
