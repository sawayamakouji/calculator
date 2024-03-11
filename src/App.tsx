import React, { useState } from 'react';
import axios from 'axios';
import Display from './components/Display';
import ButtonPanel from './components/ButtonPanel';
import ResultPopup from './components/ResultPopup'; // このコンポーネントは計算結果のトリビアを表示するために使用しま
import './App.css';

const App: React.FC = () => {
  const [currentValue, setCurrentValue] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [comment, setComment] = useState(''); // 追加したコメント用の状態変数
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

  const handleEmojiClick = (emoji: string): void => {
    let comment = '';
    switch (emoji) {
      case '★':
        comment = 'ステップ1: 基本的な足し算のヒント イントロダクション「1 + 1を計算しましょう。」   ヒント「"1"のボタンは、"2"のちょうど左にありますよ。"+"は数字キーの上にある特別な記号だよ。」ステップ2: 簡単な引き算のヒントイントロダクション「3 - 2を計算してみましょう。」ヒント「"3"は"2"よりも一つ右にありますね。"-"はプラスの下にあるかもしれないよ。」ステップ3: 掛け算の紹介のヒントイントロダクション「2 * 3はどうなるかな？」ヒント「"2"のボタンは"1"の隣にあるよ。"*"はかけ算を意味する記号だけど、プラスの近くに隠れているかもしれないね。」ステップ4: 割り算の説明のヒント  イントロダクション「6 ÷ 2はいくつかな？」ヒント「"6"は"5"の右側にあるよ。"/"は割り算の記号だけど、マイナスの上にいるかもしれないね。」エンディング「すべての計算が終わったね！素晴らしい！」';
        break;
      case '☀':
        comment = '401エラーは「Unauthorized」を意味し、認証に関連する問題を指しています。つまり、Netlify Functionsにアクセスするために必要な認証情報 例えばAPIキー がリクエストに含まれていないか、誤っている可能性があります_この問題を解決するためには、以下のことを確認してください_APIキーの確認: 関数へのリクエストに必要なAPIキーがリクエストヘッダーに含まれているか、または正しいか確認してください。これは通常、Netlifyの環境変数を通じて設定されます。環境変数の設定: Netlifyのダッシュボードで、環境変数が正しく設定されているか確認してください。関数で使用するAPIキーが環境変数として正しく設定されていないと、関数は401エラーを返すことがあります。ローカル開発環境: もしローカルで開発している場合は、.envファイルが存在し、APIキーが正しく設定されていることを確認してください 関数のコード: 関数がAPIキーを要求する外部サービスと通信する場合は、そのキーがリクエストに正しく含まれていることを関数のコード内で確認してください。リクエストURL: リクエストURLが正しいかどうかを確認してください。誤って改行がURLの最後に含まれている場合があります。これは、URLが不正であることを示すため、正確なURLを使用していることを確認してくださいNetlifyの関数の設定: もし関数が認証メカニズムを持っている場合 例えば、JWTトークン 、そのメカニズムが正しく機能していることを確認してください。これらの確認を行っても問題が解決しない場合は、エラーの詳細をさらに掘り下げるためにNetlifyのサポートに連絡することも一つの選択肢です。また、Netlifyのダッシュボードで関数のログを確認して、どのリクエストが失敗しているのか、何が原因で認証が失敗しているのかを特定してください。';
        break;
      case '💛':
        comment = 'AIの力で、計算したら、結果の数字に関するウンチクや架空の物語を長ったらしく返してくれるどうでもいい電卓、、、、を作りたかったのに  何も知らずにs生成AIの力かりてreactでnodejsとかnpmとかgithubにpushとかわけわかんない言葉にも負けずがんばったのは無駄じゃないと思いながら脳汁でまくり時間を過ごす事ができました。ハッカソン最高っ';
        break;
      default:
        comment = 'You clicked on something!';
    }
    setComment(comment);
    setPopupOpen(true); // ポップアップを表示
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
      <button onClick={() => handleEmojiClick('★')}>★</button>
      <button onClick={() => handleEmojiClick('☀')}>☀</button>
      <button onClick={() => handleEmojiClick('💛')}>💛</button>
      {popupOpen && (
        <ResultPopup
          isOpen={popupOpen}
          onClose={() => setPopupOpen(false)}
          result={comment} // ポップアップに表示するコメントを更新
          info={trivia} // これは以前のトリビア情報を表示するためにそのまま
        />
      )}
    </div>
  );
};

export default App;