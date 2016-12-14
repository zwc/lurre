const app = require('./src/express');
const port = process.env.PORT || 8081;

app.listen(port, () => {
	console.log(`share is up @ ${port}`);
});