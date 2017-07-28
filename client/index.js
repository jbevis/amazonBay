$(document).ready(() => {
	getInventory();
	persistCartItems();
	getOrderHistory();
})
	
const getInventory = () => {
	fetch('/api/v1/inventory')
	.then(response => response.json())
  .then(inventory => {
   	appendItem(inventory)
  })
};

const appendItem = (array) => {
	console.log(array)
	array.forEach(item => {

	  $('.inventory-gallery').append(
	    `<article class="inventory-item">
	      <h4 class="item-title">${item.title}</h4>
	      <p class="item-description">${item.description}</p>
	      <img class="item-image" alt="${item.title}" src="${item.image}"/>
	      <p class="item-price">$${item.price}</p>
	      <button class="add-to-cart">Add to Cart</button>
	    </article>`
	  )
	})
};
  
const addToCart = (item) => {
	$('#cart-card-holder').append(
		`<article class="cart-card">
			<p>Item: ${item.title}</p>
			<p>Price: ${item.price}</p>
		</article>`
	)
};

const sumTotal = (price) => {
	let currentTotal = $('#total').text().split('').slice(1).join('');
	let currentTotalInt = parseInt(currentTotal);
	let newTotal = currentTotalInt + price;

	$('#total').text(`$${newTotal}`)
};

const persistCartItems = () => {
  if (!localStorage.getItem('cartItems')) {
    return;
  }

  const currentCart = JSON.parse(localStorage.getItem('cartItems'));

  currentCart.forEach((item) => {
  	let price = parseInt(item.price.split('').slice(1).join(''));
  	console.log(price)
    
    addToCart(item);
    sumTotal(price);
  });

	const savedTotal = currentCart.reduce((acc, item) => {
		
		let itemPrice = parseInt(item.price.split('').slice(1).join(''));
		
		return acc + itemPrice
	}, 0);
  
  $('#total').text(`$${savedTotal}`)
};

const setLocalStorage = (obj) => {
  if (!localStorage.getItem('cartItems')) {
    let stringArray = JSON.stringify([]);

    localStorage.setItem('cartItems', stringArray);
  }
  let cartItems = JSON.parse(localStorage.getItem('cartItems'));

  cartItems.push(obj);

  let stringcartItems = JSON.stringify(cartItems);

  localStorage.setItem('cartItems', stringcartItems);
};

const processOrder = (total) => {
	fetch('/api/v1/orderHistory', {
		method: 'POST',
		headers: { 'Content-Type':'application/json' },
		body: JSON.stringify({ total: total })
	})
	.then(() => {
		getOrderHistory()
	});
};

const getOrderHistory = () => {
	fetch('/api/v1/orderHistory')
	.then(response => response.json())
	.then(orders => {
		prependOrders(orders)
	});
};

const prependOrders = (array) => {
	if (!array.length) {
		return;
	}
	$('#order-card-holder').empty();
	array.forEach(order => {
		let cardTotal = `$${order.total}`;
		let cardDate = order.created_at.slice(0, 10);

		$('#order-card-holder').prepend(
			`<article class="cart-card">
				<p class="order-total">Order total: ${cardTotal}</p>
				<p class="order-date">Order date: ${cardDate}</p>
			</article>`
		);
	});
};

const clearCart = () => {
	localStorage.clear();
	$('#cart-card-holder').empty();
	$('#total').text('$0.00');
}

$('#toggle-order-history').on('click', function() {
	const orderExpand = $('#toggle-order-history');

	$('#orders').toggleClass('hidden');
	!orderExpand.text('+') ? orderExpand.text('+') : orderExpand.text('-');
});

$('#toggle-cart').on('click', function() {
	const orderExpand = $('#toggle-cart');

	$('#cart-list').toggleClass('hidden');
	!orderExpand.text('+') ? orderExpand.text('+') : orderExpand.text('-');
});



$('.inventory-gallery').on('click', '.add-to-cart', function() {
	let title = this.closest('.inventory-item').children[0].innerText;
	let price = this.closest('.inventory-item').children[3].innerText;
	let cartItem = { title, price };
	let priceInt = parseInt(price.split('').slice(1).join(''));

	addToCart(cartItem);
	sumTotal(priceInt);
	setLocalStorage(cartItem);
});

$('.checkout-btn').on('click', function() {
	let orderTotal = parseInt($('#total').text().slice(1));
	
	processOrder(orderTotal);
	clearCart();
});