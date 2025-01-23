import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { walletConnectedAtom } from '../atoms';
import { useBalance, useBchPrice } from '../hooks';

const Balance = ({ showValue = true }) => {
  const [walletConnected] = useAtom(walletConnectedAtom);
  const { price } = useBchPrice(showValue, 2*60*1000); // refresh every 5 min
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
    <>
      {balanceError && <p>Error: {balanceError}</p>}
      {isValidBalance ? (
        <p className="balance"><strong>Balance:</strong> {balance} BCH ({satsBalance} sats)</p>
      ) : (
        <p className="balance">Wallet is empty.</p>
      )}
      {showValue && balanceInUsd !== null && (
        <p className="balance"><strong>Value:</strong> ${balanceInUsd} USD (BCH price is ${price})</p>
      )}
    </>
  );
};

Balance.propTypes = {
  showValue: PropTypes.bool, // Whether to display value in USD
}

export default Balance;
