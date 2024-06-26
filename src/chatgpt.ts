const OpenAI = require('openai');

const openai = new OpenAI();

// accepts content as an argument

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "Hello" }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
}

main();