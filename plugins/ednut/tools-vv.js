const isGroupJid = jid => jid.endsWith('@g.us');

module.exports = {
  command: ["vv"],
  alias: ["readviewonce"],
  description: "Resend view-once image/video/audio to a target or current chat",
  category: "Tool",

  async execute(m, { ednut }) {
    if (!m.quoted || !m.quoted.mtype) {
      return m.reply("Reply to a view-once image, video, or voice note.");
    }

    // Determine target JID
    let target;
    if (process.env.VV && !isGroupJid(process.env.VV)) {
      target = process.env.VV;
    } else {
      if (process.env.VV && isGroupJid(process.env.VV)) {
        await m.reply("⚠️VV environment variable cannot be a group JID. Sending to current chat.");
      }
      target = m.chat;
    }

    try {
      const mediaBuffer = await m.quoted.download();

      if (!mediaBuffer) {
        return m.reply("Failed to download media.");
      }

      const mediaType = m.quoted.mtype;
      const footer = `\n\n${global.footer}`;

      if (mediaType === 'imageMessage') {
        await ednut.sendMessage(target, {
          image: mediaBuffer,
          caption: "*🖼️ View-once image unlocked.*" + footer
        }, { quoted: m });

      } else if (mediaType === 'videoMessage') {
        await ednut.sendMessage(target, {
          video: mediaBuffer,
          caption: "*🎥 View-once video unlocked.*" + footer
        }, { quoted: m });

      } else if (mediaType === 'audioMessage') {
        await ednut.sendMessage(target, {
          audio: mediaBuffer,
          mimetype: 'audio/ogg',
          ptt: true
        }, { quoted: m });

      } else {
        return m.reply("Unsupported media type. Use on image, video, or voice note.");
      }

    } catch (err) {
      log("ERROR", `vv plugin: ${err.message || err}`);
      return m.reply("Error while processing media.");
    }
  }
};
