import PropTypes from 'prop-types';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify';
import './address.css';

const Address = ({ addressFormat = 'long', address, showQR = true }) => {
  const shortAddress = `${address.split(':')[1].substr(0, 4)}...${address.split(':')[1].substr(-4)}`;

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(address).then(
      () => {
        toast.success('Address copied to clipboard!');
      },
      (err) => {
        console.error('Failed to copy address: ', err);
        toast.error('Failed to copy address.');
      }
    );
  };

  return (
    <div className="container address-container">
      <fieldset className="form-group">
      <legend>[ Receive ]</legend>
      {showQR && (
        <div className="qr-code-container" onClick={handleCopyToClipboard}>
          <QRCodeSVG value={address} size={128} />
          <p className="qr-code-instruction">Click QR to copy address</p>
        </div>
      )}
      <p className="wallet-address wallet-address-long">
        <strong>Address:</strong> {address}
      </p>
      <p className="wallet-address wallet-address-short">
        <strong>Address:</strong> {shortAddress}
      </p>
      </fieldset>
    </div>
  );
};

// PropTypes validation
Address.propTypes = {
  addressFormat: PropTypes.oneOf(['short', 'long']).isRequired, // 'short' or 'long' format
  address: PropTypes.string.isRequired, // Wallet address
  showQR: PropTypes.bool, // Whether to display the QR code
};

export default Address;