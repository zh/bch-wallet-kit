// src/components/SendBCH.js
import { useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import {
  notificationAtom,
  busyAtom,
  balanceAtom,
  walletAtom,
  walletConnectedAtom
} from '../atoms';
import QrCodeScanner from './QrCodeScanner';

const SendBCH = () => {
  const [wallet] = useAtom(walletAtom);
  const [walletConnected] = useAtom(walletConnectedAtom);
  const [balance] = useAtom(balanceAtom);
  const setNotification = useSetAtom(notificationAtom);
  const isValidBalance = balance !== null && typeof balance === 'number' && balance > 0;
  const [busy, setBusy] = useAtom(busyAtom);

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  if (!isValidBalance) {
    console.log('Wallet is empty.');
    return;
  }

  const handleAddressDetected = (scannedData) => {
    if (!walletConnected) {
      setNotification({ type: 'error', message: 'Wallet is not connected.' });
      return;
    }

    if (Array.isArray(scannedData) && scannedData.length > 0) {
      // Extract the first item's rawValue (the actual address)
      const address = scannedData[0].rawValue;
      console.log('address: ', address);
      setRecipient(address); // Set the address in the state
    } else {
      console.error('Invalid scanned data:', scannedData);
    }
    setShowScanner(false);
  };

  const handleSend = async () => {
    if (!walletConnected) {
      setNotification({ type: 'error', message: 'Wallet is not connected.' });
      return;
    }

    if (!recipient.trim()) {
      setNotification({ type: 'error', message: 'Recipient address cannot be empty.' });
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setNotification({ type: 'error', message: 'Amount must be a positive number.' });
      return;
    }

    try {
      if (amount < 0.00000546) {
        throw new Error('Trying to send less than dust.');
      }
      const bchjs = wallet.bchjs;
      let bchAddr = recipient;
      // If the address is an SLP address, convert it to a cash address.
      if (!bchAddr.includes('bitcoincash:')) {
        bchAddr = bchjs.SLP.Address.toCashAddress(bchAddr);
      }
      const sats = bchjs.BitcoinCash.toSatoshi(amount);
      const satsBalance = bchjs.BitcoinCash.toSatoshi(balance);
      if (sats > satsBalance) {
        throw new Error('Trying to send more then MAX.');
      }
      console.log(`Sending ${sats} sats to ${bchAddr}`);

      setBusy(true);
      console.log('Updating UTXO...');
      await wallet.getUtxos();

      const receivers = [
        {
          address: recipient,
          amountSat: sats,
        },
      ];

      const txid = await wallet.send(receivers);
      console.log(`txid: ${txid}`);
      var explorerUrl = `https://blockchair.com/bitcoin-cash/transaction/${txid}`;
      console.log(`explorer 1: ${explorerUrl}`);
      explorerUrl = `https://bch.loping.net/tx/${txid}`;
      console.log(`explorer 2: ${explorerUrl}`);
      console.log('Updating balance...');
      setAmount('');
      setRecipient('');
      setNotification({ type: 'success', message: `${amount} BCH sent.` });
    } catch (error) {
      setNotification({ type: 'error', message: `BCH send failed: ${error.message}` });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container sendbch-container">
     <fieldset className="form-group">
       <legend>[ Send ]</legend>
       <div className="send-group">
        <label htmlFor="recipient-address" className="form-label">Send to Address</label>
        <div className="form-input-group">
          <input
            id="recipient-address"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            disabled={busy}
            className="form-input"
            placeholder="Enter BCH address"
          />
          <button
            disabled={busy}
            onClick={() => setShowScanner(true)}
            className="scan-button"
          >
            Scan QR
          </button>
        </div>
       </div>
       <div className="send-group">
        <label htmlFor="amount" className="form-label">Amount (BCH)</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={busy}
          className="form-input"
          placeholder="Enter amount in BCH"
        />
        <small className="max-balance-info">Max: {balance} BCH</small>
       </div>
       <button
        onClick={handleSend}
        className="send-button"
        disabled={busy || !amount || !recipient.trim() || !walletConnected}
       >
        Send
       </button>
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

export default SendBCH;
