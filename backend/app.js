require("dotenv").config()
const express = require("express")
const PORT = process.env.PORT || 3000;
const app = express();
const TelegramBot = require("node-telegram-bot-api");
const telegramToken = process.env.TG_BOT;
const bot = new TelegramBot(telegramToken, {polling: true});

app.get("/", (req, res) => {
  res.send("Hello welcome to joke404.")
})

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const resp = "Hello welcome to joke404. The hub of jokes."

  bot.sendMessage(chatId, resp);
});


app.listen(PORT, () => {
  console.log(`App is live on port ${PORT}\nVisit http://localhost:${PORT}`)
})