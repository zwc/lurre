const H = require('highland');
const request = require('request');
const url = require('url');

const wrappedRequest = H.wrapCallback((params, callback) => request.get(params, (err, body, data) => {
	const path = url.parse(params.url).pathname;
	callback(err, { [path]: data });
}));

module.exports = {
	index: (req, res) => {
		const email = res.locals.session;
		const driverList = { url: `http://localhost:8081/place/list`, qs: { email }, json: true, };
		const timeList = { url: `http://localhost:8081/time/list`, qs: { email }, json: true, };
		const carList = { url: `http://localhost:8081/car/list`, qs: { email }, json: true, };
		H([driverList, timeList, carList])
			.flatMap(wrappedRequest)
			.reduce((it, obj) => {
				const head = Object.keys(obj).pop();
				it[head] = obj[head];
				return it;
			}, {})
			.apply(data => {
				res.render('page/driver/index', data);
			});
	},
	car: (req, res) => {
		res.render('page/driver/add/car', { js: 'form' });
	},
	place: (req, res) => {
		res.render('page/driver/add/place', { js: 'form' });
	},
	time: (req, res) => {
		res.render('page/driver/add/time', { js: 'form' });
	},
	create: (req, res) => {
		const email = res.locals.session;
		const place = req.body.place;
		const time = req.body.time;
		const car = req.body.car;
		request.post({url: `http://localhost:8081/driver`, form: { email, place, time, car }, json: true}, (err) => {
			res.redirect('/');
		});
	},
	createPlace: (req, res) => {
		const email = res.locals.session;
		const name = req.body.name;
		const description = req.body.description;
		request.post({url: `http://localhost:8081/place/create`, form: { email, name, description }, json: true}, (err) => {
			res.redirect('/driver');
		});
	},
	createTime: (req, res) => {
		const email = res.locals.session;
		const time = req.body.time;
		request.post({url: `http://localhost:8081/time/create`, form: { email, time }, json: true}, (err) => {
			res.redirect('/driver');
		});
	},
	createCar: (req, res) => {
		const email = res.locals.session;
		const name = req.body.name;
		const seatsForward = req.body.seatsForward;
		const seatsBack = req.body.seatsBack;
		request.post({url: `http://localhost:8081/car/create`, form: { email, name, seatsForward, seatsBack }, json: true}, (err) => {
			res.redirect('/driver');
		});
	}
};