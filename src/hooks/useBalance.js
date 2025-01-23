import { useState, useEffect, useCallback } from 'react';
import { useAtom } from 'jotai';
import {
  walletAtom,
  walletConnectedAtom,
  balanceAtom,
  balanceRefreshTriggerAtom,
} from '../atoms';

const useBalance = (refreshInterval = 10000) => {
  const [wallet] = useAtom(walletAtom);
  const [walletConnected] = useAtom(walletConnectedAtom);
  const [balance, setBalance] = useAtom(balanceAtom);
  const [, triggerRefresh] = useAtom(balanceRefreshTriggerAtom);
  const [satsBalance, setSatsBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoize fetchBalance to avoid creating a new function on each render
  const fetchBalance = useCallback(async () => {
    if (!wallet || !walletConnected || !wallet.walletInfo?.cashAddress) {
      setBalance(0); // Reset to 0 if wallet is not available
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const sats = await wallet.getBalance(wallet.walletInfo.cashAddress);
      setSatsBalance(sats);
      const bchBalance = wallet.bchjs.BitcoinCash.toBitcoinCash(sats); // Convert to BCH
      setBalance(bchBalance); // Update atom with BCH balance
      setError(null);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      setError(error.message || 'An error occurred');
      setBalance(0); // Reset to 0 in case of an error
      setSatsBalance(0);
    } finally {
     setLoading(false);
    }
  }, [wallet, walletConnected, setBalance]);

  useEffect(() => {
    if (walletConnected) {
      fetchBalance(); // Fetch balance when wallet connects
      const interval = setInterval(fetchBalance, refreshInterval); // Refresh every 5 seconds
      return () => clearInterval(interval); // Cleanup interval on unmount or disconnect
    }
  }, [walletConnected, fetchBalance, refreshInterval, triggerRefresh]);

  return { balance, satsBalance, loading, error };
};

export default useBalance;

