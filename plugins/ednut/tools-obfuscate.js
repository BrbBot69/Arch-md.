const fs = require('fs');
const { obfuscateJS } = require("../Core/encapsulation.js");

module.exports = [
  {
    command: ["obfuscate"],
    alias: ["obfs", "obfuscatejs"],
    description: "Obfuscate a JavaScript file to protect its code.",
    category: "Tool",
    ban: true,
    gcban: true,
    execute: async (m, { ednut, isOwner, command, isCmd, example, quoted, text, args, reply2, reply4, botNumber, pushname, isGroup, isAdmins, isBotAdmins, prefix, axios, pickRandom, runtime, getQuote, uploadImage, LoadDataBase, openai, tiktokDl, igdl, api, yts, pinterest, fontx, mime, fs, exec, getRandom }) => {
        // Check if a file was quoted and if it's a .js file.
        if (!quoted || mime !== "application/javascript") {
            return m.reply("❌ *Error:* Reply to a `.js` file with this command.");
        }

        try {
            // Download the quoted .js file.
            const media = await quoted.download();
            const tempFile = `./tmp/original-${Date.now()}.js`;
            await fs.promises.writeFile(tempFile, media);

            // Send a message to the user that the obfuscation is starting.
            await ednut.sendMessage(m.chat, { text: "🔒 Obfuscation started..." }, { quoted: m });

            // Call the obfuscateJS function from your Core library.
            const obfuscatedFile = await obfuscateJS(tempFile);

            // Send a message that the process is complete.
            await ednut.sendMessage(m.chat, { text: "✅ Obfuscation complete! Sending file..." }, { quoted: m }); 

            // Send the new, obfuscated file as a document.
            await ednut.sendMessage(m.chat, { document: fs.readFileSync(obfuscatedFile), mimetype: "text/javascript", fileName: "obfuscated.js" }, { quoted: m });

            // Clean up the temporary files to save space.
            await fs.promises.unlink(tempFile);
            await fs.promises.unlink(obfuscatedFile);

        } catch (error) {
            // If any error occurs, send an error message to the user.
            await ednut.sendMessage(m.chat, { text: `❌ *Error:* ${error.message}` }, { quoted: m });
        } 
    }
  }
];