import PropTypes from 'prop-types';
import { useAtom, useSetAtom } from 'jotai';
import {
  mnemonicAtom,
  optionsAtom,
  notificationAtom,
  busyAtom,
} from '../atoms';
import { useConnectWallet } from '../hooks';
import Address from './Address';
import Balance from './Balance';

const ReceiveBCH = ({ showSLP = false }) => {
  const { connectWallet, disconnectWallet, walletConnected } = useConnectWallet();
  const [mnemonic] = useAtom(mnemonicAtom);
  const [options] = useAtom(optionsAtom);
  const [busy, setBusy] = useAtom(busyAtom);
  const setNotification = useSetAtom(notificationAtom);

  const isConnectEnabled = mnemonic.trim() && options.restURL;

  const handleConnect = async () => {
    try {
      setBusy(true);
      await connectWallet();
      setNotification({ type: 'success', message: 'Wallet connected!'});
    } catch (error) {
      setNotification({ type: 'error', message: `Failed to connect wallet: ${error}`});
    } finally {
      setBusy(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setNotification({ type: 'success', message: 'Wallet disconnected!'});
  };

  return (
    <div className="wallet-container">
      {walletConnected ? (
        <>
          <div className="wallet-info">
            <div className="container address-container">
              <fieldset className="form-group">
                <legend>[ Receive ]</legend>
                <Address
                  addressFormat={'long'}
                  showSLP={showSLP}
                  showQR={true}
                  showSwitch={true}
              />
              <Balance showValue={false} />
              </fieldset>
            </div>
            <div className="form-input-group">
            <button
              onClick={handleDisconnect}
              className="wallet-button disconnect"
            >
              Disconnect
            </button>
            </div>
          </div>
        </>
      ) : (
        <div className="wallet-info">
        {busy && <small className="connecting-info">connecting...</small>}
        <button
          onClick={handleConnect}
          className="wallet-button connect"
          disabled={busy || !connectWallet || !isConnectEnabled}
        >
          Connect
        </button>
        </div>
      )}
    </div>
  );
};

ReceiveBCH.propTypes = {
  showSLP: PropTypes.bool, // Whether to display SLP address
};

export default ReceiveBCH;
