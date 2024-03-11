import React, { useState } from 'react';
import axios from 'axios';
import Display from './components/Display';
import ButtonPanel from './components/ButtonPanel';
import ResultPopup from './components/ResultPopup'; // このコンポーネントは計算結果のトリビアを表示するために使用しま
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
      const response = await axios.get(`https://sawasawasawayama5555.netlify.app/.netlify/functions/get-trivia
      `);
      setTrivia(response.data.trivia);
      setPopupOpen(true);
    } catch (error) {
      let errorMessage = 'Trivia fetch failed.';
      if (axios.isAxiosError(error)) {
        // OpenAIからの具体的なエラーメッセージがある場合、それを使用します。
        const serverError = error.response?.data?.error;
        if (serverError) {
          errorMessage += ` Error: ${serverError}`;
        } else if (error.message) {
          // ネットワークエラーなど、他の種類のエラー
          errorMessage += ` Error: ${error.message}`;
        }
      }
      console.error('Error fetching trivia:', error);
      setTrivia(errorMessage);
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