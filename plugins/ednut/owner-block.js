module.exports = [
  {
    command: ["block"],
    alias: ["blk"],
    description: "Block a user (reply/tag/number)",
    category: "Owner",
    ban: false,
    gcban: false,
    execute: async (m, { ednut, text, isOwner, isGroup }) => {
    if (m.isGroup) return m.reply(msg.baileys);
    if (!isOwner) return m.reply(msg.owner)
      const mem = !m.isGroup
        ? m.chat
        : m.mentionedJid?.[0]
        ? m.mentionedJid[0]
        : m.quoted
        ? m.quoted.sender
        : text
        ? text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
        : null;

      if (!mem) return m.reply("Please reply, tag, or input a valid number to block.");

      await ednut.updateBlockStatus(mem, "block");
      const msg = `Successfully blocked @${mem.split("@")[0]}`;
      if (m.isGroup) {
        await ednut.sendMessage(m.chat, { text: msg, mentions: [mem] }, { quoted: m });
      } else {
        m.reply(msg);
      }
    }
  },
  {
    command: ["unblock"],
    alias: ["ublk"],
    description: "Unblock a user (reply/tag/number)",
    category: "Owner",
    ban: false,
    gcban: false,
    execute: async (m, { ednut, text, isOwner, isGroup}) => {
    if (m.isGroup) return m.reply(msg.baileys);
    if (!isOwner) return m.reply(msg.owner)
      const mem = !m.isGroup
        ? m.chat
        : m.mentionedJid?.[0]
        ? m.mentionedJid[0]
        : m.quoted
        ? m.quoted.sender
        : text
        ? text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
        : null;

      if (!mem) return m.reply("Please reply, tag, or input a valid number to unblock.");

      await ednut.updateBlockStatus(mem, "unblock");
      const msg = `Successfully unblocked @${mem.split("@")[0]}`;
      if (m.isGroup) {
        await ednut.sendMessage(m.chat, { text: msg, mentions: [mem] }, { quoted: m });
      } else {
        m.reply(msg);
      }
    }
  },
  {
    command: ["listblock"],
    alias: ["listblocked"],
    description: "List all blocked contacts",
    category: "Owner",
    ban: false,
    gcban: false,
    execute: async (m, { ednut, isOwner, isGroup}) => {
if (m.isGroup) return m.reply(msg.baileys);
if (!isOwner) return m.reply(msg.owner)
      const listblok = await ednut.fetchBlocklist();
      if (!listblok.length) return m.reply("No blocked users found.");

      const blockedList = listblok.map((v, i) => `${i + 1}. @${v.replace(/@.+/, "")}`).join("\n");
      await m.reply(
        `Blocked Contacts:\n\nTotal: ${listblok.length}\n\n${blockedList}`,
        null,
        { mentions: listblok }
      );
    }
  },
  {
    command: ["listgroup"],
    alias: ["listgc"],
    description: "List all joined group chats",
    category: "Owner",
    ban: false,
    gcban: false,
    execute: async (m, { ednut, isOwner, isGroup }) => {
    if (m.isGroup) return m.reply(msg.baileys);
    if (!isOwner) return m.reply(msg.owner)
      const allGroups = await ednut.groupFetchAllParticipating();
      const groupList = Object.values(allGroups);

      let teks = `List of all groups:\n\nTotal: ${groupList.length}\n`;

      for (const u of groupList) {
        teks += `\n-----------------------------\nID: ${u.id}\nName: ${u.subject}\nMembers: ${u.participants.length}\nStatus: ${u.announce ? "Closed" : "Open"}\nOwner: ${u.subjectOwner ? u.subjectOwner.split("@")[0] : "Unknown"}`;
      }

      return m.reply(teks);
    }
  }
];