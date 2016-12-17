const expect = require('chai').expect;
const supertest = require('supertest');
const app = require('../../src/express');

describe('resources', () => {
	const request = supertest(app);
	describe('create resources', () => {
		it('should be able to register a place', (done) => {
			request.post('/place/create')
				.send({
					email: 'driver@test.com',
					name: 'Sunkhak',
					description: 'Pizza',
					guid: 'autotest-place1'
				})
				.expect(200)
				.end((err, res) => {
					expect(res.body.success).to.equal(true);
					done();
				});
		});
		it('should be able to register a time', (done) => {
			request.post('/time/create')
				.send({
					email: 'driver@test.com',
					time: '12:00',
					guid: 'autotest-time12'
				})
				.expect(200)
				.end((err, res) => {
					expect(res.body.success).to.equal(true);
					done();
				});
		});
		it('should be able to register a car', (done) => {
			request.post('/car/create')
				.send({
					email: 'driver@test.com',
					name: 'Pärlan',
					seatsForward: 2,
					seatsBack: 4,
					guid: 'autotest-car1'
				})
				.expect(200)
				.end((err, res) => {
					expect(res.body.success).to.equal(true);
					done();
				});
		});
	});
	describe('list resources', () => {
		it('should be able to list places', (done) => {
			request.get('/place/list')
				.query({
					email: 'driver@test.com'
				})
				.expect(200)
				.end((err, res) => {
					const place = res.body.pop();
					expect(place.name).to.equal('Sunkhak');
					expect(place.description).to.equal('Pizza');
					done();
				});
		});
		it('should be able to list times', (done) => {
			request.get('/time/list')
				.query({
					email: 'driver@test.com'
				})
				.expect(200)
				.end((err, res) => {
					const time = res.body.pop();
					expect(time.time).to.equal('12:00');
					done();
				});
		});
		it('should be able to list cars', (done) => {
			request.get('/car/list')
				.query({
					email: 'driver@test.com'
				})
				.expect(200)
				.end((err, res) => {
					const car = res.body.pop();
					expect(car.name).to.equal('Pärlan');
					expect(car.seatsForward).to.equal(2);
					expect(car.seatsBack).to.equal(4);
					done();
				});
		});
	});
});