const fs = require("fs");
const path = require("path");

function loadPluginsFromDisk(dir) {
  const plugins = [];

  try {
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".js"));
    for (const file of files) {
      try {
        const plugin = require(path.join(dir, file));
        if (Array.isArray(plugin)) plugins.push(...plugin);
        else plugins.push(plugin);
      } catch (err) {
        log("ERROR", `[x] Failed to load plugin: ${file} — ${err.message}`);
      }
    }
  } catch (e) {
    log("ERROR", `[x] Failed to scan plugin directory: ${e.message}`);
  }

  return plugins;
}

function loadPluginsFromDb(db) {
  const plugins = [];

  if (db?.plugins && typeof db.plugins === "object") {
    for (const [filename, code] of Object.entries(db.plugins)) {
      try {
        const plugin = eval(code);
        if (Array.isArray(plugin)) plugins.push(...plugin);
        else plugins.push(plugin);
      } catch (err) {
        log("ERROR", `[x] Failed to load DB plugin: ${filename} — ${err.message}`);
      }
    }
  }

  return plugins;
}

function pluginLoader(pluginPath, db) {
  const diskPlugins = loadPluginsFromDisk(pluginPath);
  const dbPlugins = loadPluginsFromDb(db);
  return [...diskPlugins, ...dbPlugins];
}

module.exports = pluginLoader;