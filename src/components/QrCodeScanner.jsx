import { useState } from 'react';
import PropTypes from 'prop-types';
import { Scanner } from '@yudiel/react-qr-scanner';

const QrCodeScanner = ({ onAddressDetected }) => {
  const [error, setError] = useState(null);

  const handleScan = (result) => {
    if (result) {
      onAddressDetected(result);
    }
  };

  const handleError = (error) => {
    setError(error);
    console.error('QR Scanner Error:', error);
  };

  return (
    <div>
      {error && <p>Error: {error.message}</p>}
      <Scanner
        onScan={handleScan}
        onError={handleError}
        constraints={{ facingMode: 'environment' }}
        style={{ width: '100%' }}
      />
    </div>
  );
};

QrCodeScanner.propTypes = {
  onAddressDetected: PropTypes.func,
};

export default QrCodeScanner;

