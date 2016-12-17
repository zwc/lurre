const expect = require('chai').expect;
const supertest = require('supertest');
const app = require('../../src/express');

describe('driver', () => {
	const request = supertest(app);
	it('should be able to create a driver', (done) => {
		request.post('/driver')
			.send({
				email: 'driver@test.com',
				place: 'autotest-place1',
				time : 'autotest-time12',
				car : 'autotest-car1',
				guid: 'autotest-tour1'
			})
			.expect(200)
			.end((err, res) => {
				expect(res.body.success).to.equal(true);
				done();
			});
	});
});
