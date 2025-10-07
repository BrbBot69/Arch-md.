module.exports = [
  {
    command: ["ping"],
    description: "Check bot latency",
    category: "Info",
    ban: true,
    gcban: true,
    execute: async (m, { ednut }) => {
    let start = Date.now();
    let initialMessage = await ednut.sendMessage(m.chat, { text: `_checking response..._` });
let ping = Date.now() - start;
      await ednut.sendMessage(m.chat, { text: `*Pong!* ${ping}ms`, edit: { remoteJid: m.chat, id: initialMessage.key.id } });
    }
  },
  {
    command: ["runtime"],
    description: "Check bot runtime",
    category: "Info",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, runtime }) => {
      let runtimeMessage = `${global.botname} has been active for ${runtime(process.uptime())}`;
      await m.reply(runtimeMessage);
    }
  },
  {
    command: ["test"],
    alias: ["bot"],
    description: "Test command",
    category: "Info",
    ban: true,
    gcban: true,
    execute: async (m, { text, reply2 }) => {
      if (!text) return reply2('*Active 🤖*');
      // Add additional logic here if needed
    }
  }
]