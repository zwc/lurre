'use strict';
const express = require('express');
const exphbs = require('express-handlebars');
const expressApp = express();
const bodyParser = require('body-parser');
const compress = require('compression');
const moment = require('moment');
moment.locale('sv');
const session = require('./middleware/session');

expressApp.disable('x-powered-by');
expressApp.use(express.static('public'));
expressApp.use(compress());
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(session);

const hbs = exphbs.create({
	defaultLayout: 'default',
	partialsDir: [
		__dirname + '/../views/partials'
	],
	helpers: {
		inc: (value) => {
			return parseInt(value) + 1;
		},
		date: (value) => {
			return moment(value).format('YYYY-MM-DD');
		},
		moment: (value) => {
			return moment().to(value);
		},
		ellipsis: (data) => {
			return data.hash.text.substring(0, data.hash.chars || 100) + ' ... ';
		},
		ifCond: (v1, v2, options) => {
			if(v1 === v2) {
				return options.fn(this);
			}
			return options.inverse(this);
		},
		ifExists: (v1, v2, options) => {
			if(v1.find((x) => { return x === v2})) {
				return options.fn(this);
			}
			return options.inverse(this);
		}
	}
});

expressApp.engine('handlebars', hbs.engine);

expressApp.set('view engine', 'handlebars');
expressApp.set('views', __dirname + '/../views');

// add routes
require('./routes.js')(expressApp);

module.exports = expressApp;