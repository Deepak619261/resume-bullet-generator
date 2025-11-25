import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function main() {
  // const response = await client.responses.create({
  //   model: "gpt-5-nano",
  //   input: "hey gpt "
  // });

  // console.log(response);


  //  running the customized prompt 

const response = await client.responses.create({
    model: "gpt-5-nano",
    input: [
    { role: "developer", content: "Talk like a pirate." },
    { role: "user", content: "Are semicolons optional in JavaScript?" }
  ]
});
console.log(response.output_text);

  
}





main();
