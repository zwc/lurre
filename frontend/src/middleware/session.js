'use strict';
const Cookies = require('cookies');
const encoder = require('../util/encoder');

module.exports = (req, res, next) => {
	const cookies = new Cookies( req, res);
	const session = encoder.decode(cookies.get('session'));
	res.locals.session = session;
	next();
};