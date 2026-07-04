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
  const bot = mineflayer.createBot({
    host: 'delhi-5009.indernos.in', 
    port: 25565,                    
    username: 'Propalyer',   
    version: '26.1.12',              
    auth: 'offline'                 
  });

  // TARGETS SYSTEM PACKETS DIRECTLY TO CAPTURE CLICK ACTIONS
  bot._client.on('systemChat', (packet) => {
    try {
      // Decode the raw JSON string component map sent by the hosting dashboard
      const rawJson = packet.content || packet.message;
      if (!rawJson) return;

      const messageText = JSON.stringify(rawJson).toLowerCase();

      // Look for the paying user priority system message fingerprint
      if (messageText.includes('paying user') || messageText.includes('imhere-')) {
        
        // Isolate the exact dynamic hash token using custom tracking regex
        const tokenMatch = messageText.match(/imhere-[a-f0-9]+/);
        
        if (tokenMatch) {
          const securityToken = tokenMatch[0];
          
          // Generate a safe, humanized typing delay buffer (7 to 14 seconds)
          const humanDelay = Math.floor(Math.random() * (14000 - 7000 + 1)) + 7000;
          
          console.log(`[NETWORK CAPTURE] Found verification token: ${securityToken}`);
          console.log(`[SIMULATION] Delaying execution by ${humanDelay / 1000} seconds to mimic real player actions...`);
          
          setTimeout(() => {
            // Emulates clicking the message button and pressing Enter simultaneously
            bot.chat(securityToken);
            console.log(`[VALIDATED] Token "${securityToken}" sent. Connection verified!`);
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
