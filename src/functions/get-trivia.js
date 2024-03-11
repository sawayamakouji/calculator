
const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    const number = event.queryStringParameters.number;
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt: `Tell me an interesting fact about the number ${number}.`,
        max_tokens: 60,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    // CORSヘッダーを含むレスポンスを返します。
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // 安全性を高めるために、信頼できるドメインに限定することを推奨します。
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' // 必要に応じてメソッドを調整してください。
      },
      body: JSON.stringify({ trivia: response.data.choices[0].text })
    };
  } catch (error) {
    // エラーハンドリングを適切に行います。
    console.error('Error calling OpenAI API:', error);
    
    // エラーメッセージの形式をチェックし、適切なエラーメッセージを返す
    let errorMessage = 'Unknown error';
    if (error.response) {
      // OpenAIからのエラーレスポンスがある場合
      errorMessage = `OpenAI Error: ${error.response.status} - ${error.response.data.error}`;
    } else if (error.request) {
      // リクエストは送信されたが、レスポンスを受け取っていない場合
      errorMessage = 'No response from OpenAI API';
    } else {
      // リクエストの設定時に何かが間違っていた場合
      errorMessage = error.message;
    }

    return {
      statusCode: error.response ? error.response.status : 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Failed to fetch trivia.' })
    };
  }
};