const expect = require('chai').expect;
const supertest = require('supertest');
const app = require('../../src/express');

describe('passenger', () => {
	const request = supertest(app);
	describe('should be able to create passengers', () => {
		it('should be able to fill front seat', (done) => {
			request.post('/passenger')
				.send({
					email: 'front@test.com',
					seat: 'front',
					guid: 'autotest-tour1'
				})
				.expect(200)
				.end((err, res) => {
					expect(res.body.success).to.equal(true);
					done();
				});
		});
		it('should be able to fill one back seat', (done) => {
			request.post('/passenger')
				.send({
					email: 'back1@test.com',
					seat: 'back',
					guid: 'autotest-tour1'
				})
				.expect(200)
				.end((err, res) => {
					expect(res.body.success).to.equal(true);
					done();
				});
		});
		it('should be able to fill second back seat', (done) => {
			request.post('/passenger')
				.send({
					email: 'back2@test.com',
					seat: 'back',
					guid: 'autotest-tour1'
				})
				.expect(200)
				.end((err, res) => {
					expect(res.body.success).to.equal(true);
					done();
				});
		});
		it('should be able to fill third back seat', (done) => {
			request.post('/passenger')
				.send({
					email: 'back3@test.com',
					seat: 'back',
					guid: 'autotest-tour1'
				})
				.expect(200)
				.end((err, res) => {
					expect(res.body.success).to.equal(true);
					done();
				});
		});
	});
	describe('should be able to list passengers', () => {
		it('should show 4 passengers for car1', (done) => {
			request.get('/passenger')
				.query({
					guid: 'autotest-tour1'
				})
				.expect(200)
				.end((err, res) => {
					expect(res.body.length).to.equal(4);
					done();
				});
		});
	});
});
