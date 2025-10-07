module.exports = [
  {
    command: ["antilink"],
    description: "Manage anti-link feature in a group (kick, delete, warn, off)",
    category: "Group",
    owner: false,
  group: true,
  botadmin: true,
  admin: true,
  ban: true,
  gcban: true,
    execute: async (m, { ednut, isAdmins, isOwner, isBotAdmins, text, msg, example }) => {
      if (!text) return m.reply(example("<kick/delete/warn> or antilink off"));

      const action = text.trim().toLowerCase();
      const groupData = global.db.groups[m.chat];

      switch (action) {
        case "kick":
          if (groupData.antilink) return m.reply("Already activated in this group");
          groupData.antilink = true;
          groupData.antilink2 = false;
          groupData.antilink3 = false;
          await m.reply("Successfully activated anti-link to *kick* any link sender.");
          break;

        case "delete":
          if (groupData.antilink2) return m.reply("Already activated in this group");
          groupData.antilink2 = true;
          groupData.antilink = false;
          groupData.antilink3 = false;
          await m.reply("Successfully activated anti-link to *delete* any sent link.");
          break;

        case "warn":
          if (groupData.antilink3) return m.reply("Already activated in this group");
          groupData.antilink3 = true;
          groupData.antilink2 = false;
          groupData.antilink = false;
          await m.reply("Successfully activated anti-link to *warn and delete* any sent link.");
          break;

        case "off":
          groupData.antilink = false;
          groupData.antilink2 = false;
          groupData.antilink3 = false;
          await m.reply("Successfully deactivated anti-link feature in this group.");
          break;

        default:
          m.reply("Invalid action. Available actions: kick / delete / warn / off.");
      }
    }
  },
];