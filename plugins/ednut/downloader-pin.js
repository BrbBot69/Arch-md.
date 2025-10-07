module.exports = [
  {
    command: ["img"],
    alias: ["pinterest"],
    description: "Download Pinterest images from a search query (e.g. 'img cat 5')",
    category: "Downloader",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, pinterest, text }) => {
      try {
        if (!text) return m.reply("Please provide a search query.");

        let [query, count] = text.split(" ");
        let imgCount = 3;

        if (text.includes(" ")) {
          const lastWord = text.trim().split(" ").pop();
          if (!isNaN(lastWord)) {
            imgCount = parseInt(lastWord);
            query = text.trim().split(" ").slice(0, -1).join(" ");
          } else {
            query = text;
          }
        }

        const results = await pinterest(query);
        if (!results.length) return m.reply(`No results found for *${query}*.`);

        const imagesToSend = Math.min(results.length, imgCount);
        for (let i = 0; i < imagesToSend; i++) {
          const result = results[i];
          await ednut.sendMessage(
            m.chat,
            { image: { url: result.image }, caption: global.footer },
            { quoted: m }
          );
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (err) {
        global.log("ERROR", `img command failed: ${err.message || err}`);
        m.reply("An error occurred while fetching Pinterest images.");
      }
    }
  },

  {
    command: ["pindl"],
    description: "Download Pinterest media from a pin URL",
    category: "Downloader",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, pinDL, lookup, text }) => {
      try {
        if (!text) return m.reply(`Enter a valid URL\n\nExample: ${global.prefix}pindl https://pin.it/xxxxxxx`);

        const res = await pinDL(text);
        if (!res?.data?.length) return m.reply("No media found for this link.");

        for (let result of res.data) {
          const mime = lookup(result.url);
          await ednut.sendMessage(
            m.chat,
            { [mime.split("/")[0]]: { url: result.url }, caption: global.footer },
            { quoted: m }
          );
        }
      } catch (err) {
        global.log("ERROR", `pindl command failed: ${err.message || err}`);
        m.reply("Failed to download from Pinterest.");
      }
    }
  }
];