const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Indernos Bot Bypasser is running 24/7!');
});

app.listen(port, () => {
  console.log(`Web server listening on port ${port}`);
});

function launchBot() {
  const bot = mineflayer.createBot({
    host: 'delhi-7684.indernos.in', 
    port: 25565,                    
    username: 'IndernosBypasser',   
    version: '1.21.1',              
    auth: 'offline'                 
  });

  bot.on('chat', (username, message) => {
    if (message.includes('imhere-')) {
      const tokenMatch = message.match(/imhere-[a-f0-9]+/);
      if (tokenMatch) {
        const securityToken = tokenMatch[0];
        const humanDelay = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;
        console.log(`[ALERT] Indernos check detected! Responding in ${humanDelay / 1000}s...`);
        setTimeout(() => {
          bot.chat(securityToken);
          console.log(`[SUCCESS] Responded with token: ${securityToken}`);
        }, humanDelay);
      }
    }
  });

  bot.on('end', (reason) => {
    console.log(`Disconnected (${reason}). Reconnecting in 15 seconds...`);
    setTimeout(launchBot, 15000);
  });

  bot.on('error', (err) => console.log(`Error: ${err.message}`));
}

launchBot();
