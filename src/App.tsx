import React, { useState } from 'react';
import axios from 'axios';
import Display from './components/Display';
import ButtonPanel from './components/ButtonPanel';
import ResultPopup from './components/ResultPopup'; // このコンポーネントは計算結果のトリビアを表示するために使用します
import './App.css';

const App: React.FC = () => {
  const [currentValue, setCurrentValue] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [trivia, setTrivia] = useState('');

  const calculate = (num1: string, num2: string, operator: string): number => {
    const firstNum = parseFloat(num1);
    const secondNum = parseFloat(num2);
    switch (operator) {
      case '+':
        return firstNum + secondNum;
      case '-':
        return firstNum - secondNum;
      case '*':
        return firstNum * secondNum;
      case '/':
        return firstNum / secondNum;
      default:
        return 0;
    }
  };

  const handleButtonClick = (label: string): void => {
    if (/\d/.test(label)) {
      if (waitingForOperand) {
        setCurrentValue(label);
        setWaitingForOperand(false);
      } else {
        setCurrentValue(currentValue === '0' ? label : currentValue + label);
      }
    } else if (label === '.') {
      if (!currentValue.includes('.')) {
        setCurrentValue(currentValue + '.');
      }
    } else if (['+', '-', '*', '/'].includes(label)) {
      setOperator(label);
      setWaitingForOperand(true);
      if (!waitingForOperand) {
        if (previousValue !== null && operator !== null) {
          const result = calculate(previousValue, currentValue, operator);
          setCurrentValue(String(result));
          setPreviousValue(null);
        } else {
          setPreviousValue(currentValue);
        }
      }
    } else if (label === '=') {
      if (operator && previousValue !== null) {
        const result = calculate(previousValue, currentValue, operator);
        setCurrentValue(String(result));
        fetchTrivia(String(result));
      }
    } else if (label === 'AC') {
      setCurrentValue('0');
      setPreviousValue(null);
      setOperator(null);
      setWaitingForOperand(false);
      setPopupOpen(false);
    }
  };

  const fetchTrivia = async (number: string) => {
    try {
      const response = await axios.get(`/api/get-trivia?number=${number}`);
      setTrivia(response.data.trivia);
      setPopupOpen(true);
    } catch (error) {
      console.error('Error fetching trivia:', error);
      setTrivia('Trivia fetch failed.');
      setPopupOpen(true);
    }
  };

  return (
    <div className="App">
      <Display value={currentValue} />
      <ButtonPanel onButtonClick={handleButtonClick} />
      {popupOpen && (
        <ResultPopup
          isOpen={popupOpen}
          onClose={() => setPopupOpen(false)}
          result={currentValue}
          info={trivia}
        />
      )}
    </div>
  );
};

export default App;
