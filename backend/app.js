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
          [{text: "Funny 😂", callback_data: JSON.stringify({action: "funny"})},
          {text: "Not funny 🫤", callback_data:  JSON.stringify({action: "notFunny"})}],
          [{text: "Next ➡️", callback_data: JSON.stringify({action: "next", category})},
          {text: "Explain 💡", callback_data:  JSON.stringify({action: "explain"})}]
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

async function removeInlineBtns(chatId, messageId) {
  await bot.editMessageReplyMarkup({inline_keyboard: []}, {chat_id: chatId, message_id: messageId})
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const resp = `
Hey there 👋  
Welcome to Joke404, your daily dose of laughs (and explanations when you don't get the joke 😅).  

Want to crack one right now?  
👉 Try /joke for a random laugh  
👉 Or /category to pick your humor style  

Need more options? Type /help
  `

  bot.sendMessage(chatId, resp);
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const resp = `
🛠️ Here's what I can do:

/start — Say hi and learn what I'm about  
/joke — Drop a random joke for you  
/category — Pick your favorite kind of humor  
/help — See this list again anytime  

💬 Tip: You can always tap “Next” after a joke for another laugh!
💡 Tip: Can't get the joke? Just hit “Explain” and I'll break it down!
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
🎨 Pick your joke category:

/dark — Twisted humor with a dark twist  
/programming — For devs who debug life with laughter  
/pun — Wordplay and clever twists  
/spooky — Ghostly giggles and creepy chuckles  
/misc — A surprise mix of everything!

⚠️ Some jokes may include adult or sensitive themes.  `

  bot.sendMessage(chatId, resp);
})

bot.onText(/\/dark/, async (msg) => {
  const chatId = msg.chat.id;
  deliverJoke('dark', chatId);
})

bot.onText(/\/programming/, async (msg) => {
  const chatId = msg.chat.id;
  deliverJoke('Programming', chatId);
})

bot.onText(/\/pun/, async (msg) => {
  const chatId = msg.chat.id;
  deliverJoke('Pun', chatId);
})

bot.onText(/\/spooky/, async (msg) => {
  const chatId = msg.chat.id;
  deliverJoke('Spooky', chatId);
})

bot.onText(/\/misc/, async (msg) => {
  const chatId = msg.chat.id;
  deliverJoke('Misc', chatId);
})


bot.on("callback_query", async (query) => {
  const data = JSON.parse(query.data);
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id

  if(data.action === "next") {
    deliverJoke(data.category, chatId);
    await removeInlineBtns(chatId, messageId)
  } else if(data.action === "explain") {
    const joke = jokeStore.get(chatId);
    const explanation = await explainJoke(joke);
    await removeInlineBtns(chatId, messageId);
    const options = {
      reply_markup: {
        inline_keyboard: [
          [{text: "Funny 😂", callback_data: JSON.stringify({action: "funny"})},
          {text: "Not funny 🫤", callback_data:  JSON.stringify({action: "notFunny"})},
          {text: "Next ➡️", callback_data: JSON.stringify({action: "next"})}
          ]
        ]
      }
    }
    bot.sendMessage(chatId, explanation, options)
  } else if(data.action === "funny") {
    await removeInlineBtns(chatId, messageId)
    bot.sendMessage(chatId, "Glad you liked it! 😄");
  } else if(data.action === "notFunny") {
    await removeInlineBtns(chatId, messageId)
    bot.sendMessage(chatId, "Hmm, not your type huh? 🤔");
  }

  bot.answerCallbackQuery(query.id)
})

app.listen(PORT, () => {
  console.log(`App is live on port ${PORT}\nVisit http://localhost:${PORT}`)
})