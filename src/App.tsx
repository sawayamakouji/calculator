import React, { useState } from 'react';
import OpenAI from 'openai';


import './App.css';
import Display from './components/Display';
import ButtonPanel from './components/ButtonPanel';
import ResultPopup from './components/ResultPopup';

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
    if (/\d/.test(label) || label === '.') {
      if (waitingForOperand || currentValue === '0') {
        setCurrentValue(label === '.' ? '0.' : label);
        setWaitingForOperand(false);
      } else {
        setCurrentValue(currentValue + label);
      }
    } else if (['+', '-', '*', '/'].includes(label)) {
      setOperator(label);
      setWaitingForOperand(true);
      if (!waitingForOperand && operator && previousValue !== null) {
        const result = calculate(previousValue, currentValue, operator);
        setCurrentValue(String(result));
        fetchTrivia(String(result));
      } else {
        setPreviousValue(currentValue);
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
      setTrivia('');
    }
  };


  const openai = new OpenAI({
 apiKey: process.env.REACT_APP_OPENAI_API_KEY
  });


  // Numbers APIからOpenAIのAPIに変更されたfetchTrivia関数
  const fetchTrivia = async (number: string) => {
    try {
      const completion = await openai.completions.create({
        model: "text-davinci-003", // Ensure you're using the correct model
        prompt: `Tell me an interesting fact about the number ${number}.`,
        temperature: 0.5,
        max_tokens: 60,
        n: 1,
        stop: null,
      });
      setTrivia(completion.choices[0].text);
      setPopupOpen(true);
    } catch (error) {
      console.error('Error fetching trivia with OpenAI:', error);
      setTrivia("Could not fetch trivia for this number.");
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
