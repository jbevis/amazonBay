const items = [
  { id: 1,
    title: 'Mountain Bike',
    description: 'A bike for riding in mountains, trails, deserts, and various other off-roady things.',
    image: 'https://www.rei.com/media/e3294a41-1579-4673-a652-d5d56e805c54?size=300',
    price: 499.00
  },
  { id: 2,
    title: 'Drum Set',
    description: 'Here comes the thunder, a full five piece set with kick, snare, 3 toms, ride, crash, hi-hat, and hardware.',
    image: 'http://www.dwdrums.com/images/drums/kits/coll-ex-regalnatburst-mineralmaple.jpg',
    price: 1500.00
  }

];

const orderHistory = [
  { id: 3,
    total: 100.00 
  }
];

const seedInventory = (knex) => {
  return items.map(item => {
    return knex('inventory').insert({
      title: item.title,
      description: item.description,
      image: item.image,
      price: item.price
    }, 'id');
  });
};

const seedOrderHistory = (knex) => {
  return knex('order_history').insert({
    total: orderHistory[0].total
  }, 'id')
};

exports.seed = (knex, Promise) => {
  return knex('inventory').del()
    .then(() => knex('order_history').del())
    .then(() => {
      const inventoryItems = seedInventory(knex);
      const orders = seedOrderHistory(knex);
      return Promise.all([...inventoryItems, orders]);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
