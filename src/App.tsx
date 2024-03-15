import React, { useState } from 'react';
import axios from 'axios';
import Display from './components/Display';
import ButtonPanel from './components/ButtonPanel';
import ResultPopup from './components/ResultPopup'; 
import './App.css';




const App: React.FC = () => {
  const [currentValue, setCurrentValue] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [trivia, setTrivia] = useState('');
  const API_KEY = process.env.REACT_APP_API_KEY;


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
        // handleFetchTrivia(result).then(() => {
        //   setCurrentValue(formatResult(result));
        //   setPreviousValue(null);
        //   setOperator(null);
        //   setWaitingForOperand(true);
        //   setPopupOpen(true); // ポップアップを表示
        }
    } else if (label === 'AC') {
      setCurrentValue('0');
      setPreviousValue(null);
      setOperator(null);
      setWaitingForOperand(false);
      setPopupOpen(false);
    }
  };

  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: 'You are a helpful assistant.' },
  ]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: inputValue },
    ]);

    setInputValue('');

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [...messages, { role: 'user', content: inputValue }],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'assistant', content: data.choices[0].message.content },
        ]);
      } else {
        console.error('Error:', data.error.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.role}: </strong>
            {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter your message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );



  const fetchTrivia = async (number: string) => {  const fetchTrivia = async (number: string) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [...messages, { role: 'user', content: inputValue }],
        }),
      });
      
      setTrivia(response.data.trivia);
      setPopupOpen(true);
    } catch (error) {
      let errorMessage = 'Triviaできなかったよfetch failed.';
      if (axios.isAxiosError(error)) {
        // OpenAIからの具体的なエラーメッセージがある場合、それを使用します。
        const serverError = error.response?.data?.error;
        if (serverError) {
          errorMessage += ` できなかったError: ${serverError}`;
        } else if (error.message) {
          // ネットワークエラーなど、他の種類のエラー
          errorMessage += `間に合わん Error: ${error.message}`;
        }
      }
      console.error('Errorできなかったfetching trivia:', error);
      setTrivia(errorMessage);
      setPopupOpen(true);
    }
  }};

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