const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `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`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {role: "system", content: "You are a helpful assistant."},
        {role: "user", content: "Tell me an interesting fact about the number 42."}
      ]
    })
  });
  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
