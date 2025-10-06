require("dotenv").config()
const express = require("express")
const {explainJoke} = require("./ai");
const PORT = process.env.PORT || 3000;
const app = express();
const TelegramBot = require("node-telegram-bot-api");
const telegramToken = process.env.TG_BOT;
const bot = new TelegramBot(telegramToken, {polling: {params: {timeout: 10}, interval: 500}});

app.get("/", (req, res) => {
  res.send("Hello welcome to joke404.")
});

const jokeStore = new Map();

async function fetchJoke(category) {
  let url = process.env.JOKE_ENDPOINT;
  switch (category){
    case 'dark':
      url += 'Dark';
      break;
    case 'programming':
      url += 'Programming';
      break;
    default:
      url += 'Any';
  }
  try {
    let response = await fetch(url);
    if (!response.ok) return console.log("Internal error occured")
    response = await response.json();
    let jokeContext ={category}

    if(response.type === "single") {
      jokeContext.content = response.joke;
      jokeContext.parts = "single"
      return jokeContext;
    }
    const joke = [response.setup, response.delivery];
    jokeContext.content = "" + joke[0] + joke[1];
    jokeContext.parts = "two part"
    jokeContext.joke = joke
    return jokeContext;
  } catch(err) {
    console.error(err);
  }
}

async function deliverJoke(category, chatId) {
  try{
    const jokeContext = await fetchJoke(category);
    const options = {
      reply_markup: {
        inline_keyboard: [
          [{text: "Next", callback_data: JSON.stringify({action: "next", category})},
          {text: "Explain", callback_data:  JSON.stringify({action: "explain"})}]
        ]
      }
    }

    if(jokeContext.parts === "two part") {
      bot.sendMessage(chatId, jokeContext.joke[0]);
      setTimeout(() => {
        bot.sendMessage(chatId, jokeContext.joke[1], options)
      }, 2000)
    } else {
      bot.sendMessage(chatId, jokeContext.content, options)
    }
    jokeStore.set(chatId, jokeContext.content);
  } catch (err) {
      console.error(err);
      let response = "Sorry the joke can't be cracked right now.";
      bot.sendMessage(chatId, response)
  }
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
  deliverJoke('', chatId);
})

bot.onText(/\/category/, (msg) => {
  const chatId = msg.chat.id;
  const resp = `
  Pick a category of jokes from the below list:
  /dark
  /programming
  `

  bot.sendMessage(chatId, resp);
})

bot.onText(/\/dark/, async (msg) => {
  const chatId = msg.chat.id;
  deliverJoke('dark', chatId);
})

bot.on("callback_query", async (query) => {
  const data = JSON.parse(query.data);
  const chatId = query.message.chat.id;

  if(data.action === "next") {
    deliverJoke(data.category, chatId);
  } else if(data.action === "explain") {
    const joke = jokeStore.get(chatId);
    const explanation = await explainJoke(joke);
    bot.sendMessage(chatId, explanation)
  }

  bot.answerCallbackQuery(query.id)
})

app.listen(PORT, () => {
  console.log(`App is live on port ${PORT}\nVisit http://localhost:${PORT}`)
})