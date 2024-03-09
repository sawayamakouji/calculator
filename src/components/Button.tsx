import React from 'react';

interface Props {
  label: string;
  onClick: () => void;
}

const Button: React.FC<Props> = ({ label, onClick }) => {
  return (
    <button className="button" onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
