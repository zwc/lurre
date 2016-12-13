const H = require('highland');
const express = require('express');
const redis = require('redis');
const uuid = require('uuid');
const client = redis.createClient();
const app = express();

app.get('/driver', (req, res) => {
	const email = req.query.email;
	const spots = req.query.spots; // number of seats in your car
	const destination = req.query.destination;
	const guid = uuid.v4();
	client.set(`lurre:driver:${guid}`, JSON.stringify({email, spots, destination}), (err) => {
		res.json({ success: !!!err });
	});
});

const keys = H.wrapCallback((str, callback) => client.keys(str, callback));
const get = H.wrapCallback((key, callback) => client.get(key, callback));

const getDriver = (key) => {
	return H([key])
		.flatMap(get)
		.map(JSON.parse)
		.map(data => {
			const guid = key.split(':').pop();
			return {[guid]: data};
		});
};

const getPassengers = (driver) => {
	const guid = Object.keys(driver).pop();
	return H([`lurre:passenger:${guid}:*`])
		.flatMap(keys)
		.map(hits => {
			driver.passengers = hits.map(h => h.split(':').pop());
			return driver;
		});
};

app.get('/list', (req, res) => {
	H([`lurre:driver:*`])
		.flatMap(keys)
		.flatMap(H)
		.flatMap(getDriver)
		.flatMap(getPassengers)
		.collect()
		.apply(result => {
			res.json(result);
		});
});

app.get('/passenger', (req, res) => {
	const email = req.query.email;
	const guid = req.query.guid;
	client.keys(`lurre:passenger:${guid}:*`, (err, keys) => {
		client.get(`lurre:driver:${guid}`, (err, data) => {
			const parsed = JSON.parse(data);
			if(keys.length < parsed.spots) {
				const ts = Date.now();
				client.set(`lurre:passenger:${guid}:${email}`, ts, (err) => {
					res.json('sign me up!');
				});
			} else {
				res.json('no spots left');
			}
		});
	});
});

const port = process.env.PORT || 8081;
app.listen(port, () => {
	console.log(`share is up @ ${port}`);
});