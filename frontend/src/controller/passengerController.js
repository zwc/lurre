const request = require('request');
module.exports = {
	index: (req, res) => {
		request.get({ url: `http://localhost:8081/list`, json: true }, (err, body, tours) => {
			tours.map(t => {
				t.seatsLeftForward = parseInt(t.car.seatsForward) - t.passengers.filter(p => p.seat === 'forward').length;
				t.seatsLeftBack = parseInt(t.car.seatsBack) - t.passengers.filter(p => p.seat === 'back').length;
				t.seatsLeft = t.seatsLeftForward + t.seatsLeftBack;
			});
			res.render('page/passenger/index', { tours });
		});
	},
	create: (req, res) => {
		const email = res.locals.session;
		const place = req.body.place;
		const seat = req.body.seat;
		request.post({url: `http://localhost:8081/passenger`, form: { email, place, seat }, json: true}, (err) => {
			res.redirect('/');
		});
	}
};