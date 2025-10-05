require('dotenv').config();
const InferenceClient = require('@huggingface/inference').InferenceClient;

const HF_TOKEN = process.env.HF_TOKEN;
const client = new InferenceClient(HF_TOKEN);

async function explainJoke(joke){
  const prompt = `
Explain the following joke in a friendly and natural way, as if you're chatting with someone who didn't get it.
If the joke is dark humor. Explain why it's funny, even if the humor involves something a bit morbid. 
Don't censor or soften it — just explain the twist clearly and kindly so someone who missed it can understand.
If the joke is confusing or based on wordplay, make sure to clarify the pun or misunderstanding.
Keep it short (3-5 sentences) and easy to follow. 
Use a playful tone, but don't overanalyze — just highlight the wordplay or twist that makes it funny.
  Joke:
  "${joke}"

  Explanation:`;

	try{
		const chatCompletion = await client.chatCompletion({
			provider: "fireworks-ai",
			model: "meta-llama/Llama-4-Scout-17B-16E-Instruct",
				messages: [
						{
								role: "user",
								content: prompt,
						},
				],
		});
		return chatCompletion.choices[0].message.content;
	} catch (err) {
		console.error(err);
		return null;
	}
}

module.exports = {
	explainJoke
};