const moment = require("moment-timezone");

const handledGroupEvents = new Set();

module.exports = function groupParticipantsUpdate(ednut) {
  ednut.ev.removeAllListeners("group-participants.update");

  ednut.ev.on("group-participants.update", async (anu) => {
    try {
      const groupId = anu.id;
      const eventKey = `${groupId}-${anu.action}-${anu.participants?.join(",")}`;

      if (handledGroupEvents.has(eventKey)) return;
      handledGroupEvents.add(eventKey);
      setTimeout(() => handledGroupEvents.delete(eventKey), 10000);

      await new Promise(res => setTimeout(res, 200)); // prevent rate-limit
      const metadata = await ednut.groupMetadata(groupId);

      const name = metadata.subject;
      const desc = metadata.desc || 'No description.';
      const date = moment().tz("Africa/Lagos").format("DD/MM/YYYY");
      const time = moment().tz("Africa/Lagos").format("HH:mm:ss");
      const count = metadata.participants.length;

      const welcomeEnabled = global.db.groups?.[groupId]?.welcome || process.env.WELCOME === "true";
      const goodbyeEnabled = global.db.groups?.[groupId]?.goodbye || process.env.GOODBYE === "true";

      for (const jid of anu.participants) {
        const username = jid.split("@")[0];
        let pp = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
        try {
          pp = await ednut.profilePictureUrl(jid, 'image');
        } catch {}

        const replaceVars = (template) => template
          .replace(/@user/gi, `@${username}`)
          .replace(/@group/gi, name)
          .replace(/@desc/gi, desc)
          .replace(/@date/gi, date)
          .replace(/@time/gi, time)
          .replace(/@count/gi, count.toString());

        if (anu.action === "add" && welcomeEnabled) {
          const tmpl = global.db.groups?.[groupId]?.setwelcome || process.env.WELCOME_MSG || `👋 Hello @user, welcome to *@group*\n@desc`;
          const msg = replaceVars(tmpl);
          const hasPP = tmpl.includes("@pp");

          await ednut.sendMessage(groupId, hasPP
            ? { image: { url: pp }, caption: msg, mentions: [jid] }
            : { text: msg, mentions: [jid] });
        }

        if (anu.action === "remove" && goodbyeEnabled) {
          const tmpl = global.db.groups?.[groupId]?.setgoodbye || process.env.GOODBYE_MSG || `👋 @user left *@group*`;
          const msg = replaceVars(tmpl);
          const hasPP = tmpl.includes("@pp");

          await ednut.sendMessage(groupId, hasPP
            ? { image: { url: pp }, caption: msg, mentions: [jid] }
            : { text: msg, mentions: [jid] });
        }

        if (global.db.groups?.[groupId]?.events) {
          const author = anu.author?.split("@")[0] || "unknown";

          if (anu.action === "promote") {
            await ednut.sendMessage(groupId, {
              text: `@${username} was promoted by @${author}`,
              mentions: [jid, anu.author]
            });
          } else if (anu.action === "demote") {
            await ednut.sendMessage(groupId, {
              text: `@${username} was demoted by @${author}`,
              mentions: [jid, anu.author]
            });
          }
        }
      }

    } catch (err) {
      const msg = String(err?.message || err);
      if (!msg.toLowerCase().includes("rate-overlimit")) {
        log("ERROR", `Group Handler: ${err.stack || msg}`);
      }
    }
  });
};