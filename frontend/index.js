'use strict';
const app = require('./src/express');
const port = 9000;

app.listen(port, () => {
	console.log('frontend started', { port });
});