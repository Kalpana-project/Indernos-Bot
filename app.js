const mineflayer = require('mineflayer');
const express = require('express');

// 1. STABLE NETWORK PORT AND KEEP-ALIVE SYSTEM FOR RENDER
const app = express();
const port = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('Indernos Advanced Core Bypasser Active 24/7');
});

app.listen(port, () => {
  console.log(`Keep-Alive Web Gateway listening on port ${port}`);
});

// 2. CHAT AND NETWORK PACKET BINDING MATRIX
function launchBot() {
  const serverHost = process.env.MC_HOST || 'delhi-7684.indernos.in';
  const serverPort = parseInt(process.env.MC_PORT) || 25565;
  const botUsername = process.env.MC_USERNAME || 'IndernosBot';

  console.log(`[INIT] Launching bot "${botUsername}" targeting ${serverHost}:${serverPort}...`);

  const bot = mineflayer.createBot({
    host: serverHost, 
    port: serverPort,                    
    username: botUsername,   
    auth: 'offline',
    
    // --- FORCE 26.1.2 VIA PROTOCOL OVERRIDE ---
    // Tells the inner node-minecraft-protocol to bypass string parsing
    version: false, 
    protocolVersion: 775, // The exact internal protocol ID for the 26.1.x codebase
    
    // --- RAM OPTIMIZATIONS FOR RENDER ---
    viewDistance: 'tiny', 
    physicsEnabled: false 
  });

  // Disable physics/tracking entirely on spawn to prevent Out of Memory crashes
  bot.on('spawn', () => {
    console.log('[SPAWN] Bot entered world successfully. Network modules hooked.');
    if (bot.physics) bot.physics.enabled = false;
  });

  // TARGETS SYSTEM PACKETS DIRECTLY TO CAPTURE CLICK ACTIONS
  bot._client.on('systemChat', (packet) => {
    try {
      const rawJson = packet.content || packet.message;
      if (!rawJson) return;

      const messageText = JSON.stringify(rawJson).toLowerCase();

      if (messageText.includes('paying user') || messageText.includes('imhere-')) {
        const tokenMatch = messageText.match(/imhere-[a-f0-9]+/);
        if (tokenMatch) {
          const securityToken = tokenMatch[0];
          const humanDelay = Math.floor(Math.random() * (14000 - 7000 + 1)) + 7000;
          
          console.log(`[NETWORK CAPTURE] Found verification token: ${securityToken}`);
          console.log(`[SIMULATION] Delaying execution by ${humanDelay / 1000} seconds...`);
          
          setTimeout(() => {
            bot.chat(securityToken);
            console.log(`[VALIDATED] Token "${securityToken}" sent.`);
          }, humanDelay);
        }
      }
    } catch (error) {
      console.log(`[PACKET RECOVERY ERROR]: ${error.message}`);
    }
  });

  // 3. PERSISTENT RECONNECTION ENGINE FOR NETWORK RESETS
  bot.on('end', (reason) => {
    console.log(`Connection dropped (${reason}). Rejoining server framework in 15 seconds...`);
    setTimeout(launchBot, 15000);
  });

  bot.on('error', (err) => {
    console.log(`Network Protocol Error Detected: ${err.message}`);
  });
}

// Fire initial activation loop
launchBot();
