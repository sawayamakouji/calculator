const axios = require('axios');

exports.handler = async (event) => {
  const { number } = event.queryStringParameters;
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
};
