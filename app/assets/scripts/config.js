'use strict';
import { defaultsDeep } from 'lodash';
/*
 * App configuration.
 *
 * Uses settings in config/production.js, with any properties set by
 * config/uat.js or config/local.js overriding them depending upon the
 * environment.
 *
 * This file should not be modified.  Instead, modify one of:
 *
 *  - config/production.js
 *      Production settings (base).
 *  - config/uat.js
 *      Overrides to production if ENV (DS_ENV) is UAT.
 *  - config/local.js
 *      Overrides if local.js exists.
 *      This last file is gitignored, so you can safely change it without
 *      polluting the repo.
 */

var configurations = require('./config/*.js', { mode: 'hash' });
var env = process.env.DS_ENV;

var config = { env: env };
if (env === 'local') {
  defaultsDeep(config, configurations.local);
} else if (env === 'uat') {
  defaultsDeep(config, configurations.uat, configurations.local);
} else if (env === 'production') {
  defaultsDeep(config, configurations.production, configurations.local);
} else {
  console.log(`Cant find Configuration for environment ${env}`)
  throw `Cant find Configuration for environment ${env}`;
}

module.exports = config;
