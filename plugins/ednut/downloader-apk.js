const fetch = require("node-fetch");
const fs = require("fs");
const { writeFileSync, unlinkSync } = require("fs");
const { join } = require("path");

// ─── Aptoide API ─────────────────────────────────
const aptoide = {
  search: async (query) => {
    const res = await fetch(`https://ws75.aptoide.com/api/7/apps/search?query=${encodeURIComponent(query)}&limit=10`);
    const json = await res.json();
    return json?.datalist?.list?.map(v => ({
      name: v.name,
      size: v.size,
      version: v.file?.vername,
      id: v.package,
      download: v.stats?.downloads || "N/A"
    })) || [];
  },

  download: async (id) => {
    const res = await fetch(`https://ws75.aptoide.com/api/7/apps/search?query=${id}&limit=1`);
    const json = await res.json();
    const app = json?.datalist?.list?.[0];
    return {
      img: app.icon,
      developer: app.store.name,
      appname: app.name,
      link: app.file.path
    };
  }
};

const downloadFile = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download file: ${res.statusText}`);
  return Buffer.from(await res.arrayBuffer());
};

// ─── PLUGIN EXPORT ────────────────────────────────
module.exports = [
  {
    command: ["apk"],
    description: "Search & download APK from Aptoide",
    category: "Downloader",
    async execute(m, { ednut, text, prefix }) {
      if (!text) return m.reply(`Enter app name\n\nExample:\n${prefix}apk facebook`);

      ednut.apk = ednut.apk || {};

      // ── If user replies with number ──
      if (text.length <= 2 && !isNaN(text) && ednut.apk[m.sender]) {
        const dt = ednut.apk[m.sender];

        // Cancel previous timeout
        if (dt.time) clearTimeout(dt.time);
        delete ednut.apk[m.sender];

        if (dt.download) return m.reply("❌ You are already downloading an app!");

        try {
          dt.download = true;

          const info = await aptoide.download(dt.data[text - 1].id);

          const caption = `🧩 *App Name:* ${info.appname}\n👨‍💻 *Developer:* ${info.developer}\n\n_⌛ Sending APK..._`;

          const preview = await ednut.sendFile(m.chat, info.img, `${info.appname}.jpg`, caption, m);

          const apkBuffer = await downloadFile(info.link);
          const apkPath = join(__dirname, `${info.appname}.apk`);
          writeFileSync(apkPath, apkBuffer);

          await ednut.sendMessage(m.chat, {
            document: { url: apkPath },
            fileName: `${info.appname}.apk`,
            mimetype: "application/vnd.android.package-archive"
          }, { quoted: preview });

          // Cleanup
          unlinkSync(apkPath);
        } catch (err) {
          global.log("ERROR", `APK download error: ${err.message || err}`);
          m.reply("❌ Failed to download the APK.");
        } finally {
          dt.download = false;
        }

      } else {
        // ── Initial search ──
        const results = await aptoide.search(text);
        if (!results.length) return m.reply("❌ No results found.");

        const list = results.map((v, i) => (
          `${i + 1}. ${v.name}\n• Size: ${v.size}\n• Version: ${v.version}\n• Downloads: ${v.download}\n• ID: ${v.id}`
        )).join("\n\n");

        const header = `_Reply with a number to download (1 - ${results.length})_\nExample: *${prefix}apk 2*`;

        m.reply(`${header}\n\n${list}`);

        ednut.apk[m.sender] = {
          download: false,
          data: results,
          time: setTimeout(() => {
            delete ednut.apk[m.sender];
          }, 10 * 60 * 1000) // auto-expire in 10 mins
        };
      }
    }
  }
];