const H = require('highland');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const uuid = require('uuid');
const client = redis.createClient();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const keys = H.wrapCallback((str, callback) => client.keys(str, callback));
const get = H.wrapCallback((key, callback) => client.get(key, callback));

const getKey = (key) => {
	return H([key])
		.flatMap(get)
		.map(JSON.parse)
		.map(data => {
			const type = key.split(':')[1];
			return {[type]: data};
		});
};

app.post('/driver', (req, res) => {
	const email = req.body.email;
	const place = req.body.place;
	const time = req.body.time;
	const car = req.body.car;

	H([
		`lurre:place:${email}:${place}`,
		`lurre:time:${email}:${time}`,
		`lurre:car:${email}:${car}`
	])
		.flatMap(getKey)
		.reduce({}, (iterator, obj) => {
			const key = Object.keys(obj).pop();
			iterator[key] = obj[key];
			return iterator;
		})
		.apply(data => {
			const guid = uuid.v4();
			data.guid = guid;
			client.set(`lurre:driver:${guid}:${email}`, JSON.stringify(data), (err) => {
				res.json({ success: !!!err });
			});
		});
});

app.post('/place/create', (req, res) => {
	const email = req.body.email;
	const name = req.body.name;
	const description = req.body.description;
	const guid = uuid.v4();
	client.set(`lurre:place:${email}:${guid}`, JSON.stringify({name, description }), (err) => {
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
	return H([`lurre:passenger:${driver.guid}:*`])
		.flatMap(keys)
		.flatMap(H)
		.flatMap(getByKey)
		.collect()
		.map(passengers => {
			driver.passengers = passengers;
			return driver;
		});
};

const getByKey = (key) => {
	if(key.length <= 0) {
		return H([]);
	}
	return H([key])
		.flatMap(get)
		.map(JSON.parse);
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

app.post('/passenger', (req, res) => {
	const email = req.body.email;
	const guid = req.body.guid;
	const seat = req.body.seat;
	client.keys(`lurre:passenger:${guid}:*`, (err, keys) => {
		//const parsed = JSON.parse(data);
		const timestamp = Date.now();
		client.set(`lurre:passenger:${guid}:${email}`, JSON.stringify({ guid, email, seat, timestamp }), (err) => {
			res.json({success: true});
		});
	});
});

app.delete('/passenger', (req, res) => {
	const email = req.body.email;
	client.keys(`lurre:passenger:*:${email}`, (err, keys) => {
		const remove = keys.pop();
		if(remove) {
			client.del(remove, (err) => {
				res.json({success: true});
			});
		} else {
			res.json({success: false})
		}
	});
});

const getPassengersByGuid = (guid) => {
	return H([`lurre:passenger:${guid}:*`])
		.flatMap(keys)
		.flatMap(getByKey)
		.collect();
};

app.get('/plan', (req, res) => {
	const email = req.query.email;
	H([
		`lurre:driver:*:${email}`,
		`lurre:passenger:*:${email}`
	])
		.flatMap(keys)
		.flatMap(H)
		.flatMap(getKey)
		.reduce({}, (iterator, obj) => {
			const key = Object.keys(obj).pop();
			iterator[key] = obj[key];
			return iterator;
		})
		.apply(response => {
			const guid = _.get(response, 'driver.guid') || _.get(response, 'passenger.guid');
			getPassengersByGuid(guid)
				.apply(passengers => {
					response.passengers = passengers;
					res.json(response);
				});
		});
});

module.exports = app;