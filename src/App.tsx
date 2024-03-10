import React, { useState } from 'react';
import Display from './components/Display';
import ButtonPanel from './components/ButtonPanel';
import './App.css';
import clickSound from './sounds/click.mp3';
import errorSound from './sounds/error.mp3';
import successSound from './sounds/success.mp3';
import ResultPopup from './components/ResultPopup'; // ポップアップコンポーネントのインポート




const App: React.FC = () => {
  const [currentValue, setCurrentValue] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const MAX_DIGITS = 10; // 許容する最大桁数
  const [popupOpen, setPopupOpen] = useState(false); // ポップアップ表示用のstate
  const [trivia, setTrivia] = useState<string[]>([]);

  const handleButtonClick = (label: string): void => {
    if (/\d/.test(label)) {
      // 数字の場合
      if (waitingForOperand) {
        setCurrentValue(label);
        setWaitingForOperand(false);
      } else {
        setCurrentValue(currentValue === '0' ? label : currentValue + label);
      }
    } else if (label === '.') {
      // 小数点の場合
      if (waitingForOperand) {
        setCurrentValue('0.');
        setWaitingForOperand(false);
      } else if (!currentValue.includes('.')) {
        // すでに小数点が含まれていないことを確認
        setCurrentValue(currentValue + '.');
      }
    } else if (label === '+' || label === '-' || label === '*' || label === '/') {
      if (!waitingForOperand && previousValue && operator) {
        // 既に演算子が押されていて次の操作が行われた場合、計算を行う
        const result = calculate(previousValue, currentValue, operator);
        setCurrentValue(result.toString());
        setPreviousValue(result.toString());  // 計算結果を保存
      } else {
        // 初めて演算子が押された場合、現在の値を保存
        setPreviousValue(currentValue);
      }
      setOperator(label);
      setWaitingForOperand(true);  // 次の数値入力を待つ
    } // 等号の場合の処理
    else if (label === '=') {
      if (operator && previousValue !== null) {
        const result = calculate(previousValue, currentValue, operator);
   // src/App.tsx
        const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
        if (typeof apiKey === 'undefined') {
          throw new Error('REACT_APP_OPENAI_API_KEY is not defined');
        }

        const fetchTrivia = async (result: number) => {
          const response = await fetch('API_ENDPOINT', {
            method: 'POST', // または 'GET'
            headers: {
              'Content-Type': 'gpt-4-turbo-preview',
              'Authorization': apiKey
            },
            body: JSON.stringify({
              prompt: `計算結果${result}にまつわる面白い事実を教えてください。`, // プロンプトの内容を調整
              // その他の必要なパラメータ
            })
          });
          const data = await response.json();
          return data; // 取得したデータを返す
        };
        const handleFetchTrivia = async (result: number) => {
          const fetchedTrivia = await fetchTrivia(result);
          setTrivia([...fetchedTrivia]); // 例として、取得した情報をtrivia状態にセット
        };
        setCurrentValue(formatResult(result));
        setPreviousValue(null);
        setOperator(null);
        setWaitingForOperand(true);
        //setTrivia(triviaInfo); // 豆知識をセット
        setPopupOpen(true); // ポップアップを表示

      }
    } else if (label === 'AC') {
      // 全てクリア
      setCurrentValue('0');
      setPreviousValue(null);
      setOperator(null);
      setWaitingForOperand(false);
    }
    // 他のケースは省略...
  };
  const formatResult = (result: number): string => {
    // 小数点以下を固定して丸める（例: 最大6桁）
    let fixedResult = result.toFixed(6);
    // 不要な末尾のゼロを取り除く
    fixedResult = Number(fixedResult).toString();
    // 桁数が多い場合は指数形式で表示する
    if (fixedResult.length > MAX_DIGITS) {
      return Number(fixedResult).toExponential(MAX_DIGITS - 1).replace(/(?:\.0+|(\.\d+?)0+)$/, "$1");
    }
    return fixedResult;
  };
  
  const playSound = (soundFile: string) => {
    const sound = new Audio(soundFile);
    sound.play();
  };
  
  

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





  // const getTrivia = (result: number) => {
  //   if (result === 42) {
  //     return "42は、宇宙と人生の究極の答えです。";
  //   }
  //   return "計算結果は" + result + "です。";
  // };

  return (
    <div className="App">
      <Display value={currentValue} />
      <ButtonPanel onButtonClick={handleButtonClick} />
      {popupOpen && (
      // App コンポーネント内
      <ResultPopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        result={currentValue}
        info={trivia.map((item: string) => `${item}`).join(', ')} // トリビアの内容を文字列に結合
      />

      )}
    </div>
  );
};

export default App;
