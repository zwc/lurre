const request = require('request');

module.exports = {
	index: (req, res) => {
		const email = res.locals.session;
		request.get({url: `http://localhost:8081/plan`, qs: { email }, json: true}, (err, body, data) => {
			if(data && (data.driver || data.passenger)) {
				res.render('page/schedule', data);
			} else {
				res.render('page/index');
			}
		});
	}
};