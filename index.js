const path = require('path');
const express = require('express');
const program = require('commander');

const pkg = require('./package.json');
const app = express();

program
	.version(pkg.version)
	.option('-c, --config <config>', 'Specified the config file!')
	.option('-p, --port <port>', 'Specified the server port!')
	.parse(process.argv);
	
let config;
let port = 8001;

if (program.port) {
	port = program.port;
}
if (program.config) {
	require(path.resolve(process.cwd(), program.config));
} else {
	config = require(path.resolve(process.cwd(), 'config.js'));
}

const type = (obj) => {
	return Object.prototype.toString.call(obj);
}

app.use((req, res, next) => {
  req.on('end', () => {
    console.log(`[${req.method}] ${new Date()} ${req.url} ${res.statusCode}` );
  });
  next();
});

Object.keys(config).forEach(key => {
	const keyArray = key.split(' ');
	const method = keyArray[0].toLowerCase();
	const link = keyArray[1];
	if (type(config[key]) === '[object Object]') {
		app[method](link, (req, res) => {
			res.json(config[key]);
		});
	} else if (type(config[key]) === '[object Function]') {
		app[method](link, config[key]);
	}
});

app.use((req, res) => {
	res.json({
		success:true
	});
});

app.listen(port, (error) => {
	if (error) {
		throw error;
	}

	console.log(`=====> The mock server is running at ${port} ...........`);
});
