import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { walletConnectedAtom } from '../atoms';
import { useBalance, useBchPrice } from '../hooks';

const Balance = () => {
  const [walletConnected] = useAtom(walletConnectedAtom);
  const { price } = useBchPrice(5*60*1000); // refresh every 5 min
  const { satsBalance, balance, error: balanceError } = useBalance(20*1000); // every 20 sec

  const isValidBalance = balance !== null && typeof balance === 'number' && balance > 0;
  const isValidPrice = price !== null && typeof price === 'number' && price > 0;

  const balanceInUsd = useMemo(() => {
    if (isValidBalance && isValidPrice) {
      return (balance * price).toFixed(2);
    }
    return null;
  }, [balance, price, isValidBalance, isValidPrice]);

  if (!walletConnected) return;

  return (
    <div className="container balance-container">
      <fieldset className="form-group">
        <legend>[ Balance ]</legend>
        {balanceError && <p>Error: {balanceError}</p>}
        {isValidBalance ? (
           <p className="balance"><strong>Balance:</strong> {balance} BCH ({satsBalance} sats)</p>
        ) : (
           <p className="balance">Wallet is empty.</p>
        )}
        {balanceInUsd !== null && (
           <p className="balance"><strong>Value:</strong> ${balanceInUsd} USD (BCH price is ${price})</p>
        )}
      </fieldset>
    </div>
  );
};

export default Balance;
