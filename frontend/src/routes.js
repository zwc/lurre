'use strict';
const indexController = require('./controller/indexController');
const driverController = require('./controller/driverController');
const passengerController = require('./controller/passengerController');
const accountController = require('./controller/accountController');

module.exports = (app) => {
	// Index
	app.get('/', indexController.index);

	// Driver
	app.get('/driver', driverController.index);

	// Passenger
	app.get('/passenger', passengerController.index);

	// Account
	app.get('/account/login', accountController.signin);
	app.get('/account/signup', accountController.signup);
	app.post('/account/create', accountController.create);
	app.post('/account/login', accountController.login);
	app.get('/account/logout', accountController.logout);

	// 404
	//app.use(indexController.notFound);
	//app.use(indexController.error);
};