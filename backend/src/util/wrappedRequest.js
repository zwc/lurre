const H = require('highland');
const request = require('request');
const url = require('url');

const wrappedRequest = H.wrapCallback((params, callback) => request.get(params, (err, body, data) => {
	const path = url.parse(params.url).pathname;
	callback(err, { [path]: data });
}));

module.exports = wrappedRequest;