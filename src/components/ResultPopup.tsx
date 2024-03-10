// ResultPopup.js
import React from 'react';

interface ResultPopupProps {
  isOpen: boolean;
  onClose: () => void;
  result: string;
  info: string;
}

const ResultPopup: React.FC<ResultPopupProps> = ({ isOpen, onClose, result, info }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="popup-background">
      <div className="popup-content">
        <h2>計算結果: {result}</h2>
        <p>{info}</p>
        <button onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
};

export default ResultPopup;
