const H = require('highland');
const wrappedRequest = require('../util/wrappedRequest');

const getAccountDetails = (account) => {
	return H([{ url:`http://localhost:8080/details`, qs: { email: account.email }, json: true}])
		.flatMap(wrappedRequest)
		.map(details => {
			return Object.assign({}, account, details['/details'])
		});
};

module.exports = {
	getAccountDetails
};