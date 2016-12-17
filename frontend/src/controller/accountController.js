const Cookies = require('cookies');
const encoder = require('../util/encoder');
const request = require('request');

module.exports = {
	signin: (req, res) => {
		res.render('page/account/signin');
	},
	signup: (req, res) => {
		res.render('page/account/signup', { css: 'account' });
	},
	login: (req, res) => {
		const email = req.body.email;
		const password = req.body.password;
		const cookies = new Cookies(req, res);
		request.post({url: `http://localhost:8080/login`, form: { email, password }, json: true}, (err, body, data) => {
			if(data.success) {
				const cookies = new Cookies(req, res);
				cookies.set('session', encoder.encode(email));
				res.redirect('/');
			} else {
				res.render('page/account/signin', { css: 'account', success: false });
			}
		});
	},
	logout: (req, res) => {
		res.clearCookie('session');
		res.redirect('/');
	},
	create: (req, res) => {
		const email = req.body.email;
		const password = req.body.password;
		const name = req.body.name;
		request.post({url: `http://localhost:8080/register`, form: { email, password, name }, json: true}, (err) => {
			const cookies = new Cookies(req, res);
			cookies.set('session', encoder.encode(email));
			res.redirect('/');
		});
	}
};