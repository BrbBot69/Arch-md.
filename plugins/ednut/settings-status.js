module.exports = [
  {
    command: ["astatus"],
    alias: ["autosend"],
    description: "Toggle auto status sender: on/off",
    category: "Settings",
    ban: true,
    gcban: true,
    owner: true,
    execute: async (m, { prefix, isOwner, isGroup, args }) => {
      if (!args[0]) return m.reply(`Example: ${prefix}autosend on/off`);

      const option = args[0].toLowerCase();

      switch (option) {
        case "on":
          if (global.db.settings.send) return m.reply("Autosend is already enabled.");
          global.db.settings.send = true;
          m.reply("Autosend turned *ON* successfully.");
          break;

        case "off":
          if (!global.db.settings.send) return m.reply("Autosend is already disabled.");
          global.db.settings.send = false;
          m.reply("Autosend turned *OFF* successfully.");
          break;

        default:
          m.reply("Invalid option! Use one of: on/off");
      }
    },
  }
];
