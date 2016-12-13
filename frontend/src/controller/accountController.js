const Cookies = require('cookies');
const encoder = require('../util/encoder');

module.exports = {
	signin: (req, res) => {
		res.render('page/account/sigin');
	},
	signup: (req, res) => {
		res.render('page/account/signup', { css: 'account' });
	},
	login: (req, res) => {
		const email = req.body.email;
		const cookies = new Cookies(req, res);
		cookies.set('session', encoder.encode(email));
		res.redirect('/');
	},
	logout: (req, res) => {
		res.clearCookie('session');
		res.redirect('/');
	},
	create: (req, res) => {
		const email = req.body.email;
		const password = req.body.password;
		const cookies = new Cookies(req, res);
		cookies.set('session', encoder.encode(email));
		res.redirect('/');
	}
};