module.exports = [
  {
    command: ["totag"],
    alias: ["hidetag", "ht"],
    description: "Mention all group members with quoted text or media only",
    category: "Group",
    ban: true,
    gcban: true,
    group: true,
    execute: async (m, { ednut, isAdmins, isOwner, isBotAdmins }) => {
      try {
        if (!(isAdmins || isOwner)) return m.reply(msg.admin);

        const metadata = await ednut.groupMetadata(m.chat);
        const members = metadata.participants.map(p => p.id);
        const quoted = m.msg?.contextInfo?.quotedMessage;

        if (!quoted) return m.reply("*Reply to a message to tag everyone.*");

        let sendOpts = { quoted: m, mentions: members };

        if (quoted.conversation) {
          return ednut.sendMessage(m.chat, {
            text: quoted.conversation,
            ...sendOpts
          });
        }

        if (quoted.imageMessage) {
          const caption = quoted.imageMessage.caption || "";
          const imageUrl = await ednut.downloadAndSaveMediaMessage(quoted.imageMessage);
          return ednut.sendMessage(m.chat, {
            image: { url: imageUrl },
            caption,
            ...sendOpts
          });
        }

        if (quoted.audioMessage) {
          const audioUrl = await ednut.downloadAndSaveMediaMessage(quoted.audioMessage);
          return ednut.sendMessage(m.chat, {
            audio: { url: audioUrl },
            mimetype: "audio/mpeg",
            ...sendOpts
          });
        }

        if (quoted.videoMessage) {
          const caption = quoted.videoMessage.caption || "";
          const videoUrl = await ednut.downloadAndSaveMediaMessage(quoted.videoMessage);
          return ednut.sendMessage(m.chat, {
            video: { url: videoUrl },
            caption,
            ...sendOpts
          });
        }

        if (quoted.stickerMessage) {
          const stickerUrl = await ednut.downloadAndSaveMediaMessage(quoted.stickerMessage);
          return ednut.sendMessage(m.chat, {
            sticker: { url: stickerUrl },
            ...sendOpts
          });
        }

        if (quoted.documentMessage) {
          const docUrl = await ednut.downloadAndSaveMediaMessage(quoted.documentMessage);
          const fileName = quoted.documentMessage.fileName || "file";
          return ednut.sendMessage(m.chat, {
            document: { url: docUrl },
            mimetype: quoted.documentMessage.mimetype || 'application/octet-stream',
            fileName,
            ...sendOpts
          });
        }

        return m.reply("Unsupported message type.");
      } catch (err) {
        m.reply("Failed to tag everyone.");
        global.log?.("ERROR", `totag error: ${err.message || err}`);
      }
    }
  },

  {
    command: ["tagadmin"],
    alias: ["listadmin", "admin"],
    description: "Mention all group admins",
    category: "Group",
    ban: true,
    gcban: true,
    group: true,
    execute: async (m, { ednut }) => {
      try {
        const metadata = await ednut.groupMetadata(m.chat);
        const admins = metadata.participants.filter(p => p.admin);
        const mentions = admins.map(a => a.id);
        const list = admins.map((a, i) => `${i + 1}. @${a.id.split('@')[0]}`).join('\n');

        await ednut.sendMessage(m.chat, {
          text: `Group Admins:\n${list}`,
          mentions
        }, { quoted: m });
      } catch (err) {
        m.reply("Failed to tag admins.");
        global.log?.("ERROR", `tagadmin error: ${err.message || err}`);
      }
    }
  },

  {
    command: ["revoke"],
    alias: ["resetlink"],
    description: "Reset the group invite link",
    category: "Group",
    ban: true,
    gcban: true,
    group: true,
    execute: async (m, { ednut, isAdmins, isOwner, isBotAdmins }) => {
      try {
        if (!(isAdmins || isOwner)) return m.reply(msg.admin);
        if (!isBotAdmins) return m.reply(msg.BotAdmin);

        await ednut.groupRevokeInvite(m.chat);
        m.reply("Group link has been reset.");
      } catch (err) {
        m.reply("Failed to reset link.");
        global.log?.("ERROR", `revoke error: ${err.message || err}`);
      }
    }
  },

  {
    command: ["invite"],
    alias: ["grouplink"],
    description: "Get current group invite link",
    category: "Group",
    ban: true,
    gcban: true,
    group: true,
    execute: async (m, { ednut, isAdmins, isOwner, isBotAdmins }) => {
      try {
        if (!(isAdmins || isOwner)) return m.reply(msg.admin);
        if (!isBotAdmins) return m.reply(msg.BotAdmin);

        const code = await ednut.groupInviteCode(m.chat);
        await ednut.sendMessage(m.chat, { text: `https://chat.whatsapp.com/${code}` }, { quoted: m });
      } catch (err) {
        m.reply("Failed to fetch invite link.");
        global.log?.("ERROR", `invite error: ${err.message || err}`);
      }
    }
  },

  {
    command: ["tag"],
    description: "Mention all group members with plain text",
    category: "Group",
    ban: true,
    gcban: true,
    group: true,
    execute: async (m, { ednut, isAdmins, isOwner, isBotAdmins, text }) => {
      try {
        if (!(isAdmins || isOwner)) return m.reply(msg.admin);
        if (!text) return m.reply("Please provide a message. Example: .tag Hello!");

        const metadata = await ednut.groupMetadata(m.chat);
        const members = metadata.participants.map(p => p.id);

        await ednut.sendMessage(m.chat, { text, mentions: members });
        await ednut.sendMessage(m.chat, { delete: m.key });
      } catch (err) {
        m.reply("Failed to tag.");
        global.log?.("ERROR", `tag error: ${err.message || err}`);
      }
    }
  },

  {
    command: ["tagall"],
    description: "Mention everyone with optional message",
    category: "Group",
    ban: true,
    gcban: true,
    group: true,
    execute: async (m, { ednut, isAdmins, isOwner, isBotAdmins }) => {
      try {
        if (!(isAdmins || isOwner)) return m.reply(msg.admin);

        const metadata = await ednut.groupMetadata(m.chat);
        const participants = metadata.participants;
        const members = participants.map(p => p.id);
        const text = m.text.replace(/^[.,]?(tagall)/i, '').trim() || 'none';

        let message = `Message: ${text}\n\n`;
        for (const mem of participants) {
          message += `@${mem.id.split('@')[0]}\n`;
        }

        await ednut.sendMessage(m.chat, { text: message, mentions: members });
        await ednut.sendMessage(m.chat, { delete: m.key });
      } catch (err) {
        m.reply("Failed to tag all.");
        global.log?.("ERROR", `tagall error: ${err.message || err}`);
      }
    }
  }
];
