const axios = require('axios');

exports.handler = async (event) => {
  const { number } = event.queryStringParameters;

  try {
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

    return {
      statusCode: 200,
      body: JSON.stringify({ trivia: response.data.choices[0].text })
    };
  } catch (error) {
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
      body: JSON.stringify({ error: errorMessage })
    };
  }
};
