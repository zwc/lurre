'use strict';
const md5 = require('md5');
const salt = 'xBW;7rR_-kmFA4rmj8aU3wZCRW6wvF:=';

module.exports = {
	encode: (value) => {
		const pair = md5(value + salt);
		return `${value}|${pair}`;
	},
	decode: (value) => {
		if(typeof value === 'string') {
			const split = value.split('|');
			if (md5(split[0] + salt) === split[1]) {
				return split[0];
			}
		}
		return;
	}
};