process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const knex = require('../db/knex')

chai.use(chaiHttp);

describe('Client Routes', () => {

	it('should return the homepage with html elements.', (done) => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.html;
      done();
    });
  });

  it('should return a 404 for a route that doesn\'t exist.', (done) => {
    chai.request(server)
    .get('/sad')
    .end((err, response) => {
      response.should.have.status(404);
      done();
    });
  });

});

describe('API Routes', () => {
	before((done) => {
		knex.migrate.rollback()
		.then(() => {
			knex.migrate.latest()
			.then(() => {
				done();
			});
		});
	});

	beforeEach((done) => {
		knex.seed.run()
		.then(() => {
			done();
		});
	});

	describe('GET /api/v1/inventory', () => {
		
		it('should return all items in inventory.', (done) => {
			chai.request(server)
			.get('/api/v1/inventory')
			.end((error, response) => {
				const sortedBody = response.body.sort((a, b) => a.id - b.id);

				response.should.have.status(200);
				response.should.be.json;
				sortedBody.should.be.a('array');
				sortedBody[0].should.have.property('id'); 
				sortedBody[0].should.have.property('title'); 
				sortedBody[0].should.have.property('description'); 
				sortedBody[0].should.have.property('image'); 
				sortedBody[0].should.have.property('price');
				sortedBody[0].id.should.equal(1); 
				sortedBody[0].title.should.equal('Mountain Bike'); 
				sortedBody[0].description.should.equal('A bike for riding in mountains, trails, deserts, and various other off-roady things.'); 
				sortedBody[0].image.should.equal('https://www.rei.com/media/e3294a41-1579-4673-a652-d5d56e805c54?size=300'); 
				sortedBody[0].price.should.equal('499.00');
				done(); 
			});
		});

		it('should return a 404 if directed to a non existent endpoint.', (done) => {
      chai.request(server)
      .get('/api/v1/boomgoesthedynamite')
      .end((error, response) => {

        response.should.have.status(404);
        done();
      });
    });
	});

	describe('GET /api/v1/orderHistory', () => {

		it('should return all of the orders from order_history.', (done) => {
			chai.request(server)
			.get('/api/v1/orderHistory')
			.end((error, response) => {
				response.should.have.status(200);
				response.should.be.json;
				response.body[0].should.have.property('id');
				response.body[0].should.have.property('total');
				response.body[0].should.have.property('created_at');
				response.body[0].id.should.equal(3);
				response.body[0].total.should.equal('100.00');
				done();
			});
		});

		it('should return a 404 if directed to a non existent endpoint.', (done) => {
      chai.request(server)
      .get('/api/v1/nonexistentendpoint')
      .end((error, response) => {

        response.should.have.status(404);
        done();
      });
    });
	});

	describe('POST /api/v1/inventory', () => {

		it('should add a new item to the inventory database.', (done) => {
			const newItem = {
				title: 'Shiny new thing',
				description: 'A super sweet, shiny, thing that you definitely don\'t need.',
				image: 'www.fakeimage.com',
				price: 1000.00
			};

			chai.request(server)
			.post('/api/v1/inventory')
			.send(newItem)
			.end((error, response) => {
				response.should.have.status(201);
				response.should.be.json;
				response.body.should.have.property('id');
				response.body.id.should.equal(11);
				done();
			});
		});

		it('should not add a new item if missing a required parameter.', (done) => {
			const badItem = {
				title: 'bad thing',
				image: 'www.notreal.com',
				price: 2.99
			};

			chai.request(server)
			.post('/api/v1/inventory')
			.send(badItem)
			.end((error, response) => {
				response.should.have.status(422);
				response.should.be.json;
				response.body.error.should.equal('Expected format: { title: <String>, description: <String>, Image: <String>, price: <Decimal>. You are missing a description property.')
				done();
			});
		});
	});

	describe('POST /api/v1/orderHistory', () => {

		it('should add a new order to order history.', () => {
			const newOrder = {
				total: 500.00
			};

			chai.request(server)
			.post('/api/v1/orderHistory')
			.send(newOrder)
			.end((error, response) => {
				response.should.have.status(201)
				response.body.should.be.json;
				response.body.should.have.property('id');
				response.body.id.should.equal(2);
				done();
			});
		});

		it('should not add a new order if missing a required parameter', () => {
			const badOrder = {};

			chai.request(server)
			.post('/api/v1/orderHistory')
			.send(badOrder)
			.end((error, response) => {
				response.should.have.status(422);
				response.should.be.json;
				response.body.error.should.equal('total: <Decimal>. You are missing the total property.')
				done();
			});
		});
	});

});

