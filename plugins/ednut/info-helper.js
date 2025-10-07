module.exports = [
  {
    command: ["list"],
    description: "List all available commands",
    category: "Info",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, commands, fontx }) => {
      let list = [];
      commands.forEach((cmd) => {
        if (cmd.command && cmd.description) {
          list.push(`• ${cmd.command[0].charAt(0).toUpperCase() + cmd.command[0].slice(1)}\n${cmd.description}`);
        }
      });
      let text = list.join("\n\n");
      ednut.sendMessage(m.chat, { text: fontx(text) }, { quoted: m });
    }
  },
  {
  command: ["help"],
  description: "Show info about a specific command",
  category: "Info",
  ban: true,
  gcban: true,
  execute: async (m, { ednut, commands, fontx, text }) => {
    if (!text || text.toLowerCase() === "menu") {
      let list = [];
      commands.forEach((cmd) => {
        if (cmd.command && cmd.description) {
          let alias = cmd.alias ? `${cmd.alias.join(", ")}\n` : "No hidden name found\n";
          list.push(`*Command:* ${cmd.command[0]}\n*Hidden:* ${alias}*Category:* ${cmd.category}\n*Description:* ${cmd.description}\n\n`);
        }
      });
      let info = list.join("");
      ednut.sendMessage(m.chat, { text: info }, { quoted: m });
    } else {
      let cmd = commands.find((c) => c.command.includes(text.toLowerCase()) || (c.alias && c.alias.includes(text.toLowerCase())));
      if (!cmd) return m.reply(`Command ${text} not found`);
      let alias = cmd.alias ? `${cmd.alias.join(", ")}\n` : "No alias found\n";
      let info = `*Command:* ${cmd.command[0]}\n*Hidden:* ${alias}*Category:* ${cmd.category}\n*Description:* ${cmd.description}`;
      ednut.sendMessage(m.chat, { text: info }, { quoted: m });
    }
  }
}
]