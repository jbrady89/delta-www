import { useWallet } from 'use-wallet';
import { useEffect, useState } from 'react';
import useYam from './useYam';
import { hooks } from '../helpers';
import { DATA_UNAVAILABLE } from '../config';

const REFRESH_RATE = 5 * 1000;
const initialState = DATA_UNAVAILABLE;

const useEthBalance = () => {
  const yam = useYam();
  const wallet = useWallet();

  const [ethBalance, setEthBalance] = useState(initialState);

  async function update() {
    const balance = (await yam.web3.eth.getBalance(wallet.account)) / 1e18;
    setEthBalance(balance);
  }

  useEffect(() => {
    let interval;

    if (yam) {
      interval = hooks.setWalletAwareInterval(wallet, update, REFRESH_RATE);
    }

    return () => clearInterval(interval);
  }, [yam, wallet]);

  return ethBalance;
};

export default useEthBalance;
