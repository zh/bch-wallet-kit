import { useAtom } from 'jotai';
import { walletConnectedAtom } from 'bch-wallet-kit';
import { Notify, LoadScript, Mnemonic, Options, Wallet } from 'bch-wallet-kit';
import 'bch-wallet-kit/dist/BchWalletKit.css';
import './App.css';

const App = () => {
  const [walletConnected] = useAtom(walletConnectedAtom);

  return (
    <div className="app-container">
      <LoadScript scriptSrc="/minimal-slp-wallet.min.js" />
      <Notify />
      <div className="app-title">BCH Wallet</div>
      {!walletConnected && (
       <>
        <Mnemonic />
        <Options />
       </>
      )}
       <Wallet showOptimize={true} />
    </div>
  );
};

export default App;
