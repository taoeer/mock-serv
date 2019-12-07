const program = require('commander');
const pkg = require('./package.json');

program
  .version(pkg.version)
  .option('-c, --config <config>', 'Specified the config file!')
  .option('-p, --port <port>', 'Specified the server port!')
  .option('-a, --all', 'Response all request width status 200!')
  .option('-t, --target <string>', 'proxy 404 to url!')
  .parse(process.argv);

  module.exports = program;
