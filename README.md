# Joke404🤖

> A Telegram bot that tells jokes and explains them when you don’t get it.

## Table of Contents
- [Introduction](#introduction)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [How It Works](#-how-it-works)
- [License](#-license)
- [Author](#-author)

## Introduction

**Joke404** is a Telegram bot that delivers jokes and explains them when you don’t get it 😅.

It’s designed to make humor more accessible while keeping things light, smart and interactive.

[**Try it out here on Telegram**](https://t.me/joke404bot)

---



## ✨ Features

- 🎭 **Random Jokes:** Get a new joke anytime with `/joke`
- 🧩 **Category Selection:** — Pick your humor type with `/category`  
  - Programming  
  - Dark  
  - Pun  
  - Spooky  
  - Misc
- 💬 **Explanations** — Confused? Hit “Explain” and get a short, natural breakdown of the joke.
- 🔁 **Next Button** — Instantly fetch another joke of the same category.
- 😂 **User Feedback** — React to jokes with emojis (funny 😆 / not funny 🫤)
- ☁️ **Dockerized** — Ready to deploy on any container based platform.

---

## 🛠️ Tech Stack

- **Node.js (v24)**  
- **node-telegram-bot-api**  
- **Express.js:** for health checks and uptime management. 
- **Docker:** for containerized deployment. 
- **Railway:** hosting environment.
- **Sv443:** joke api provider.

---

## 🚀 Getting Started

### 1️⃣ Clone the Repo
```bash
git clone https://github.com/Stephenasembo/joke404.git
cd joke404
cd backend
```

### 2️⃣ Create an .env File
```
BOT_TOKEN=your_telegram_bot_token
HOST_URL=https://your-deployment-url.com
```

### 3️⃣ Run Locally
```bash
npm install
npm run dev
```

### 4️⃣ Build and Run with Docker
```bash
docker build -t joke404_image .
docker run -d -p 8080:8080 --env-file .env joke404_image
```

## 💡 How It Works

- When a user sends `/start`, Joke404 sends a playful welcome message.

- `/joke` fetches random joke from the API.

- `/category` lets the user choose a specific humor style.

- `/next` fetches the joke in the same category as the previous joke.

- The bot can also explain jokes in a friendly, conversational tone.

## 🔮 Future Plans
- Joke caching and ranking system based on user reactions.
- Curated database of original and sourced jokes.
- Add more joke categories.

## 🧾 License
This project is open-source and available under the MIT License.
Jokes are sourced from Sv443 Network.

## 👨‍💻 Author
Stephen Mark Asembo

🌐 [Portfolio](https://stephenasembo.com)

🤖 [Try it out on Telegram](https://t.me/joke404bot)
