import React from 'react';
import Button from './Button';
// import clickSound from '..click.mp3';
// import errorSound from '..error.mp3';
// import successSound from '..success.mp3';



interface Props {
  onButtonClick: (label: string) => void;
}

const ButtonPanel: React.FC<Props> = ({ onButtonClick }) => {
  return (
    <div>
      <p>計算後の数字に関するウンチクをAIが返える。</p>
    <div className="button-panel">
      <Button label="☀" onClick={() => onButtonClick("(")} />
      <Button label="💛" onClick={() => onButtonClick(")")} />
      <Button label="★" onClick={() => onButtonClick("%")} />
      <Button label="AC" onClick={() => onButtonClick("AC")} />
      
      <Button label="7" onClick={() => onButtonClick("7")} />
      <Button label="8" onClick={() => onButtonClick("8")} />
      <Button label="9" onClick={() => onButtonClick("9")} />
      <Button label="÷" onClick={() => onButtonClick("/")} />
      
      <Button label="4" onClick={() => onButtonClick("4")} />
      <Button label="5" onClick={() => onButtonClick("5")} />
      <Button label="6" onClick={() => onButtonClick("6")} />
      <Button label="×" onClick={() => onButtonClick("*")} />
      
      <Button label="1" onClick={() => onButtonClick("1")} />
      <Button label="2" onClick={() => onButtonClick("2")} />
      <Button label="3" onClick={() => onButtonClick("3")} />
      <Button label="−" onClick={() => onButtonClick("-")} />
      
      <Button label="0" onClick={() => onButtonClick("0")} />
      <Button label="." onClick={() => onButtonClick(".")} />
      <Button label="=" onClick={() => onButtonClick("=")} />
      <Button label="+" onClick={() => onButtonClick("+")} />
    </div>
    </div>
  );
};

export default ButtonPanel;
