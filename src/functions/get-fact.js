// Axiosライブラリのインポート
const axios = require('axios');

exports.handler = async (event) => {
  // クエリパラメータから計算結果の数値を取得
  const { number } = event.queryStringParameters;

  try {
    // ChatGPT APIにリクエストを送信
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt: `Tell me an interesting fact about the number こたえは日本語でお願い ${number}.`,
        temperature: 0.5,
        max_tokens: 60,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_OPENAI_API_KEY`
        }
      }
    );

    // APIからのレスポンスを返す
    return {
      statusCode: 200,
      body: JSON.stringify({ message: response.data.choices[0].text })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred' })
    };
  }
};
