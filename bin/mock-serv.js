#! node
const path = require('path');
const chokidar = require('chokidar');
const { spawn } = require('child_process');

const program = require('../commander');
let server = null;

const startServer = () => {
  server = spawn('node', [path.resolve(__dirname, '../index.js'), ...process.argv.slice(2)]);

  server.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  server.stderr.on('data', (data) => {
    console.error(data.toString());
    process.exit();
  });
}

startServer();

chokidar.watch(path.resolve(process.cwd(), program.config || 'config.js')).on('change', (path) => {
  server.kill();
  console.log('File changed, restarting server ..........');
  process.nextTick(() => {
    startServer();
  });
});
