const axios = require('axios');

module.exports = [
  {
    command: ['pair'],
    alias: ['code'],
    description: "Generate a pair code for your bot.",
    category: "Tool",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, text }) => {
      const number = text ? text.replace(/\+|\s/g, '').trim() : '';

      if (!number) {
        return m.reply("❌ *Error:* Provide a phone number\nExample: .pair 253855856885");
      }
      
      try {
        // Use your own pairing site with axios
        const response = await axios.get(`https://arch-md.goodnesstechhost.xyz/code?number=${encodeURIComponent(number)}`);
        const pairCode = response.data.code;

        if (!pairCode) {
          throw new Error('No pairing code received from the API.');
        }

        const replyMessage = `*👤 Pair Code:*\n\`\`\`${pairCode}\`\`\`\n\n👤 *How to Link:* \n1. Open WhatsApp on your phone.\n2. Go to *Settings > Linked Devices*.\n3. Tap *Link a Device* then *Link with Phone*.\n4. Enter the pair code above.\n\n⏳ *Code expires in 2 minutes!*`;
        
        const codeMessage = ` ${pairCode} `;
        await ednut.sendMessage(m.chat, { text: replyMessage }, { quoted: m });
        await ednut.sendMessage(m.chat, { text: codeMessage }, { quoted: m });
      } catch (error) {
        console.error("Pairing API Error:", error);
        m.reply('❌ *Error fetching pair code. Try again later.*');
      }
    }
  }
];