const H = require('highland');
const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');

const bcrypt = require('bcrypt');
const saltRounds = 8;
const client = redis.createClient();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/register', (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	const name = req.body.name;
	bcrypt.hash(password, saltRounds, (err, hash) => {
		client.set(`lurre:account:${email}`, JSON.stringify({ hash, name }), (err) => {
			res.json({ success: !!!err });
		});
	});
});

app.post('/login', (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	client.get(`lurre:account:${email}`, (err, value) => {
		if(!value) {
			res.json({ success: false });
			return;
		}
		const parsed = JSON.parse(value);
		bcrypt.compare(password, parsed.hash, (err, success) => {
			res.json({ success });
		});
	});
});

app.get('/details', (req, res) => {
	const email = req.query.email;
	client.get(`lurre:account:${email}`, (err, value) => {
		const parsed = JSON.parse(value);
		if(value) {
			parsed.hash = undefined;
		}
		res.json(parsed);
	});
});

module.exports = app;