const expect = require('chai').expect;
const supertest = require('supertest');
const app = require('../../src/express');

describe('driver', () => {
	const request = supertest(app);
	it('should be able to create a driver', (done) => {
		request.post('/driver')
			.send({
				email: 'driver@test.com',
				place: 'place',
				time : '12:00',
				car : 'seats2-2'
			})
			.expect(200)
			.end((err, res) => {
				expect(res.body.success).to.equal(true);
				done();
			});
	});
});
