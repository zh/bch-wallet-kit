import { useAtom } from 'jotai';
import { useConnectWallet, useBalance } from 'bch-wallet-kit';
import { mnemonicAtom, optionsAtom, walletAtom } from 'bch-wallet-kit';
import { LoadScript } from 'bch-wallet-kit';
import 'bch-wallet-kit/dist/BchWalletKit.css';
import './App.css';

const App = () => {
  const { connectWallet, disconnectWallet, walletConnected } = useConnectWallet();
  const { satsBalance, balance, loading, error } = useBalance(20*1000);
  const [wallet] = useAtom(walletAtom);
  const [mnemonic, setMnemonic] = useAtom(mnemonicAtom);
  const [, setOptions] = useAtom(optionsAtom);

  const handleConnect = async () => {
    try {
      const url = "https://free-bch.fullstack.cash";
      setOptions((prevOptions) => ({ ...prevOptions, restURL: url }));
      await connectWallet();
    } catch (err) {
      console.log(`Failed to connect wallet: ${err}`);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  return (
    <div className="app-container">
      <LoadScript scriptSrc="/minimal-slp-wallet.min.js" />
      <div className="app-title">Check Wallet Balance</div>
      <div className="mnemonic-input-wrapper">
        <label
          htmlFor="mnemonic-input"
          className="form-label"
        >
          Mnemonic:
        </label>
        <input
          id="mnemonic-input"
          type="text"
          value={mnemonic}
          onChange={(e) => setMnemonic(e.target.value)}
          className="mnemonic-input"
          disabled={walletConnected} // Disable input when wallet is connected
        />
        </div>
      <div className="container wallet-container">
        {!walletConnected ? (
          <button
            onClick={handleConnect}
            className="wallet-button connect"
            disabled={!mnemonic.trim()}
          >
            Check
          </button>
        ) : (
          <>
          <div className="container balance-container">
            {<p><strong>Address:</strong> {wallet?.walletInfo?.cashAddress}</p>}
            {error && <p>Error: {error}</p>}
            {loading && <p>Loading...</p>}
            {!loading && (balance ? <p><strong>Balance:</strong> {balance} BCH ({satsBalance} sats)</p> : <p>Wallet is empty</p>)}
          </div>
          <button
            onClick={handleDisconnect}
            className="wallet-button disconnect"
          >
            Disconnect
          </button>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
