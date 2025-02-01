import React from 'react';

interface TokenDialogProps {
  tokens: Array<{ symbol: string; balance: string }>;
  onClose: () => void;
}

const TokenDialog: React.FC<TokenDialogProps> = ({ tokens, onClose }) => {
  return (
    <div className="token-dialog">
      <div className="dialog-content">
        <h3>Your Tokens</h3>
        <ul>
          {tokens.map((token, index) => (
            <li key={index}>
              {token.symbol}: {parseFloat(token.balance).toFixed(2)}
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TokenDialog;