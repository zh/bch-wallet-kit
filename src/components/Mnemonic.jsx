// src/components/Mnemonic.js
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useAtom } from 'jotai';
import { mnemonicAtom, walletConnectedAtom } from '../atoms';
import { ConfirmToast } from 'react-confirm-toast';
import { toast } from 'react-toastify';
import { generateMnemonic, validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

const Mnemonic = ({ showSave = true, showGenerate = true }) => {
  const [mnemonic, setMnemonic] = useAtom(mnemonicAtom);
  const [walletConnected] = useAtom(walletConnectedAtom);
  const [showConfirmToast, setShowConfirmToast] = useState(false);

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
    toast.info('New mnemonic generated.');
  };

  const handleSave = () => {
    if (!mnemonic.trim()) {
      toast.error('Mnemonic cannot be empty.');
      return;
    }

    if (!validateMnemonic(mnemonic, wordlist)) {
      toast.error('Invalid mnemonic format.');
      return;
    }

    localStorage.setItem('mnemonic', mnemonic);
    toast.success('Mnemonic saved successfully.');
  };

  const handleReset = () => {
    localStorage.removeItem('mnemonic');
    setMnemonic('');
    toast.success('Mnemonic reset successfully.');
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
          disabled={walletConnected} // Disable input when wallet is connected
        />
        {showGenerate && (
        <button
          onClick={handleGenerate}
          className="mnemonic-generate-button"
          disabled={walletConnected} // Disable generate when wallet is connected
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
          disabled={walletConnected} // Disable save when wallet is connected
        >
          Save
        </button>
        <button
          onClick={() => setShowConfirmToast(true)}
          className="mnemonic-reset-button"
          disabled={walletConnected} // Disable reset when wallet is connected
        >
          Reset
        </button>
        {showConfirmToast && (
          <ConfirmToast
            asModal={true}
            toastText="Are you sure? This action cannot be undone."
            customFunction={handleReset}
            showConfirmToast={showConfirmToast}
            setShowConfirmToast={setShowConfirmToast}
          />
        )}
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

