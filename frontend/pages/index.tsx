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
      setCounterContract(undefined);
      router.push("/");
    }
  };

  const callCounterContract = async (contractFn: Function): Promise<void> => {
    const num = await contractFn(counterContract);
    const newAccountBalance = await wallet?.account().getAccountBalance();

    setWalletBalance(newAccountBalance);
    setCounterContractValue(num);
  };

  useEffect(() => {
    const initNear = async () => {
      const nearConfig = getNearConfig("dev");
      const rawNear = await initNearWallet(nearConfig);

      if (rawNear) {
        setNear(rawNear.near);
      }

      if (rawNear?.wallet.isSignedIn()) {
        setWallet(rawNear.wallet);
      }
    };

    if (!near) {
      initNear();
    }
  }, [near]);

  useEffect(() => {
    const initWalletBalance = async () => {
      const balance = await wallet?.account().getAccountBalance();
      setWalletBalance(balance);
    };

    if (wallet?.isSignedIn()) {
      initWalletBalance();
    }
  }, [wallet]);

  useEffect(() => {
    const initNearContract = async () => {
      // Redundant, but typescript
      if (wallet) {
        const contract = await initCounterContract(
          wallet,
          getNearConfig("dev")
        );
        setCounterContract(contract);
      }
    };

    if (!counterContract && wallet) {
      initNearContract();
    }
  }, [wallet, counterContract]);

  return (
    <div>
      <main>
        <div className="flex flex-col place-items-center p-5">
          <h1 className="text-3xl">Welcome to some NEAR goodness</h1>
          {wallet && (
            <div className="my-5">
              <p>Connected Wallet: </p>
              <span>{wallet.getAccountId()}</span>
              <p className="mt-1">Balance:</p>
              <span>{walletBalance?.available}</span>
            </div>
          )}

          {counterContract && (
            <>
              <button
                onClick={async () => {
                  callCounterContract(callGetNumFromContract);
                }}
                className="bg-blue-400 text-white py-2 px-4 rounded"
              >
                Get Counter Number
              </button>
              <button
                className="mt-2 bg-blue-400 text-white py-2 px-2 rounded"
                onClick={async () => {
                  callCounterContract(callIncrementFromContract);
                }}
              >
                + Increment
              </button>
              <button
                className="mt-2 bg-blue-400 text-white py-2 px-2 rounded"
                onClick={async () => {
                  callCounterContract(callDecrementFromContract);
                }}
              >
                - Decrement
              </button>
              <p>Counter Num: {counterContractValue}</p>
            </>
          )}

          {wallet ? (
            <>
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
        </div>
      </main>
    </div>
  );
};

export default Home;
