require("dotenv").config()
const express = require("express")

const PORT = process.env.PORT || 3000;

const app = express()

app.get("/", (req, res) => {
  res.send("Hello welcome to joke404.")
})

app.listen(PORT, () => {
  console.log(`App is live on port ${PORT}`)
})