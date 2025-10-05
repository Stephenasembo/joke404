require("dotenv").config()
const express = require("express")
const PORT = process.env.PORT || 3000;
const app = express();
const TelegramBot = require("node-telegram-bot-api");
const telegramToken = process.env.TG_BOT;
const bot = new TelegramBot(telegramToken, {polling: true});

app.get("/", (req, res) => {
  res.send("Hello welcome to joke404.")
});

async function fetchJoke() {
  const url = process.env.RANDOM_JOKE_ENDPOINT;
  let response = await fetch(url, {
    headers: {
      "X-Api-Key": process.env.JOKE_X_API_KEY
    }
  });
  console.log(response);
  if(!response.ok) return res.status(500).send("Internal error.")
  response = await response.json();
  const joke = response[0].joke;
  console.log(joke);
  return joke;
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const resp = "Hello welcome to joke404. The hub of jokes."

  bot.sendMessage(chatId, resp);
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const resp = `
  Available commands:
  /start - Welcome message
  /joke - Get a random joke
  /category - Pick a joke category
  /help - SHow this list
  `

  bot.sendMessage(chatId, resp);
});

bot.onText(/\/joke/, (msg) => {
  const chatId = msg.chat.id;
  fetchJoke()
    .then((res) => {
      bot.sendMessage(chatId, res)
    })
})

bot.onText(/\/category/, (msg) => {
  const chatId = msg.chat.id;
  const resp = `
  Pick a category of jokes from the below list:
  /dadjokes
  /pun
  /darkhumour
  `

  bot.sendMessage(chatId, resp);
})

app.listen(PORT, () => {
  console.log(`App is live on port ${PORT}\nVisit http://localhost:${PORT}`)
})