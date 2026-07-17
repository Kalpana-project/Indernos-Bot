const mineflayer = require('mineflayer')
const express = require('express')

// ==========================================
// EXPRESS WEB SERVER SETUP (For Render Keep-Alive)
// ==========================================
const app = express()
const PORT = process.env.PORT || 10000 

app.get('/', (req, res) => {
  res.send('Minecraft Bot is running on Indernos! 🤖')
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Web server listening on port ${PORT}`)
})

// ==========================================
// MINEFLAYER BOT SETUP & RECONNECT LOOP
// ==========================================
const botOptions = {
  host: 'delhi-5009.indernos.in', 
  port: 25565,                    
  username: 'ImHereBot',           
  version: '26.1.2'               
}

let bot
let chatInterval = null
let reconnectTimeout = null

function createMinecraftBot() {
  // Clear any existing chat loops before connecting to prevent duplicate spamming
  if (chatInterval) {
    clearInterval(chatInterval)
    chatInterval = null
  }

  console.log('Connecting to Minecraft server...')
  bot = mineflayer.createBot(botOptions)

  // When the bot successfully joins the world
  bot.once('spawn', () => {
    console.log(`${bot.username} has joined the server!`)
    
    // Send the first message immediately
    bot.chat('im here')

    // Spam "im here" exactly every 30 seconds (30,000 ms)
    chatInterval = setInterval(() => {
      if (bot && bot.entity) {
        bot.chat('im here')
        console.log('Sent spam message: "im here"')
      }
    }, 30000) 
  })

  // Handle sudden kicks from the server or plugins
  bot.on('kick', (reason) => {
    console.log(`Kicked from server: ${reason}`)
    handleReconnect()
  })

  // Handle network, timeout, or protocol errors
  bot.on('error', (err) => {
    console.error(`Mineflayer Error: ${err.message}`)
    if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
      handleReconnect()
    }
  })

  // Triggered when the connection drops completely
  bot.on('end', () => {
    console.log('Connection closed.')
    handleReconnect()
  })
}

// Manages clean reconnection attempts without overloading Node memory
function handleReconnect() {
  // Kill the active spam loop while disconnected
  if (chatInterval) {
    clearInterval(chatInterval)
    chatInterval = null
  }

  // If a reconnect isn't already scheduled, schedule one in 10 seconds
  if (!reconnectTimeout) {
    console.log('Attempting to reconnect in 10 seconds...')
    reconnectTimeout = setTimeout(() => {
      reconnectTimeout = null
      createMinecraftBot()
    }, 10000)
  }
}

// Initialize the first connection
createMinecraftBot()
