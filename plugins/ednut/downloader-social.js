module.exports = [
  {
    command: ["instagram"],
    alias: ["igdl", "ig"],
    description: "Download Instagram media",
    category: "Downloader",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, igdl, text }) => {
      if (!text) return m.reply("Please input an Instagram link.");
      if (!text.includes("instagram.com")) return m.reply("Input a valid Instagram link!");
      try {
        const result = await igdl(text);
        if (!result?.length) return m.reply("Could not retrieve any media.");
        for (let video of result) {
          await ednut.sendFile(m.chat, video.url, "ig.mp4", global.footer, m);
        }
      } catch (err) {
        global.log("ERROR", `Instagram downloader: ${err.message || err}`);
        m.reply("Instagram download failed.");
      }
    }
  },
  {
    command: ["facebook"],
    alias: ["fb", "fbvid", "fbvideo"],
    description: "Download Facebook media",
    category: "Downloader",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, axios, text }) => {
      try {
        if (!text) return m.reply("Please provide a Facebook video link.");
        if (!/(facebook\.com|fb\.watch)/.test(text)) return m.reply("Invalid Facebook link!");

        const apiUrl = `https://fb.bdbots.xyz/dl?url=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl);

        if (data.status !== "success" || !data.downloads || !data.downloads.length) {
          return m.reply(`❌ Failed to fetch download links.`);
        }

        // Prefer HD link if available
        const videoLink = data.downloads.find(d => d.quality === 'HD')?.url
                        || data.downloads[0].url;

        const title = data.title || "Facebook Video";

        // Send video
        await ednut.sendMessage(
          m.chat,
          { video: { url: videoLink }, caption: `🎥 *${title}*\n${global.footer}` },
          { quoted: m }
        );
      } catch (err) {
        global.log("ERROR", `Facebook downloader failed: ${err.message}`);
        m.reply("❌ Facebook download failed.");
      }
    }
  },
  {
    command: ["tiktok"],
    alias: ["tt", "ttvid"],
    description: "Download TikTok video",
    category: "Downloader",
    ban: false,
    execute: async (m, { ednut, api, text }) => {
      if (!text) return m.reply("Please input a TikTok link.");
      if (!text.includes("tiktok.com") && !text.includes("vm.tiktok.com")) return m.reply("Invalid TikTok link!");
      try {
        let res = await api.tiktok(text);
        let cap = global.footer;
        if (res.result.duration === 0) {
          for (let a of res.result.images) {
            await ednut.sendMessage(m.chat, { image: { url: a }, caption: cap }, { quoted: m });
          }
        } else {
          await ednut.sendMessage(m.chat, {
            video: { url: res.result.play },
            mimetype: "video/mp4",
            caption: cap
          }, { quoted: m });
        }
      } catch (err) {
        global.log("ERROR", `TikTok downloader: ${err.message || err}`);
        m.reply("TikTok download failed.");
      }
    }
  },

  {
    command: ["tiktoksound"],
    alias: ["ttmp3", "tiktokmp3"],
    description: "Download TikTok audio",
    category: "Downloader",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, tiktokDl, text }) => {
      if (!text) return m.reply("Please input a TikTok link.");
      if (!text.startsWith("https://")) return m.reply("Invalid TikTok link.");
      try {
        let res = await tiktokDl(text);
        if (!res?.status) return m.reply("Audio not found.");
        await ednut.sendMessage(m.chat, {
          audio: { url: res.music_info.url },
          mimetype: "audio/mpeg"
        }, { quoted: m });
      } catch (err) {
        global.log("ERROR", `TikTok MP3: ${err.message || err}`);
        m.reply("TikTok audio download failed.");
      }
    }
  },

  {
    command: ["shortlink-dl"],
    description: "Download media from a shortened link",
    category: "Downloader",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, fetch, text, isUrl }) => {
      if (!text) return m.reply("Please input a URL.");
      if (!isUrl(text)) return m.reply("Invalid URL.");
      try {
        let api = await fetch(`https://moneyblink.com/st/?api=524de9dbd18357810a9e6b76810ace32d81a7d5f&url=${text}`);
        let res = await api.json();
        await ednut.sendMessage(m.chat, { text: res.url }, { quoted: m });
      } catch (err) {
        global.log("ERROR", `Shortlink-DL: ${err.message || err}`);
        m.reply("Failed to process shortlink.");
      }
    }
  }
];