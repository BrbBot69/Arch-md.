/**
 * Group Configuration Plugin
 * Controls welcome/goodbye messages and promote/demote notifications in groups.
 * Features:
 * - Enable/disable welcome/goodbye system
 * - Set custom welcome/goodbye messages
 * - Enable promote/demote alerts (pdm)
 * 
 * Template Variables:
 *   @user  → Mention of new/left user
 *   @group → Group name
 *   @desc  → Group description
 *   @date  → Date (DD/MM/YYYY)
 *   @time  → Time (HH:mm:ss)
 */

module.exports = [
  {
    command: ["welcome"],
    description: "Enable or disable welcome messages in a group",
    category: "Group",
    group: true,
    gcban: true,
    ban: true,
    execute: async (m, { isAdmins, isOwner, args, msg }) => {
      if (!(isAdmins || isOwner)) return m.reply(msg.admin);
      if (args.length < 1) return m.reply("Example: .welcome on/off");

      if (args[0] === "on") {
        if (global.db.groups[m.chat].welcome) return m.reply("Already on");
        global.db.groups[m.chat].welcome = true;
        m.reply("_Welcome system activated._");
      } else if (args[0] === "off") {
        if (!global.db.groups[m.chat].welcome) return m.reply("Already off");
        global.db.groups[m.chat].welcome = false;
        m.reply("_Welcome system deactivated._");
      }
    }
  },

  {
    command: ["goodbye"],
    description: "Enable or disable goodbye messages in a group",
    category: "Group",
    group: true,
    gcban: true,
    ban: true,
    execute: async (m, { isAdmins, isOwner, args, msg }) => {
      if (!(isAdmins || isOwner)) return m.reply(msg.admin);
      if (args.length < 1) return m.reply("Example: .goodbye on/off");

      if (args[0] === "on") {
        if (global.db.groups[m.chat].goodbye) return m.reply("Already on");
        global.db.groups[m.chat].goodbye = true;
        m.reply("_Goodbye system activated._");
      } else if (args[0] === "off") {
        if (!global.db.groups[m.chat].goodbye) return m.reply("Already off");
        global.db.groups[m.chat].goodbye = false;
        m.reply("_Goodbye system deactivated._");
      }
    }
  },

  {
    command: ["pdm"],
    description: "Enable or disable promote/demote tag notifications",
    category: "Group",
    group: true,
    gcban: true,
    ban: true,
    execute: async (m, { isAdmins, isOwner, args, msg }) => {
      if (!(isAdmins || isOwner)) return m.reply(msg.admin);
      if (args.length < 1) return m.reply("Example: .pdm on/off");

      if (args[0] === "on") {
        if (global.db.groups[m.chat].events) return m.reply("Already on");
        global.db.groups[m.chat].events = true;
        m.reply("_PDM (promote/demote notifications) enabled._");
      } else if (args[0] === "off") {
        if (!global.db.groups[m.chat].events) return m.reply("Already off");
        global.db.groups[m.chat].events = false;
        m.reply("_PDM disabled._");
      }
    }
  },

  {
    command: ["setwelcome"],
    description: "Set a custom welcome message",
    category: "Group",
    group: true,
    gcban: true,
    ban: true,
    execute: async (m, { isAdmins, isOwner, text, prefix }) => {
      if (!(isAdmins || isOwner)) return m.reply("This command is for admins only.");
      if (!text) return m.reply(`Usage: ${prefix}setwelcome <message>\nExample: Hello @user, welcome to @group!\nTags: @user, @group, @desc, @date, @time`);

      if (!global.db.groups[m.chat]) global.db.groups[m.chat] = {};
      global.db.groups[m.chat].setwelcome = text;
      m.reply("Custom welcome message saved.");
    }
  },

  {
    command: ["setgoodbye"],
    description: "Set a custom goodbye message",
    category: "Group",
    group: true,
    gcban: true,
    ban: true,
    execute: async (m, { isAdmins, isOwner, text, prefix }) => {
      if (!(isAdmins || isOwner)) return m.reply("This command is for admins only.");
      if (!text) return m.reply(`Usage: ${prefix}setgoodbye <message>\nExample: Bye @user! We'll miss you from @group.\nTags: @user, @group, @date, @time`);

      if (!global.db.groups[m.chat]) global.db.groups[m.chat] = {};
      global.db.groups[m.chat].setgoodbye = text;
      m.reply("Custom goodbye message saved.");
    }
  }
];