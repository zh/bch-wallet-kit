// src/components/Options.js
import { useAtom } from 'jotai';
import { optionsAtom, walletAtom, walletConnectedAtom } from '../atoms';

const Options = () => {
  const [options, setOptions] = useAtom(optionsAtom);
  const [walletConnected] = useAtom(walletConnectedAtom);
  const [, setWallet] = useAtom(walletAtom);

  const updateRestURL = (url) => {
    setOptions((prevOptions) => ({ ...prevOptions, restURL: url }));
    setWallet(null);
  };

  return (
    <div className="container options-container">
      <fieldset className="form-group">
        <legend>[ Connection ]</legend>
      <select
        id="rest-url-select"
        value={options.restURL}
        onChange={(e) => updateRestURL(e.target.value)}
        className="options-select"
        disabled={walletConnected} // Disable dropdown when wallet is connected
      >
        <option value="" disabled>
          -- Select an option --
        </option>
        <option value="https://free-bch.fullstack.cash">https://free-bch.fullstack.cash</option>
        <option defaultValue="https://bch-consumer-anacortes-wa-usa.fullstackcash.nl">
          https://bch-consumer-anacortes-wa-usa.fullstackcash.nl
        </option>
      </select>
      </fieldset>
    </div>
  );
};

export default Options;

