import React from 'react';
import { WinnerPopupProps } from '../../utils/types'; // Importing as named export

const WinnerPopup: React.FC<WinnerPopupProps> = ({ winner, onClose }) => {
  if (!winner) return null;

  return (
    <div className="winner-popup">
      <div className="winner-content">
        <h2>Winner</h2>
        <p>{`Name: ${winner.name}`}</p>
        <p>{`Car ID: ${winner.id}`}</p>
        <p>{`Time: ${winner.time}ms`}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default WinnerPopup;
