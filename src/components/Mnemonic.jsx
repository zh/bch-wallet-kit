import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAtom, useSetAtom } from 'jotai';
import { busyAtom, notificationAtom, mnemonicAtom, walletConnectedAtom } from '../atoms';
import { generateMnemonic, validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

const Mnemonic = ({ showSave = true, showGenerate = true }) => {
  const [mnemonic, setMnemonic] = useAtom(mnemonicAtom);
  const [walletConnected] = useAtom(walletConnectedAtom);
  const setNotification = useSetAtom(notificationAtom);
  const [busy] = useAtom(busyAtom);

  // Load mnemonic from localStorage on component mount
  useEffect(() => {
    const savedMnemonic = localStorage.getItem('mnemonic');
    if (savedMnemonic) {
      setMnemonic(savedMnemonic);
    }
  }, [setMnemonic]);

  const handleGenerate = () => {
    const newMnemonic = generateMnemonic(wordlist);
    setMnemonic(newMnemonic);
    setNotification({ type: 'success', message: 'New mnemonic generated.' });
  };

  const handleSave = () => {
    if (!mnemonic.trim()) {
      setNotification({ type: 'error', message: 'Mnemonic cannot be empty.' });
      return;
    }

    if (!validateMnemonic(mnemonic, wordlist)) {
      setNotification({ type: 'error', message: 'Invalid mnemonic format.'});
      return;
    }

    localStorage.setItem('mnemonic', mnemonic);
    setNotification({ type: 'success', message: 'Mnemonic saved successfully.'});
  };

  const handleReset = () => {
    const confirmed = window.confirm('Are you sure you want to reset the wallet?');
    if (confirmed) {
      localStorage.removeItem('mnemonic');
      setMnemonic('');
      setNotification({ type: 'success', message: 'Mnemonic reset successfully.'});
    }
  };

  return (
    <div className="container mnemonic-container">
      <fieldset className="form-group">
        <legend>[ Mnemonic ]</legend>
      <div className="mnemonic-input-wrapper">
        <input
          id="mnemonic-input"
          type="text"
          value={mnemonic}
          onChange={(e) => setMnemonic(e.target.value)}
          className="mnemonic-input"
          disabled={walletConnected || busy} // Disable input when wallet is connected
        />
        {showGenerate && (
        <button
          onClick={handleGenerate}
          className="mnemonic-generate-button"
          disabled={walletConnected || busy} // Disable generate when wallet is connected
        >
          Generate
        </button>
        )}
      </div>
      {showSave && (
      <div className="mnemonic-actions">
        <button
          onClick={handleSave}
          className="mnemonic-save-button"
          disabled={walletConnected || busy} // Disable save when wallet is connected
        >
          Save
        </button>
        <button
          onClick={handleReset}
          className="mnemonic-reset-button"
          disabled={walletConnected || busy} // Disable reset when wallet is connected
        >
          Reset
        </button>
      </div>
      )}
    </fieldset>
    </div>
  );
};

// PropTypes validation
Mnemonic.propTypes = {
  showSave: PropTypes.bool, // Whether to display 'Save', 'Reset' buttons
  showGenerate: PropTypes.bool, // Whether to display 'Generate' button
};

export default Mnemonic;

