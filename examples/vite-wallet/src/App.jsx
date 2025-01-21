import { useAtom } from 'jotai';
import { walletConnectedAtom } from 'bch-wallet-kit';
import { LoadScript, Mnemonic, Options, Wallet } from 'bch-wallet-kit';
import 'bch-wallet-kit/dist/BchWalletKit.css';
import { ToastContainer } from 'react-toastify';
import './confirm.css';
import './App.css';

const App = () => {
  const [walletConnected] = useAtom(walletConnectedAtom);

  return (
    <div className="app-container">
      <LoadScript scriptSrc="/minimal-slp-wallet.min.js" />
      <div className="app-title">BCH Wallet</div>
      {!walletConnected && (
       <>
        <Mnemonic />
        <Options />
       </>
      )}
       <Wallet showOptimize={true} />
       <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;
