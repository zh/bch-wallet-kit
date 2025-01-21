import { useState } from 'react';
import PropTypes from 'prop-types';
import { useAtom } from 'jotai';
import { toast } from 'react-toastify';
import {
  balanceAtom,
  busyAtom,
  walletAtom,
  mnemonicAtom,
  optionsAtom
} from '../atoms';
import { useConnectWallet } from '../hooks';
import {
  Address,
  SendBCH,
  Balance,
  Sweeper,
  WalletDetails
} from '../components';

const Wallet = ({ showOptimize = false }) => {
  const { connectWallet, disconnectWallet, walletConnected } = useConnectWallet();
  const [wallet] = useAtom(walletAtom); // Ensure walletAtom is used here
  const [,setBalance] = useAtom(balanceAtom);
  const [mnemonic] = useAtom(mnemonicAtom);
  const [options] = useAtom(optionsAtom);
  const [busy, setBusy] = useAtom(busyAtom);
  const [showDetails, setShowDetails] = useState(false);

  // Enable connect button only if mnemonic is not empty and an option is selected
  const isConnectEnabled = mnemonic.trim() && options.restURL;

  const handleConnect = async () => {
    try {
      await connectWallet();
      toast.success('Wallet connected!');
    } catch (error) {
      toast.error(`Failed to connect wallet: ${error}`);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setBalance(0);
    toast.info('Wallet disconnected!');
  };

  const handleOptimize = async () => {
    if (!wallet) return;

    try {
      setBusy(true)
      await wallet.optimize();
      const bchUtxos = wallet.utxos.utxoStore.bchUtxos
      const utxoCount = bchUtxos.length;
      console.log(`UTXO count: ${utxoCount}`);
      if (utxoCount > 10) {
        console.log('Still has more than 10 UTXOs.');
        toast.warn('Still has more than 10 UTXOs.');
      } else {
        console.log('Wallet optimized!');
        toast.success('Wallet optimized!');
      }
    } catch (error) {
      toast.error(`Failed to optimize wallet: ${error}`);
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="wallet-container">
      {walletConnected ? (
        <>
          <div className="wallet-info">
            <Address addressFormat="short" address={wallet?.walletInfo?.cashAddress} />
            <Balance />
            <Sweeper />
            <SendBCH />
            <button
              onClick={() => setShowDetails((prev) => !prev)}
              className="toggle-details-button"
            >
              {showDetails ? 'Less Info' : 'More Info'}
            </button>
            {showDetails && <WalletDetails />}
            <div className="form-input-group">
            <button
              disabled={busy}
              onClick={handleDisconnect}
              className="wallet-button disconnect"
            >
              Disconnect
            </button>
            {showOptimize && <button
              disabled={busy}
              onClick={() => handleOptimize()}
              className="wallet-button optimize"
            >
              Optimize
            </button>}
            </div>
          </div>
        </>
      ) : (
        <button
          onClick={handleConnect}
          className="wallet-button connect"
          disabled={!connectWallet || !isConnectEnabled}
        >
          Connect
        </button>
      )}
    </div>
  );
};

Wallet.propTypes = {
  showOptimize: PropTypes.bool, // Whether to display 'Optimize' button
};

export default Wallet;
