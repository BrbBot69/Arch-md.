module.exports = [
  {
    command: ["bully"],
    description: "Bully someone",
    category: "Fun",
    ban: true,
    gcban: true,
    execute: async (m, { ednut }) => {
      try {
        const url = `https://api.nexoracle.com/reactions-pack/bully?apikey=d0634e61e8789b051e`;
        let senderTag = '@' + m.sender.split('@')[0];
        let target = m.quoted ? m.quoted.sender : null;
        let targetTag = target ? '@' + target.split('@')[0] : null;
        let caption = targetTag ? `${senderTag} bullied ${targetTag}` : `${senderTag} is bullying the air`;
        await ednut.sendMessage(m.chat, { video: { url }, gifPlayback: true, caption, mentions: targetTag ? [m.sender, target] : [m.sender] }, { quoted: m });
      } catch (err) {
        m.reply("Failed to send reaction.");
        if (typeof global.log === "function") global.log("ERROR", `bully error: ${err.message || err}`);
      }
    }
  },
  {
    command: ["slap"],
    description: "Slap someone",
    category: "Fun",
    ban: true,
    gcban: true,
    execute: async (m, { ednut }) => {
      try {
        const url = `https://api.nexoracle.com/reactions-pack/slap?apikey=d0634e61e8789b051e`;
        let senderTag = '@' + m.sender.split('@')[0];
        let target = m.quoted ? m.quoted.sender : null;
        let targetTag = target ? '@' + target.split('@')[0] : null;
        let caption = targetTag ? `${senderTag} slapped ${targetTag}` : `${senderTag} is slapping the air`;
        await ednut.sendMessage(m.chat, { video: { url }, gifPlayback: true, caption, mentions: targetTag ? [m.sender, target] : [m.sender] }, { quoted: m });
      } catch (err) {
        m.reply("Failed to send reaction.");
        if (typeof global.log === "function") global.log("ERROR", `slap error: ${err.message || err}`);
      }
    }
  },
  {
    command: ["kill"],
    description: "Kill someone",
    category: "Fun",
    ban: true,
    gcban: true,
    execute: async (m, { ednut }) => {
      try {
        const url = `https://api.nexoracle.com/reactions-pack/kill?apikey=d0634e61e8789b051e`;
        let senderTag = '@' + m.sender.split('@')[0];
        let target = m.quoted ? m.quoted.sender : null;
        let targetTag = target ? '@' + target.split('@')[0] : null;
        let caption = targetTag ? `${senderTag} killed ${targetTag}` : `${senderTag} is killing the air`;
        await ednut.sendMessage(m.chat, { video: { url }, gifPlayback: true, caption, mentions: targetTag ? [m.sender, target] : [m.sender] }, { quoted: m });
      } catch (err) {
        m.reply("Failed to send reaction.");
        if (typeof global.log === "function") global.log("ERROR", `kill error: ${err.message || err}`);
      }
    }
  },
  {
    command: ["cuddle"],
    description: "Cuddle someone",
    category: "Fun",
    ban: true,
    gcban: true,
    execute: async (m, { ednut }) => {
      try {
        const url = `https://api.nexoracle.com/reactions-pack/cuddle?apikey=d0634e61e8789b051e`;
        let senderTag = '@' + m.sender.split('@')[0];
        let target = m.quoted ? m.quoted.sender : null;
        let targetTag = target ? '@' + target.split('@')[0] : null;
        let caption = targetTag ? `${senderTag} cuddled ${targetTag}` : `${senderTag} is cuddling themselves`;
        await ednut.sendMessage(m.chat, { video: { url }, gifPlayback: true, caption, mentions: targetTag ? [m.sender, target] : [m.sender] }, { quoted: m });
      } catch (err) {
        m.reply("Failed to send reaction.");
        if (typeof global.log === "function") global.log("ERROR", `cuddle error: ${err.message || err}`);
      }
    }
  },
  {
    command: ["wave"],
    description: "Wave at someone",
    category: "Fun",
    ban: true,
    gcban: true,
    execute: async (m, { ednut }) => {
      try {
        const url = `https://api.nexoracle.com/reactions-pack/wave?apikey=d0634e61e8789b051e`;
        let senderTag = '@' + m.sender.split('@')[0];
        let target = m.quoted ? m.quoted.sender : null;
        let targetTag = target ? '@' + target.split('@')[0] : null;
        let caption = targetTag ? `${senderTag} waved at ${targetTag}` : `${senderTag} is waving`;
        await ednut.sendMessage(m.chat, { video: { url }, gifPlayback: true, caption, mentions: targetTag ? [m.sender, target] : [m.sender] }, { quoted: m });
      } catch (err) {
        m.reply("Failed to send reaction.");
        if (typeof global.log === "function") global.log("ERROR", `wave error: ${err.message || err}`);
      }
    }
  },
  {
    command: ["hug"],
    description: "Hug someone",
    category: "Fun",
    ban: true,
    gcban: true,
    execute: async (m, { ednut }) => {
      try {
        const url = `https://api.nexoracle.com/reactions-pack/hug?apikey=d0634e61e8789b051e`;
        let senderTag = '@' + m.sender.split('@')[0];
        let target = m.quoted ? m.quoted.sender : null;
        let targetTag = target ? '@' + target.split('@')[0] : null;
        let caption = targetTag ? `${senderTag} hugged ${targetTag}` : `${senderTag} is hugging themselves`;
        await ednut.sendMessage(m.chat, { video: { url }, gifPlayback: true, caption, mentions: targetTag ? [m.sender, target] : [m.sender] }, { quoted: m });
      } catch (err) {
        m.reply("Failed to send reaction.");
        if (typeof global.log === "function") global.log("ERROR", `hug error: ${err.message || err}`);
      }
    }
  },
  {
    command: ["lick"],
    description: "Lick someone",
    category: "Fun",
    ban: true,
    gcban: true,
    execute: async (m, { ednut }) => {
      try {
        const url = `https://api.nexoracle.com/reactions-pack/lick?apikey=d0634e61e8789b051e`;
        let senderTag = '@' + m.sender.split('@')[0];
        let target = m.quoted ? m.quoted.sender : null;
        let targetTag = target ? '@' + target.split('@')[0] : null;
        let caption = targetTag ? `${senderTag} licked ${targetTag}` : `${senderTag} is licking their lips`;
        await ednut.sendMessage(m.chat, { video: { url }, gifPlayback: true, caption, mentions: targetTag ? [m.sender, target] : [m.sender] }, { quoted: m });
      } catch (err) {
        m.reply("Failed to send reaction.");
        if (typeof global.log === "function") global.log("ERROR", `lick error: ${err.message || err}`);
      }
    }
  },
  {
    command: ["kiss"],
    description: "Kiss someone",
    category: "Fun",
    ban: true,
    gcban: true,
    execute: async (m, { ednut }) => {
      try {
        const url = `https://api.nexoracle.com/reactions-pack/kiss?apikey=d0634e61e8789b051e`;
        let senderTag = '@' + m.sender.split('@')[0];
        let target = m.quoted ? m.quoted.sender : null;
        let targetTag = target ? '@' + target.split('@')[0] : null;
        let caption = targetTag ? `${senderTag} kissed ${targetTag}` : `${senderTag} is blowing a kiss`;
        await ednut.sendMessage(m.chat, { video: { url }, gifPlayback: true, caption, mentions: targetTag ? [m.sender, target] : [m.sender] }, { quoted: m });
      } catch (err) {
        m.reply("Failed to send reaction.");
        if (typeof global.log === "function") global.log("ERROR", `kiss error: ${err.message || err}`);
      }
    }
  },
  {
    command: ["wink"],
    description: "Wink at someone",
    category: "Fun",
    ban: true,
    gcban: true,
    execute: async (m, { ednut }) => {
      try {
        const url = `https://api.nexoracle.com/reactions-pack/wink?apikey=d0634e61e8789b051e`;
        let senderTag = '@' + m.sender.split('@')[0];
        let target = m.quoted ? m.quoted.sender : null;
        let targetTag = target ? '@' + target.split('@')[0] : null;
        let caption = targetTag ? `${senderTag} winked at ${targetTag}` : `${senderTag} is winking`;
        await ednut.sendMessage(m.chat, { video: { url }, gifPlayback: true, caption, mentions: targetTag ? [m.sender, target] : [m.sender] }, { quoted: m });
      } catch (err) {
        m.reply("Failed to send reaction.");
        if (typeof global.log === "function") global.log("ERROR", `wink error: ${err.message || err}`);
      }
    }
  },
];