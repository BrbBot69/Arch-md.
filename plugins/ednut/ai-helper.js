module.exports = [
  {
    command: ["seekcoder"],
    description: "Ask Deepseek Coder 67B AI",
    category: "Ai",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, axios }) => {
      try {
        const query = m.text.split(" ").slice(1).join(" ");
        if (!query) return m.reply("📝 Please provide a query for Deepseek Coder.");

        const url = `https://archive.lick.eu.org/api/ai/deepseek-coder-67b?text=${encodeURIComponent(query)}`;
        const res = await axios.get(url);

        const text = res.data?.result?.trim();
        if (!text) return m.reply("⚠️ Unexpected response from Deepseek Coder.");

        await ednut.sendMessage(m.chat, { text }, { quoted: m });
      } catch (err) {
        global.log("ERROR", `seekcoder failed: ${err.message || err}`);
        m.reply("❌ Failed to contact Deepseek Coder.");
      }
    }
  },
  {
    command: ["groq"],
    description: "Ask Groq Qwen QWQ 32B AI",
    category: "Ai",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, axios }) => {
      try {
        const query = m.text.split(" ").slice(1).join(" ");
        if (!query) return m.reply("📝 Please provide a query for Groq Qwen.");

        const url = `https://archive.lick.eu.org/api/ai/groq-qwen-qwq-32b?text=${encodeURIComponent(query)}`;
        const res = await axios.get(url);

        const text = res.data?.result?.trim();
        if (!text) return m.reply("⚠️ Unexpected response from Groq Qwen.");

        await ednut.sendMessage(m.chat, { text }, { quoted: m });
      } catch (err) {
        global.log("ERROR", `groqqwen failed: ${err.message || err}`);
        m.reply("❌ Failed to contact Groq Qwen.");
      }
    }
  },
  {
    command: ["deepseek"],
    description: "Ask Deepseek R1 AI",
    category: "Ai",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, axios }) => {
      try {
        const query = m.text.split(" ").slice(1).join(" ");
        if (!query) return m.reply("📝 Please provide a query for Deepseek R1.");

        const url = `https://archive.lick.eu.org/api/ai/deepseek-r1?text=${encodeURIComponent(query)}`;
        const res = await axios.get(url);

        const text = res.data?.result?.trim();
        if (!text) return m.reply("⚠️ Unexpected response from Deepseek R1.");

        await ednut.sendMessage(m.chat, { text }, { quoted: m });
      } catch (err) {
        global.log("ERROR", `deepseek failed: ${err.message || err}`);
        m.reply("❌ Failed to contact Deepseek R1.");
      }
    }
  }
];