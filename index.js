const path = require('path');
const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);
const LDEM = require('ldem');
const objectAssignDeep = require('object-assign-deep');
const argv = require('minimist')(process.argv.slice(2));

const CWD = process.cwd();
const CONFIG_PATH = argv.c ? path.resolve(CWD, argv.c) : path.resolve(__dirname, 'config.json');
const CONFIG_UPDATES_DIR_PATH = argv.u ? path.resolve(CWD, argv.u) : path.resolve(__dirname, 'updates');

let config;

try {
  config = require(CONFIG_PATH);
} catch (error) {
  throw new Error(
    `Failed to use config at path ${CONFIG_PATH} because of error: ${error.message}`
  );
}

(async () => {
  let configUpdates;
  let updateFilePaths = {};

  try {
    let allFiles = await readdir(CONFIG_UPDATES_DIR_PATH);
    let jsonFileRegex = /\.json$/;
    let configUpdateFiles = allFiles.filter(fileName => jsonFileRegex.test(fileName));
    configUpdates = await Promise.all(
      configUpdateFiles.map(async (fileName) => {
        let filePath = path.resolve(CONFIG_UPDATES_DIR_PATH, fileName);
        let content = await readFile(filePath, {encoding: 'utf8'});
        let update = JSON.parse(content);
        updateFilePaths[update.id] = filePath;
        return update;
      })
    );
  } catch (error) {
    throw new Error(
      `Failed to load config updates from the ${
        CONFIG_UPDATES_DIR_PATH
      } directory because of error: ${
        error.message
      }`
    );
  }

  let ldem = new LDEM({
    config,
    configUpdates
  });

  (async () => {
    for await (let {moduleAlias, updates, updatedModuleConfig} of ldem.listener('moduleUpdates')) {
      config.modules[moduleAlias] = updatedModuleConfig;
      try {
        await writeFile(CONFIG_PATH, JSON.stringify(config, ' ', 2));
      } catch (err) {
        ldem.logger.fatal(
          `Failed to write update to config file at path ${CONFIG_PATH} because of error: ${err.message}`
        );
        process.exit(1);
      }
      await Promise.all(
        updates.map(async (update) => {
          let filePath = updateFilePaths[update.id];
          if (filePath) {
            try {
              await unlink(filePath);
            } catch (err) {
              ldem.logger.error(
                `Failed to delete old config update file at path ${filePath} because of error: ${err.message}`
              );
            }
          }
        })
      );
    }
  })();

})();
