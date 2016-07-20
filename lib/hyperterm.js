const fs = require('fs')
const { resolve } = require('path')
const { homedir } = require('os')

CONFIG_PATH = resolve(homedir(), '.hyperterm.js')
PLUGINS_PATH = resolve(homedir(), '.hyperterm_plugins', 'package.json')
PACKAGE_JSON_PATH = resolve(PLUGINS_PATH, 'package.json')

function loadConfig() {
  return require(CONFIG_PATH)
}

function saveConfig(json) {
  let configJSON = JSON.stringify(json, null, '  ')
  let configData = 'module.exports = ' + configJSON + ';'
  fs.writeFileSync(CONFIG_PATH, configData)
}

function addPlugin(name) {
  let config = loadConfig()
  if (config.plugins.includes(name)) return null
  config.plugins.push(name)
  saveConfig(config)
}

function removePlugin(name) {
  let config = loadConfig()
  config.plugins = config.plugins.filter((val) => {
    return val !== name
  })
  saveConfig(config)
}

module.exports = {
  loadConfig: loadConfig,
  saveConfig: saveConfig,
  addPlugin: addPlugin,
  removePlugin: removePlugin
}
