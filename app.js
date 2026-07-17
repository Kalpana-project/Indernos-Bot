const mineflayer = require('mineflayer')
const express = require('express')

// ==========================================
// CONFIGURATION
// ==========================================
// Replace this with your preferred bot account password
const BOT_PASSWORD = 'hahaha' 

const botOptions = {
  host: 'delhi-5009.indernos.in', 
  port: 25565,                    
  username: 'ImHereBot'
  // Version is left out to let Mineflayer auto-negotiate the protocol
}

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
// MINEFLAYER BOT SETUP & LOGIC
// ==========================================
let bot
let chatTimeout = null
let reconnectTimeout = null

function createMinecraftBot() {
  cleanupChatLoop()

  console.log('Connecting to Minecraft server...')
  bot = mineflayer.createBot(botOptions)

  // Intercept system/chat messages to manage authentication
  bot.on('message', (jsonMsg) => {
    const rawMessage = jsonMsg.toString().toLowerCase()

    // 1. Handle Account Registration Request
    if (rawMessage.includes('/register')) {
      console.log('Auth Required: Registering account...')
      bot.chat(`/register ${BOT_PASSWORD} ${BOT_PASSWORD}`)
    } 
    
    // 2. Handle Account Login Request
    else if (rawMessage.includes('/login')) {
      console.log('Auth Required: Logging in...')
      bot.chat(`/login ${BOT_PASSWORD}`)
    }

    // 3. Detect Successful Login Confirmation text
    if (rawMessage.includes('successful') || rawMessage.includes('logged in') || rawMessage.includes('welcome')) {
      if (!chatTimeout) {
        console.log('Authentication confirmed! Starting spam loop...')
        safeChat('im here')
        startSpamLoop()
      }
    }
  })

  // Fallback trigger in case the server doesn't use standard auth success text strings
  bot.once('spawn', () => {
    console.log(`${bot.username} spawned into the world layer.`)
    setTimeout(() => {
      if (!chatTimeout && bot && bot.entity) {
        console.log('Fallback active: Triggering spam loop post-spawn.')
        safeChat('im here')
        startSpamLoop()
      }
    }, 4000)
  })

  // Prevent getting stuck on the death menu screen
  bot.on('death', () => {
    console.log(`${bot.username} died! Respawning automatically...`)
    bot.respawn()
  })

  bot.on('kick', (reason) => {
    console.log(`Kicked from server: ${reason}`)
    handleReconnect()
  })

  bot.on('error', (err) => {
    console.error(`Mineflayer Error encountered: ${err.message}`)
    if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
      handleReconnect()
    }
  })

  bot.on('end', () => {
    console.log('Connection closed cleanly or dropped.')
    handleReconnect()
  })
}

// Prevents bot from executing chat commands mid-crash or mid-disconnect
function safeChat(message) {
  if (bot && bot.entity) {
    bot.chat(message)
    console.log(`Sent chat: "${message}"`)
  }
}

// Uses recursive timeouts + slight randomized variance (jitter)
// to simulate organic timing and bypass rigid anti-cheat filters.
function startSpamLoop() {
  cleanupChatLoop()

  // Targets ~30 seconds, adds a random 0 to 3 seconds window variation
  const nextDelay = 30000 + Math.floor(Math.random() * 3000)

  chatTimeout = setTimeout(() => {
    safeChat('im here')
    startSpamLoop() 
  }, nextDelay)
}

function cleanupChatLoop() {
  if (chatTimeout) {
    clearTimeout(chatTimeout)
    chatTimeout = null
  }
}

function handleReconnect() {
  cleanupChatLoop()

  if (!reconnectTimeout) {
    console.log('Reconnecting in 10 seconds...')
    reconnectTimeout = setTimeout(() => {
      reconnectTimeout = null
      createMinecraftBot()
    }, 10000)
  }
}

// Initial engine fire-up
createMinecraftBot()
