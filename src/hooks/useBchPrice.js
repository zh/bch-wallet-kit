import { useCallback, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { priceAtom } from '../atoms';

const useBchPrice = (refreshPrice = true, refreshInterval = 10000) => {
  const [price, setPrice] = useAtom(priceAtom);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrice = useCallback(async () => {
    if (!refreshPrice) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BCHUSDT');
      const data = await response.json();
      if (price !== data.price) {
        setPrice(parseFloat(data.price));
      }
    } catch (err) {
      setError('Failed to fetch BCH price: ', err);
    } finally {
      setLoading(false);
    }
  }, [refreshPrice, price, setPrice]);

  useEffect(() => {
    if (refreshPrice) {
      console.log('refresh price');
      fetchPrice();
      const interval = setInterval(fetchPrice, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshPrice, fetchPrice, refreshInterval]);

  return { price, loading, error };
};

export default useBchPrice;

