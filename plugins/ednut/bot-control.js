module.exports = [
  {
    command: ["delete"],
    description: "Enable or disable message deletion protection",
    category: "Settings",
    ban: true,
    gcban: true,
    owner: true,
    execute: async (m, { args, isOwner, msg, isGroup }) => {
      const input = args[0]?.toLowerCase();
      const isEnabled = global.db.settings.antidelete ?? false;

      if (input === "on") {
        if (isEnabled) return m.reply("_Antidelete is already enabled._");
        global.db.settings.antidelete = true;
        return m.reply("_Antidelete has been enabled._");
      }

      if (input === "off") {
        if (!isEnabled) return m.reply("_Antidelete is already disabled._");
        global.db.settings.antidelete = false;
        return m.reply("_Antidelete has been disabled._");
      }

      return m.reply("Usage: antidelete on/off");
    }
  },

  {
    command: ["call"],
    description: "Control how the bot handles incoming calls",
    category: "Settings",
    ban: true,
    gcban: true,
    owner: true,
    execute: async (m, { text, isOwner, msg, isGroup }) => {
      const action = text?.toLowerCase();
      const { anticall, anticall2 } = global.db.settings;

      if (!action) {
        return m.reply("Usage: anticall <reject/block/off>");
      }

      if (action === "reject") {
        if (anticall) return m.reply("_Call rejection is already enabled._");
        global.db.settings.anticall = true;
        global.db.settings.anticall2 = false;
        return m.reply("_Call rejection has been enabled._");
      }

      if (action === "block") {
        if (anticall2) return m.reply("_Call blocking is already enabled._");
        global.db.settings.anticall2 = true;
        global.db.settings.anticall = false;
        return m.reply("_Call blocking has been enabled._");
      }

      if (action === "off") {
        if (!anticall && !anticall2) return m.reply("_Anticall is already turned off._");
        global.db.settings.anticall = false;
        global.db.settings.anticall2 = false;
        return m.reply("_Anticall has been turned off._");
      }

      return m.reply("Invalid action. Use: reject, block, or off.");
    }
  }
];