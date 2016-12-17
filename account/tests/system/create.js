// create 5 accounts
const expect = require('chai').expect;
const supertest = require('supertest');
const app = require('../../src/express');

describe('driver', () => {
	const request = supertest(app);
	it('should be able to create a driver', (done) => {
		request.post('/register')
			.send({
				email: 'driver@test.com',
				password: '1234Lunch',
				name: 'Gurra Andersson'
			})
			.expect(200)
			.end((err, res) => {
				expect(res.body.success).to.equal(true);
				done();
			});
	});
	it('should be able to create passenger', (done) => {
		request.post('/register')
			.send({
				email: 'front@test.com',
				password: '1234Lunch',
				name: 'Pelle Svanslös'
			})
			.expect(200)
			.end((err, res) => {
				expect(res.body.success).to.equal(true);
				done();
			});
	});
	it('should be able to create passenger', (done) => {
		request.post('/register')
			.send({
				email: 'back1@test.com',
				password: '1234Lunch',
				name: 'Arne Anka'
			})
			.expect(200)
			.end((err, res) => {
				expect(res.body.success).to.equal(true);
				done();
			});
	});
	it('should be able to create passenger', (done) => {
		request.post('/register')
			.send({
				email: 'back2@test.com',
				password: '1234Lunch',
				name: 'Kalle Anka'
			})
			.expect(200)
			.end((err, res) => {
				expect(res.body.success).to.equal(true);
				done();
			});
	});
	it('should be able to create passenger', (done) => {
		request.post('/register')
			.send({
				email: 'back3@test.com',
				password: '1234Lunch',
				name: 'Ronja Rövardotter'
			})
			.expect(200)
			.end((err, res) => {
				expect(res.body.success).to.equal(true);
				done();
			});
	});
	it('should be able to create passenger', (done) => {
		request.post('/register')
			.send({
				email: 'back4@test.com',
				password: '1234Lunch',
				name: 'Olle Svensson'
			})
			.expect(200)
			.end((err, res) => {
				expect(res.body.success).to.equal(true);
				done();
			});
	});
});
