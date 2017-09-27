const nconf = require('nconf');

nconf.argv().env();
nconf.file({ file: 'config.json' });

module.exports = nconf;
