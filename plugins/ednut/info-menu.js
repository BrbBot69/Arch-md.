const os = require("os");
const moment = require("moment-timezone");
const { sizeFormatter } = require("human-readable");

const welDate = moment.tz(global.timezone).format("DD/MM/YYYY");
const formatp = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`,
});

const run = function (seconds) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [d && `${d} d`, h && `${h} h`, m && `${m} m`, s && `${s} s`].filter(Boolean).join(" ");
};

const getTime = (format = "HH:mm:ss", date) => {
  return date ? moment(date).format(format) : moment.tz(global.timezone).format(format);
};

module.exports = {
  command: ['menu'],
  alias: ['arch'],
  description: 'Show bot menu command list',
  owner: false,
  group: false,
  botadmin: false,
  admin: false,
  ban: true,
  gcban: true,

  execute: async (m, { ednut, commands, text }) => {
    const menutype = global.menutype || '1';
    const disabledCommands = Array.isArray(global.db.disabled) ? global.db.disabled.map(v => v.toLowerCase()) : [];

    const inputCategory = text?.trim()?.split(" ")[0]?.toLowerCase();

    let totalEnabledCommands = 0;
    const categories = {
      Info: [], Fun: [], Ai: [], Group: [], Owner: [], Other: [], Logo: [],
      Search: [], Converter: [], Maker: [], Game: [], Tool: [], Downloader: [],
      Wa: [], External: [], Nsfw: [], Settings: []
    };

    commands.forEach(cmd => {
      const category = cmd.category || "Info";
      const cmds = Array.isArray(cmd.command) ? cmd.command : [cmd.command];
      const isDisabled = cmds.some(c => disabledCommands.includes(c.toLowerCase()));

      if (categories[category] && !isDisabled) {
        cmds.forEach(c => categories[category].push(c));
        totalEnabledCommands += cmds.length;
      }
    });

    const allCategoryKeys = Object.keys(categories);
    const selectedCategories = inputCategory
      ? allCategoryKeys.filter(cat => cat.toLowerCase() === inputCategory)
      : allCategoryKeys;

    const categoryHasCommand = selectedCategories.some(cat => categories[cat].length > 0);
    if (inputCategory && (!selectedCategories.length || !categoryHasCommand)) return;

    const userName = m.pushName || "User";
    const memoryUsed = formatp(os.totalmem() - os.freemem());
    const uptime = run(process.uptime());
    const currentTime = getTime();

    let archmenu = `┏《 ${global.botname} 》━━━
♞ User: ${userName}
♞ Ping: ${Date.now() - m.messageTimestamp * 1000} Ms
♞ Time: ${currentTime}
♞ Date: ${welDate}
♞ Cmd: ${totalEnabledCommands}
♞ Memory: ${memoryUsed}
♞ Runtime: ${uptime}
┗━━━━━━━━━━━━━━\n\n`;

    selectedCategories.forEach(category => {
      if (categories[category].length > 0) {
        archmenu += `┏━《 ${category.toUpperCase()} 》━━\n`;
        const uniqueCmds = [...new Set(categories[category])].sort();
        uniqueCmds.forEach(cmd => {
          archmenu += `┃ ${global.simbol} ${cmd}\n`;
        });
        archmenu += `┗━━━━━━━━━━━━━━━\n`;
      }
    });

    let thumb = global.thumb;
    if (thumb.includes(',')) {
      const thumbs = thumb.split(',').map(x => x.trim());
      thumb = thumbs[Math.floor(Math.random() * thumbs.length)];
    }

    if (menutype === '1') {
      await ednut.sendMessage(m.chat, { text: archmenu }, { quoted: m });
    } else if (menutype === '3') {
      await ednut.sendMessage(m.chat, {
        image: { url: thumb },
        caption: archmenu,
        contextInfo: {
          externalAdReply: {
            showAdAttribution: false,
            title: global.botname,
            body: "GoodnessTech",
            thumbnailUrl: thumb,
            sourceUrl: "https://github.com/GoodnessObilom",
            mediaType: 1,
            renderLargerThumbnail: false
          }
        }
      }, { quoted: m });
    } else if (menutype === '2') {
      await ednut.sendMessage(m.chat, {
        image: { url: thumb },
        caption: archmenu
      }, { quoted: m });
    }
  }
};