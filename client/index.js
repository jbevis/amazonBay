
	
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
  
getInventory()

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


$('.inventory-gallery').on('click', '.add-to-cart', function() {
	let title = this.closest('.inventory-item').children[0].innerText;
	let price = this.closest('.inventory-item').children[3].innerText;
	let cartItem = { title, price };
	let priceInt = parseInt(price.split('').slice(1).join(''));

	addToCart(cartItem);
	sumTotal(priceInt);

})