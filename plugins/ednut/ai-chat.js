module.exports = [
{
  command: ["ai"],
  alias: ["openai", "open-ai"],
  description: "Ask Arch AI assistant something!",
  category: "Ai",
  ban: true,
  gcban: true,
  async execute(m, { ednut, prefix, openai }) {
    try {
      const raw = typeof m.text === "string" ? m.text : "";
      const text = raw.split(" ").slice(1).join(" ").trim();

      if (!text) {
        return m.reply(`Hey, I'm Arch MD virtual assistant 🤖\nUse: *${prefix}openai your message*`);
      }

      const logicPrompt = `You are Arch AI — a helpful, intelligent, and cheerful assistant created by Ednut. You speak in clear, friendly English with a touch of personality 😄

🧠 Personality Traits:
- Kind, positive, and curious
- Speaks like a helpful and fun companion
- Uses emojis only when they add meaning (not too often)
- Explains things simply and clearly
- If someone is rude, respond with light sarcasm and wit 😏

🗣️ Communication Style:
- Be clear, warm, and supportive
- Encourage users and make them feel comfortable
- Avoid technical jargon unless asked for it
- Use emojis where it helps express tone or clarity, not in every sentence

🎯 Example tone:
- “All done! Let me know if you need anything else 😊”
- “Whoa, slow down there! Let’s take it one step at a time.”
- “Uh-oh… looks like someone’s having a rough day 😅”

You are Arch AI — a smart and friendly assistant who always makes the conversation better.`;

      const { reply } = await openai(text, logicPrompt);

      await ednut.sendMessage(m.chat, { text: reply }, { quoted: m });
    } catch (err) {
      global.log("ERROR", `AI Plugin failed: ${err.message || err}`);
      m.reply("❌ Failed to get a response from Arch AI.");
    }
  }
},
  {
    command: ["chatbot"],
    alias: ["simi"],
    description: "Enable/Disable Chatbot and auto reply to all messages work with reply message",
    category: "Ai",
    owner: true,
    ban: true,
    gcban: true,
    execute: async (m, { ednut, prefix, isOwner, LoadDataBase }) => {
      let args = m.text.split(" ").slice(1);
      if (args[0] === 'on') {
        if (global.db.settings.chatbot === true) return m.reply('_Chatbot already enabled!_');
        global.db.settings.chatbot = true;
        m.reply('_Chatbot enabled!_\n> only work with reply message *when you reply to the bot number messages*');
      } else if (args[0] === 'off') {
        if (global.db.settings.chatbot === false) return m.reply('_Chatbot already disabled!_');
        global.db.settings.chatbot = false;
        m.reply('_Chatbot disabled!_');
      } else {
        m.reply(`_Example: ${prefix}chatbot on/off_`);
      }
    }
  }
]