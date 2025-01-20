import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { priceAtom } from '../atoms';

const useBchPrice = (refreshInterval = 10000) => {
  const [price, setPrice] = useAtom(priceAtom);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BCHUSDT');
        const data = await response.json();
        setPrice(parseFloat(data.price));
      } catch (err) {
        setError('Failed to fetch BCH price: ', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, setPrice]);

  return { price, loading, error };
};

export default useBchPrice;

