const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const program = require('./commander');
const app = express();

let config;
let port = 8001;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

if (program.port) {
  port = program.port;
}
if (program.config) {
  config = require(path.resolve(process.cwd(), program.config));
} else {
  config = require(path.resolve(process.cwd(), 'config.js'));
}

const type = (obj) => {
  return Object.prototype.toString.call(obj);
}

app.use((req, res, next) => {
  req.on('end', () => {
    console.log(`[${req.method}] ${req.url} ${res.statusCode} ${new Date()}`);
  });
  next();
});

Object.keys(config).forEach(key => {
  const keyArray = key.split(' ');
  const method = keyArray[0].toLowerCase();
  const link = keyArray[1];
  const dataType = type(config[key]);

  if (/^[object (Object|Array)]$/.test(dataType)) {
    app[method](link, (req, res) => {
      res.json(config[key]);
    });
  } else if (dataType === '[object Function]') {
    app[method](link, config[key]);
  } else {
    app[method](link, (req, res) => {
      res.end(String(config[key]));
    });
  }
});

if (program.all) {
  app.use((req, res) => {
    res.json({
      success: true
    });
  });
}

app.listen(port, (error) => {
  if (error) {
    throw error;
  }

  console.log(`=====> The mock server is running at port ${port} ...........`);
});
