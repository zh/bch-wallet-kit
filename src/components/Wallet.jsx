// src/components/Wallet.js
import { useState } from 'react';
import { useAtom } from 'jotai';
import { toast } from 'react-toastify';
import {
  balanceAtom,
  sendingAtom,
  sweepingAtom,
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
import './wallet.css';

const Wallet = () => {
  const { connectWallet, disconnectWallet, walletConnected } = useConnectWallet();
  const [wallet] = useAtom(walletAtom); // Ensure walletAtom is used here
  const [,setBalance] = useAtom(balanceAtom);
  const [mnemonic] = useAtom(mnemonicAtom);
  const [options] = useAtom(optionsAtom);
  const [sending] = useAtom(sendingAtom);
  const [sweeping] = useAtom(sweepingAtom);
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
            <button
              disabled={sending || sweeping}
              onClick={handleDisconnect}
              className="wallet-button disconnect"
            >
              Disconnect
            </button>
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

export default Wallet;
