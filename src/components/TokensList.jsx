import { useState } from 'react';
import { useAtom } from 'jotai';
import { walletConnectedAtom } from '../atoms';
import { useTokensList } from '../hooks'
import TokenCard from './TokenCard';

const TokensList = () => {
  const [walletConnected] = useAtom(walletConnectedAtom);
  const [selectedToken, setSelectedToken] = useState(null);
  const { loading, error, tokens, refreshTokens } = useTokensList(30*1000);

  if (!walletConnected) {
    return <div className="container tokens-list-container">Please connect your wallet</div>;
  }

  // Render the zoomed-in TokenCard if a token is selected
  if (selectedToken) {
    return (
      <div className="zoomed-token-card">
        <TokenCard
          token={selectedToken}
          refreshTokenList={refreshTokens}
          onZoomOut={() => setSelectedToken(null)} // Handler to exit zoom mode
          zoomed
        />
      </div>
    );
  }

  return (
    <>
    <div className="container tokens-list-container">
      <fieldset className="form-group">
      <legend>[ Tokens ]</legend>
      {tokens.length > 0 && (
        <div className="token-list">
          {tokens.map((token, index) => (
            <TokenCard
              key={index}
              token={token}
              onClick={() => setSelectedToken(token)}
            />
          ))}
        </div>
      )}
      {tokens.length === 0 && (
        <div className="no-tokens">No tokens available in the wallet</div>
      )}
      </fieldset>
    </div>
    {loading && <p>{'loading...'}</p>}
    {error && <p>Error: {error}</p>}
    </>
  );
};

export default TokensList;

