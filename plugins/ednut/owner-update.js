const fetch = require("node-fetch");

module.exports = [
  {
    command: ["update"],
    description: "🔄 Update the bot from GitHub",
    category: "Other",
    owner: true,
    async execute(m) {
      const GIT_REPO = "GoodnessObilom/Arch-md";
      const HEROKU_API_KEY = process.env.HEROKU_API_KEY;
      const HEROKU_APP_NAME = process.env.HEROKU_APP_NAME;

      try {
        await m.reply("📦 Checking GitHub for updates...");

        const gh = await fetch(`https://api.github.com/repos/${GIT_REPO}/commits/main`);
        if (!gh.ok) throw new Error("GitHub API failed");
        const latestSHA = (await gh.json()).sha;

        if (HEROKU_API_KEY && HEROKU_APP_NAME) {
          const hres = await fetch(`https://api.heroku.com/apps/${HEROKU_APP_NAME}/releases`, {
            headers: {
              Accept: "application/vnd.heroku+json; version=3",
              Authorization: `Bearer ${HEROKU_API_KEY}`,
            },
          });

          const releases = await hres.json();
          const latestRelease = releases.reverse().find(r => r.source_blob);
          const deployedSHA = latestRelease?.source_blob?.version || "";

          if (deployedSHA.includes(latestSHA)) {
            return m.reply("✅ Heroku bot is already up to date with GitHub.");
          }

          await m.reply("🚀 New update found!\nTriggering Heroku rebuild...");

          const build = await fetch(`https://api.heroku.com/apps/${HEROKU_APP_NAME}/builds`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/vnd.heroku+json; version=3",
              Authorization: `Bearer ${HEROKU_API_KEY}`,
            },
            body: JSON.stringify({
              source_blob: {
                url: `https://github.com/${GIT_REPO}.tar.gz`,
              },
            }),
          });

          if (!build.ok) {
            const errTxt = await build.text();
            throw new Error(`Heroku Build Error:\n${errTxt}`);
          }

          return await m.reply("✅ Update started. Wait 1–2 minutes for Heroku to rebuild.");
        }

        // Panel / VPS / Local
        const { execSync } = require("child_process");

        const localCommit = execSync("git rev-parse HEAD").toString().trim();
        const remoteCommit = latestSHA;

        if (localCommit === remoteCommit) {
          return m.reply("✅ Bot is already up to date.");
        }

        execSync("git pull");
        await m.reply("✅ Update pulled from GitHub.\n♻️ Restarting bot...");
        process.exit(1);

      } catch (err) {
        global.log("ERROR", `Update failed: ${err.message || err}`);
        m.reply("❌ Update failed.\nCheck GitHub/Heroku logs or update manually.");
      }
    },
  },
];