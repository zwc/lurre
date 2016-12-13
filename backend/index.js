const H = require('highland');
const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const uuid = require('uuid');
const client = redis.createClient();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/driver', (req, res) => {
	const email = req.query.email;
	const spots = req.query.spots; // number of seats in your car
	const destination = req.query.destination;
	const guid = uuid.v4();
	client.set(`lurre:driver:${guid}`, JSON.stringify({email, spots, destination}), (err) => {
		res.json({ success: !!!err });
	});
});

app.post('/place/create', (req, res) => {
	const email = req.body.email;
	const name = req.body.name;
	const spots = req.body.description;
	const type = req.body.type;
	const guid = uuid.v4();
	client.set(`lurre:place:${email}:${guid}`, JSON.stringify({name, spots, type}), (err) => {
		res.json({ success: !!!err });
	});
});

app.post('/time/create', (req, res) => {
	const email = req.body.email;
	const time = req.body.time;
	const guid = uuid.v4();
	client.set(`lurre:time:${email}:${guid}`, JSON.stringify({time}), (err) => {
		res.json({ success: !!!err });
	});
});

app.post('/car/create', (req, res) => {
	const email = req.body.email;
	const name = req.body.name;
	const seatsForward = req.body.seatsForward;
	const seatsBack = req.body.seatsBack;
	const guid = uuid.v4();
	client.set(`lurre:car:${email}:${guid}`, JSON.stringify({name, seatsForward, seatsBack}), (err) => {
		res.json({ success: !!!err });
	});
});

app.get('/car/list', (req, res) => {
	const email = req.query.email;
	H([`lurre:car:${email}:*`])
		.flatMap(keys)
		.flatMap(H)
		.flatMap(getAsArray)
		.collect()
		.apply(result => {
			res.json(result);
		});
});

app.get('/time/list', (req, res) => {
	const email = req.query.email;
	H([`lurre:time:${email}:*`])
		.flatMap(keys)
		.flatMap(H)
		.flatMap(getAsArray)
		.collect()
		.apply(result => {
			res.json(result);
		});
});

app.get('/place/list', (req, res) => {
	const email = req.query.email;
	H([`lurre:place:${email}:*`])
		.flatMap(keys)
		.flatMap(H)
		.flatMap(getAsArray)
		.collect()
		.apply(result => {
			res.json(result);
		});
});

const keys = H.wrapCallback((str, callback) => client.keys(str, callback));
const get = H.wrapCallback((key, callback) => client.get(key, callback));

const getByKey = (key) => {
	return H([key])
		.flatMap(get)
		.map(JSON.parse)
		.map(data => {
			const guid = key.split(':').pop();
			return {[guid]: data};
		});
};

const getAsArray = (key) => {
	return H([key])
		.flatMap(get)
		.map(JSON.parse)
		.map(data => {
			const guid = key.split(':').pop();
			data.guid = guid;
			return data;
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
		.flatMap(getByKey)
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