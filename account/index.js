const H = require('highland');
const express = require('express');
const redis = require('redis');

const bcrypt = require('bcrypt');
const saltRounds = 8;
const client = redis.createClient();
const app = express();

app.get('/register', (req, res) => {
	const email = req.query.email;
	const password = req.query.password;
	bcrypt.hash(password, saltRounds, (err, hash) => {
		client.set(`lurre:account:${email}`, `${hash}`, (err) => {
			res.json({ success: !!!err });
		});
	});
});

app.get('/login', (req, res) => {
	const email = req.query.email;
	const password = req.query.password;
	client.get(`lurre:account:${email}`, (err, hash) => {
		bcrypt.compare(password, hash, (err, response) => {
			res.json({ success: response });
		});
	});
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`account is up @ ${port}`);
});