module.exports = [
  {
    command: ["imagine"],
    description: "Generate an AI image",
    category: "Ai",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, axios }) => {
      try {
        let prompt = m.text.split(" ").slice(1).join(" ");
        if (!prompt) return m.reply("Please provide a prompt");

        let url = `https://bk9.fun/ai/magicstudio?prompt=${encodeURIComponent(prompt)}`;
        let response = await axios.get(url, { responseType: 'arraybuffer' });

        await ednut.sendMessage(m.chat, { image: Buffer.from(response.data, 'binary') }, { quoted: m });
      } catch (err) {
        global.log("ERROR", `Imagine command failed: ${err.message || err}`);
        m.reply("An error occurred while generating the image.");
      }
    }
  },
];