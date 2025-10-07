const fetch = require("node-fetch");
const { execSync } = require("child_process");
const fs = require('fs');
const path = require('path');
const axios = require('axios'); // Required for downloading the file as a stream

// --- CONFIGURATION ---
const BOT_DIR = process.cwd();
const GIT_REPO = "TristanCage/Arch-md";
const TEMP_TAR_PATH = path.join(BOT_DIR, 'update_temp.tar.gz');
const VERSION_FILE = path.join(BOT_DIR, 'version.json'); // File to track local commit hash

// Files/folders to SAVE and RESTORE
const PRESERVED_ITEMS = [
    'config.js',
    'tmp/session',
    // Add any other files you customize or need to keep here
];
// ---------------------

function readLocalVersion() {
    try {
        if (fs.existsSync(VERSION_FILE)) {
            return JSON.parse(fs.readFileSync(VERSION_FILE, 'utf-8')).sha || '';
        }
    } catch (e) {}
    return '';
}

function writeLocalVersion(sha) {
    try {
        fs.writeFileSync(VERSION_FILE, JSON.stringify({ sha: sha }, null, 2));
    } catch (e) {
        console.error("Failed to write version file:", e);
    }
}

module.exports = [
    {
        command: ["update"],
        description: "🔄 Update the bot from GitHub (Download/Extract Method)",
        category: "Other",
        owner: true,
        async execute(m) {
            const HEROKU_API_KEY = process.env.HEROKU_API_KEY;
            const HEROKU_APP_NAME = process.env.HEROKU_APP_NAME;

            try {
                await m.reply("📦 Checking GitHub for updates...");

                // 1. GET LATEST COMMIT SHA
                const gh = await fetch(`https://api.github.com/repos/${GIT_REPO}/commits/main`);
                if (!gh.ok) throw new Error("GitHub API failed or repo not found.");
                const latestSHA = (await gh.json()).sha;

                // --- HEROKU LOGIC (KEEP AS IS) ---
                if (HEROKU_API_KEY && HEROKU_APP_NAME) {
                    // ... (Your existing Heroku logic remains here)
                    // ...
                    // If running on Heroku, your existing Heroku rebuild logic is generally fine.
                    // If that section of code is failing, it's due to ENV variables, not Git.
                    // For brevity, the Heroku rebuild code is omitted, but keep your original.
                    return m.reply("Heroku update logic triggered.");
                }
                // --- END HEROKU LOGIC ---

                // --- PANEL / VPS / LOCAL LOGIC (REWRITTEN) ---
                const localCommit = readLocalVersion();

                if (localCommit === latestSHA) {
                    return m.reply("✅ Bot is already up to date.");
                }

                await m.reply("🚀 New update found! Downloading and installing...");
                
                // 2. PRESERVE CRITICAL FILES
                const tempDir = path.join(BOT_DIR, 'update_temp_backup');
                if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

                for (const item of PRESERVED_ITEMS) {
                    const src = path.join(BOT_DIR, item);
                    const dest = path.join(tempDir, item);
                    if (fs.existsSync(src)) {
                        fs.renameSync(src, dest);
                    }
                }
                writeLocalVersion(localCommit); // Save old version to restore if update fails

                // 3. DOWNLOAD TARBALL
                const writer = fs.createWriteStream(TEMP_TAR_PATH);
                const response = await axios({
                    url: `https://github.com/${GIT_REPO}/archive/${latestSHA}.tar.gz`, // Use SHA to ensure specific version
                    method: 'GET',
                    responseType: 'stream',
                });
                response.data.pipe(writer);

                await new Promise((resolve, reject) => {
                    writer.on('finish', resolve);
                    writer.on('error', reject);
                });
                
                // 4. EXTRACT CODE (Using tar, standard on most Linux hosts)
                await m.reply("Extracting new files...");
                const repoFolderName = `${GIT_REPO.split('/')[1]}-${latestSHA}`;
                
                // Extract into a temporary folder first to avoid conflicts
                execSync(`mkdir -p ${path.join(tempDir, 'repo')}`);
                execSync(`tar -xzf ${TEMP_TAR_PATH} -C ${path.join(tempDir, 'repo')} --strip-components=1`);
                
                // Copy new files over old files
                execSync(`cp -r ${path.join(tempDir, 'repo')}/. ${BOT_DIR}`);

                // 5. RESTORE CRITICAL FILES
                for (const item of PRESERVED_ITEMS) {
                    const src = path.join(tempDir, item);
                    const dest = path.join(BOT_DIR, item);
                    if (fs.existsSync(src)) {
                        fs.renameSync(src, dest);
                    }
                }

                // 6. CLEAN UP
                fs.unlinkSync(TEMP_TAR_PATH);
                fs.rmSync(tempDir, { recursive: true, force: true });
                writeLocalVersion(latestSHA); // Update local version tracker

                await m.reply("✅ Update successful. Restarting bot...");
                
                // 7. RESTART
                process.exit(1);

            } catch (err) {
                global.log("ERROR", `Update failed: ${err.message || err}`);
                
                // Attempt to restore preserved files on failure
                const tempDir = path.join(BOT_DIR, 'update_temp_backup');
                for (const item of PRESERVED_ITEMS) {
                    const src = path.join(tempDir, item);
                    const dest = path.join(BOT_DIR, item);
                    if (fs.existsSync(src)) {
                        try { fs.renameSync(src, dest); } catch {}
                    }
                }
                if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });


                m.reply("❌ Auto-update failed.\n*Error:* Check console logs or update manually.");
            }
        },
    },
];