const path = require('path');
const LDEM = require('./index');
const objectAssignDeep = require('object-assign-deep');
const argv = require('minimist')(process.argv.slice(2));
const defaultConfig = require('./config.json');

const CWD = process.cwd();

let config;

if (argv.c) {
  const CUSTOM_CONFIG_PATH = path.join(CWD, argv.c);
  const customConfig = require(CUSTOM_CONFIG_PATH);
  config = objectAssignDeep({}, defaultConfig, customConfig);
} else {
  config = defaultConfig;
}

new LDEM({
  config
});
