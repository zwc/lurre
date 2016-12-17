const app = require('./src/express');

const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`account is up @ ${port}`);
});