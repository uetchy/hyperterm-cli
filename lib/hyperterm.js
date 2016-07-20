const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const { resolve } = require('path')
const { homedir } = require('os')

CONFIG_PATH = resolve(homedir(), '.hyperterm.js')
PLUGINS_PATH = resolve(homedir(), '.hyperterm_plugins', 'package.json')
PACKAGE_JSON_PATH = resolve(PLUGINS_PATH, 'package.json')

function installPlugin(name) {
  return new Promise((resolve, reject) => {
    let config = require(CONFIG_PATH)
    if (config.plugins.includes(name)){
      return resolve()
    }
    let last = config.plugins[config.plugins.length-1]
    fs.readFileAsync(CONFIG_PATH, 'utf-8')
      .then((data) => {
        if (last) {
          return data.replace(new RegExp(`["']${last}["']`), `'${last}',\n    '${name}'`)
        }
        return data.replace(/plugins:\s+\[[\s\n]*?\]/, `plugins: ['${name}']`)
      })
      .then((data) => {
        fs.writeFileAsync(CONFIG_PATH, data, 'utf-8')
      })
      .then(() => {
        resolve()
      })
      .catch((err) => {
        reject(err)
      })
  })
}

function uninstallPlugin(name) {
  let config = loadConfig()
  config.plugins = config.plugins.filter((val) => {
    return val !== name
  })
  saveConfig(config)
}

module.exports = {
  loadConfig: loadConfig,
  saveConfig: saveConfig,
  installPlugin: installPlugin,
  uninstallPlugin: uninstallPlugin
}
