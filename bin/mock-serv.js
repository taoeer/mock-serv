#! node
const path = require('path');
const chokidar = require('chokidar');
const { spawn } = require('child_process');

let server = null;

const startServer = () => {
  server = spawn('node', [path.resolve(__dirname, '../index.js')]);

  server.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  
  server.stderr.on('data', (data) => {
    console.error(`错误：${data}`);
  });
  
  server.on('close', (code) => {
    console.log(`子进程退出码：${code}`);
  });
}

startServer();

chokidar.watch('.').on('change', (path) => {
  server.kill();
  console.log('文件变化，正在重启服务器！！！！');
  process.nextTick(() => {
    startServer();
  });
});