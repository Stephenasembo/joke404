require('dotenv').config();
const InferenceClient = require('@huggingface/inference').InferenceClient;

const HF_TOKEN = process.env.HF_TOKEN;
const client = new InferenceClient(HF_TOKEN);

async function generateResponse(input){
	try{
		const chatCompletion = await client.chatCompletion({
			provider: "fireworks-ai",
			model: "meta-llama/Llama-4-Scout-17B-16E-Instruct",
				messages: [
						{
								role: "user",
								content: input,
						},
				],
		});
		return chatCompletion.choices[0].message.content;
	} catch (err) {
		console.error(err);
		return null;
	}
}

function main() {
  generateResponse("What is the capital city in Kenya?")
    .then((res) => {
      console.log(res);
    })
}

main()

module.exports = {
	generateResponse
};