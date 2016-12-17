const H = require('highland');
const redis = require('redis');
const client = redis.createClient();

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

const getByKey = (key) => {
	if(key.length <= 0) return H([]);
	return H([key])
		.flatMap(get)
		.map(JSON.parse);
};

module.exports = {
	keys,
	get,
	set: client.set,
	getKey,
	getByKey
};