const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const { resolve } = require('path')
const { homedir } = require('os')

CONFIG_PATH = resolve(homedir(), '.hyperterm.js')
MODULES_PATH = resolve(homedir(), '.hyperterm_plugins', 'node_modules')

function plugins() {
  let {plugins} = require(CONFIG_PATH)
  let info = plugins.map((plugin) => require(resolve(MODULES_PATH, plugin, 'package.json')))
  return info
}

function writePluginList(plugins) {
  return new Promise((resolve, reject) => {
    let pluginsStr = `plugins: [\n    ${plugins.map((str) => `'${str}'`).join(",\n    ")}\n  ]`

    fs.readFileAsync(CONFIG_PATH, 'utf-8')
      .then((data) => {
        return data.replace(/plugins:\s*\[([\s\S]+?)\]/m, pluginsStr)
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

function installPlugin(name) {
  return new Promise((resolve, reject) => {
    let {plugins} = require(CONFIG_PATH)
    if ( plugins.includes(name) ) {
      return reject("Already installed")
    }
    plugins.push(name)
    writePluginList(plugins).then(() => {
      return resolve()
    })
    .catch((err) => {
      reject(err)
    })
  })
}

function uninstallPlugin(name) {
  return new Promise((resolve, reject) => {
    let {plugins} = require(CONFIG_PATH)
    if ( !plugins.includes(name) ) {
      return reject("Doesn't exist")
    }
    plugins = plugins.filter((val) => val !== name)
    writePluginList(plugins).then(() => {
      return resolve()
    })
    .catch((err) => {
      reject(err)
    })
  })
}

module.exports = {
  plugins: plugins,
  installPlugin: installPlugin,
  uninstallPlugin: uninstallPlugin
}
