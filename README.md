# bch-wallet-kit

Simple components to construct various BCH related applications - wallets, DEXes etc.

[bch-wallet-kit](https://github.com/zh/bch-wallet-kit) is a great JavaScript library for working with Bitcoin Cash. It is using the services, provided by [FullStack.cash](https://fullstack.cash/) to communicate with BCH blockchain.
The real blockchain interactions are provided by [minimal-slp-wallet](https://www.npmjs.com/package/minimal-slp-wallet) CLI wallet library.

Some library features:

- [jotai](https://jotai.org/) state management for preserving current state
- [minimal-slp-wallet](https://www.npmjs.com/package/minimal-slp-wallet) for blockchain operations
- does not leave footprints in the browser - local storage etc. (as a result, you can have many wallets in the same browser)
- minimal formating - no external frameworks, just simple CSS, included in the package

## Usage

Initial file structure can be created in many ways, but [vite](https://github.com/vitejs/vite) is pretty good for this.

- Create new vite project

```bash
npm create vite@latest vite-wallet -- --template react
cd vite-wallet/
```

- Install required libraries:

```bash
npm install minimal-slp-wallet bch-wallet-kit --save
```

- Copy minimal-slp-library to public/ folder (*TODO: simplify this step*)

```bash
cp node_modules/minimal-slp-wallet/dist/minimal-slp-wallet.min.js public/
```

- Replace `src/App.jsx` with the following code:

```js
import { useAtom } from 'jotai';
import { walletConnectedAtom } from 'bch-wallet-kit';
import { LoadScript, Mnemonic, Options, Wallet } from 'bch-wallet-kit';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bch-wallet-kit/dist/BchWalletKit.css';
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
      <Wallet />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;
```

- Start the application (by default running as `http://localhost:5173/`)

```bash
npm run dev
```