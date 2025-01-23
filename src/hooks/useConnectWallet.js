// src/hooks/useConnectWallet.js
import { useAtom } from 'jotai';
import { mnemonicAtom, optionsAtom, walletConnectedAtom, walletAtom } from '../atoms';

const useConnectWallet = () => {
  const [mnemonic] = useAtom(mnemonicAtom);
  const [options] = useAtom(optionsAtom);
  const [walletConnected, setWalletConnected] = useAtom(walletConnectedAtom);
  const [, setWallet] = useAtom(walletAtom);

  const connectWallet = async () => {
    if (!mnemonic.trim()) {
      console.error('Mnemonic is empty. Cannot initialize wallet.');
      return;
    }

    if (!window.SlpWallet) {
      console.error('SlpWallet library is not loaded.');
      return;
    }

    try {
      const SlpLibrary = window.SlpWallet; // Wallet initialization
      const bchWallet = new SlpLibrary(mnemonic, options);
      await bchWallet.initialize();
      setWallet(bchWallet);
      setWalletConnected(true);
      console.log('Wallet connected successfully!');
    } catch (error) {
      console.error('Failed to initialize wallet:', error);
      setWallet(null);
    }
  };

  const disconnectWallet = () => {
    setWallet(null); // Reset walletAtom
    setWalletConnected(false);
    console.log('Wallet disconnected.');
  };

  return {
    connectWallet,
    disconnectWallet,
    walletConnected,
  };
};

export default useConnectWallet;

