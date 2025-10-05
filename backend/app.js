require("dotenv").config()
const express = require("express")
const PORT = process.env.PORT || 3000;
const app = express();
const TelegramBot = require("node-telegram-bot-api");
const telegramToken = process.env.TG_BOT;
const bot = new TelegramBot(telegramToken, {polling: {params: {timeout: 10}, interval: 500}});

app.get("/", (req, res) => {
  res.send("Hello welcome to joke404.")
});

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

    if(response.type === "single") {
      return response.joke;
    }
    const joke = [response.setup, response.delivery];
    return joke;
  } catch(err) {
    console.error(err);
  }
}

function deliverJoke(category, chatId) {
  const options = {
    reply_markup: {
      inline_keyboard: [
        [{text: "Next", callback_data: "next"}, {text: "Explain", callback_data: "explain"}]
      ]
    }
  }
  fetchJoke(category)
    .then((res) => {
      console.log(res);
      if(Array.isArray(res)) {
        bot.sendMessage(chatId, res[0]);
        setTimeout(() => {
          bot.sendMessage(chatId, res[1], options)
        }, 2000)
      } else {
        console.log(`Single type joke delivered: ${res}`)
        console.log({chatId})
        bot.sendMessage(chatId, res, options)
      }
    })
    .catch ((err) => {
      console.error(err);
      let response = "Sorry the joke can't be cracked right now.";
      bot.sendMessage(chatId, response)
    })
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

bot.on("callback_query", (query) => {
  const data = query.data;
  const chatId = query.message.chat.id;

  if(data === "next") {
    bot.sendMessage(chatId, "Next joke will be sent shortly.")
  } else if(data === "explain") {
    bot.sendMessage(chatId, "I will explain the joke shortly.")
  }

  bot.answerCallbackQuery(query.id)
})

app.listen(PORT, () => {
  console.log(`App is live on port ${PORT}\nVisit http://localhost:${PORT}`)
})