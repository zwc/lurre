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
	app.get('/driver/add/car', driverController.car);
	app.get('/driver/add/place', driverController.place);
	app.get('/driver/add/time', driverController.time);

	// Driver::Backend
	app.post('/driver/create/place', driverController.createPlace);
	app.post('/driver/create/time', driverController.createTime);
	app.post('/driver/create/car', driverController.createCar);
	app.post('/driver/create', driverController.create);

	// Passenger
	app.get('/passenger', passengerController.index);
	app.post('/passenger/create', passengerController.create);
	app.get('/passenger/cancel', passengerController.cancel);

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