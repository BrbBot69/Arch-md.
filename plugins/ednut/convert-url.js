module.exports = [
  {
    command: ["ssweb"],
    alias: ["ss"],
    description: "Take a screenshot of a website",
    category: "Converter",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, text }) => {
      try {
        if (!text) return m.reply("Enter a URL");
        if (!text.startsWith("https://")) return m.reply("Please input a valid link");

        const { screenshotV2 } = require("getscreenshot.js");
        const data = await screenshotV2(text);

        await ednut.sendMessage(m.chat, { image: data, mimetype: "image/png" }, { quoted: m });
      } catch (err) {
        global.log("ERROR", `ssweb command failed: ${err.message || err}`);
        m.reply("Failed to take screenshot.");
      }
    }
  },

  {
    command: ["url"],
    alias: ["tourl"],
    description: "Upload media to URL",
    category: "Converter",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, quoted, uploadImage }) => {
      try {
        let q = m.quoted || m;
        let mime = (q.msg || q).mimetype || "";

        if (!mime) return m.reply("No media found");

        let media = await q.download();
        let link = await uploadImage(media);

        m.reply(link);
      } catch (err) {
        global.log("ERROR", `url command failed: ${err.message || err}`);
        m.reply("Failed to upload media.");
      }
    }
  },

  {
    command: ["shorturl"],
    alias: ["shortlink"],
    description: "Shorten a URL",
    category: "Converter",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, text, axios }) => {
      try {
        if (!text) return m.reply("Enter a URL");
        if (!text.startsWith("https://")) return m.reply("Please input a valid link");

        let res = await axios.get("https://tinyurl.com/api-create.php?url=" + encodeURIComponent(text));
        m.reply(res.data.toString());
      } catch (err) {
        global.log("ERROR", `shorturl command failed: ${err.message || err}`);
        m.reply("Failed to shorten the link.");
      }
    }
  }
];