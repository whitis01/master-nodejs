/**
 *  The Configuration File - config.js
 *  This file stores the project specific configurations needed to:
 *  1) Connect to databases
 *  2) Use different environments
 *  3) Run project specific scripts
 *  4) and if you call now... much, MUCH, MORE!!
 *
 */

// Container for all the environments.

var environments = {};

// Staging (default) environment.
environments.staging = {
    'httpPort'      : '3000',
    'httpsPort' : '3443',
    'envName'   : 'staging',
    'hashingSecret' : 'Isaac',
};

// Production environment.
environments.production = {
    'httpPort'  : '5001',
    'httpsPort' : '5443',
    'envName'   : 'production',
    'hashingSecret' : 'White',
};

// Determine which environment was passed via a command-line argument.
// Note: this could be smaller, but for extensibility we do it with two checks
var currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : 'staging';

// Figure out if environment exists, otherwise default to staging.
var environmentToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

// Now export the specific environment module, not all of them.
module.exports = environmentToExport;


