const H = require('highland');
const _ = require('lodash');
const client = require('../util/redis');
const account = require('../service/account');

const getPassengersByGuid = (guid) => {
	return H([`lurre:passenger:${guid}:*`])
		.flatMap(client.keys)
		.flatMap(H)
		.flatMap(client.getByKey)
		.flatMap(account.getAccountDetails)
		.collect();
};

const list = (req, res) => {
	const email = req.query.email;
	H([`lurre:driver:*:${email}`, `lurre:passenger:*:${email}`])
		.flatMap(client.keys)
		.flatMap(H)
		.flatMap(client.getKey)
		.reduce({}, (iterator, obj) => {
			const key = Object.keys(obj).pop();
			iterator[key] = obj[key];
			return iterator;
		})
		.apply(response => {
			const guid = _.get(response, 'driver.guid') || _.get(response, 'passenger.guid');

			// If it's a passenger, I must get the driver's info as well
			if(response.passenger) {
				H([`lurre:driver:${guid}:*`])
					.flatMap(client.keys)
					.flatMap(H)
					.flatMap(client.getKey)
					.apply(driver => {
						if(driver) {
							response.driver = driver['driver'];
						}
						getPassengersByGuid(guid)
							.apply(passengers => {
								response.passengers = passengers;
								res.json(response);
							});
					});
			} else {
				getPassengersByGuid(guid)
					.apply(passengers => {
						response.passengers = passengers;
						res.json(response);
					});
			}
		});
};

module.exports = list;