const path = require('path');
const LDEM = require('ldem');
const objectAssignDeep = require('object-assign-deep');
const argv = require('minimist')(process.argv.slice(2));
const CWD = process.cwd();
const defaultConfig = require('./config.json');

let config;

if (argv.c) {
  const CUSTOM_CONFIG_PATH = path.join(CWD, argv.c);
  try {
    const customConfig = require(CUSTOM_CONFIG_PATH);
    config = objectAssignDeep({}, defaultConfig, customConfig);
  } catch (error) {
    throw new Error(
      `Failed to use config at path ${CUSTOM_CONFIG_PATH} because of error: ${error.message}`
    );
  }
} else {
  config = defaultConfig;
}

new LDEM({
  config
});
