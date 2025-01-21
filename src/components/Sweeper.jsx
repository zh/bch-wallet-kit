// src/components/Sweeper.js
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAtom } from 'jotai';
import Sweep from 'bch-token-sweep';
import { busyAtom, walletAtom, walletConnectedAtom } from '../atoms';
import QrCodeScanner from './QrCodeScanner';

const Sweeper = () => {
  const [wallet] = useAtom(walletAtom);
  const [walletConnected] = useAtom(walletConnectedAtom);
  const [busy, setBusy] = useAtom(busyAtom);
  const [sweepKey, setSweepKey] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const validWIF = (WIF) => {
    if (typeof WIF !== 'string') return false;
    if (WIF.length !== 52) return false;
    if (WIF[0] !== 'L' && WIF[0] !== 'K') return false;
    return true;
  };

  const handleAddressDetected = (scannedData) => {
    if (!walletConnected) {
      toast.error('Wallet is not connected.');
      return;
    }

    if (Array.isArray(scannedData) && scannedData.length > 0) {
      // Extract the first item's rawValue (the actual address)
      const key = scannedData[0].rawValue;
      setSweepKey(key); // Set the address in the state
    } else {
      console.error('Invalid scanned data:', scannedData);
    }
    setShowScanner(false);
  };

  const handleSweep = async () => {
    if (!walletConnected) {
      toast.error('Wallet is not connected.');
      return;
    }

    if (!sweepKey.trim()) {
      toast.error('Private key cannot be empty.');
      return;
    }

    if (!validWIF(sweepKey)) {
      toast.error('Private key is not valid.');
      return;
    }

    try {
      const privateKey = wallet?.walletInfo?.privateKey;
      const slpAddress = wallet?.walletInfo?.slpAddress;
      if (!privateKey || !slpAddress) throw new Error('Wallet info is invalid.');
      const sweeper = new Sweep(sweepKey, privateKey, wallet);
      if (!sweeper) throw new Error('Sweep library is invalid.');

      setBusy(true);
      await sweeper.populateObjectFromNetwork();
      // Constructing the sweep transaction
      const transactionHex = await sweeper.sweepTo(slpAddress);
      const txid = await sweeper.blockchain.broadcast(transactionHex);
      console.log(`txid: ${txid}`);
      var explorerUrl = `https://blockchair.com/bitcoin-cash/transaction/${txid}`;
      console.log(`explorer 1: ${explorerUrl}`);
      explorerUrl = `https://bch.loping.net/tx/${txid}`;
      console.log(`explorer 2: ${explorerUrl}`);
      toast.success('Funds swept successfully!');
    } catch (error) {
      console.error('Error sweeping wallet:', error);
      toast.error('Failed to sweep wallet. Please check the private key and try again.');
    } finally {
      setBusy(false);
      setSweepKey(''); // Reset private key field
    }
  };

  return (
    <div className="container sweeper-container">
      <fieldset className="form-group">
        <legend>[ Sweep ]</legend>
        <label htmlFor="private-key" className="form-label">Private Key</label>
        <div className="form-input-group">
          <input
            id="private-key"
            type="text"
            value={sweepKey}
            onChange={(e) => setSweepKey(e.target.value)}
            disabled={busy}
            className="form-input"
            placeholder="Enter private key (WIF format)"
          />
          <button
            onClick={() => setShowScanner(true)}
            disabled={busy}
            className="scan-button"
          >
            Scan QR
          </button>
          <button
            onClick={handleSweep}
            className="sweep-button"
            disabled={!walletConnected || busy || !validWIF(sweepKey)}
          >
            Sweep
          </button>
        </div>
        {showScanner && (
         <div>
           <button
              disabled={busy}
              className="close-scanner-button"
              onClick={() => setShowScanner(false)}
           >
             Close Scanner
           </button>
           <QrCodeScanner onAddressDetected={handleAddressDetected} />
         </div>
        )}
      </fieldset>
    </div>
  );
};

export default Sweeper;

