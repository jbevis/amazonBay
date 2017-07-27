const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.use(express.static(`${__dirname}/client`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (request, response) => {
	response.sendFile(path.join(__dirname, './client/index.html'));
});

// app.get('/', (request, response) => {
// 	response.send('index.html')
// });

//Endpoints

//GET Requests
app.get('/api/v1/inventory', (request, response) => {
	database('inventory').select()
	.then(inventory => {
		if (inventory.length) {
			response.status(200).json(inventory);
		} else {
			response.status(404).json({
				error: 'No inventory items were found'
			});
		}
	})
	.catch(error => {
		response.status(500).json({ error });
	});
});

app.get('/api/v1/orderHistory', (request, response) => {
	database('order_history').select()
	.then(orderHistory => {
		if (orderHistory.length) {
			response.status(200).json(orderHistory);
		} else {
			response.status(404).json({
				error: 'No order history was found.'
			})
		}
	})
	.catch(error => {
		response.status(500).json ({ error });
	});
});

//POST Requests
app.post('/api/v1/inventory', (request, response) => {
	const item = request.body

	for (let requiredParameter of ['title', 'description', 'image', 'price']) {
		if (!item[requiredParameter]) {
			return response.status(422).json({
				error: `Expected format: { title: <String>, description: <String>, Image: <String>, price: <Decimal>. You are missing a ${requiredParameter} property.`
			});
		}
	}

	database('inventory').insert(item, 'id')
	.then(item => {
		response.status(201).json({ id: item[0] });
	})
	.catch(error => {
		response.status(500).json({
			error: 'Internal server error.'
		});
	});
});

app.post('/api/v1/orderHistory', (request, response) => {
	const order = request.body

	for (let requiredParameter of ['total']) {
		if (!item[requiredParameter]) {
			return response.status(422).json({
				error: `Expected format: { total: <Decimal>. You are missing the ${requiredParameter} property.`
			});
		}
	}

	database('order_history').insert(order, 'id')
	.then(item => {
		response.status(201).json({ id: order[0] });
	})
	.catch(error => {
		response.status(500).json({
			error: 'Internal server error.'
		});
	});
});


if (!module.parent) {
	app.listen(app.get('port'), () => {
		console.log(`AmazonBay is running on port ${app.get('port')}`);
	});
};

module.exports = app;