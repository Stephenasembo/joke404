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

async function fetchJoke(category) {
  let url = process.env.JOKE_ENDPOINT;
  switch (category){
    case 'dark':
      url = url + 'Dark?type=single';
      break;
    case 'programming':
      url = url + 'Programming?type=single';
      break;
    default:
      url = url + 'Any?type=single';
  }
  console.log({url});
  let response = await fetch(url);
  if (!response.ok) return console.log("Internal error occured")
  response = await response.json();
  console.log({response})
  const joke = response.joke;
  console.log({joke})
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
  fetchJoke('')
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