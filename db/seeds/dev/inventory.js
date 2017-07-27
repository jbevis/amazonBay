const items = [
  { title: 'Mountain Bike',
    description: 'A bike for riding in mountains, trails, deserts, and various other off-roady things.',
    image: 'https://www.rei.com/media/e3294a41-1579-4673-a652-d5d56e805c54?size=300',
    price: 499.00
  },
  { title: 'Drum Set',
    description: 'Here comes the thunder, a full five piece set with kick, snare, 3 toms, ride, crash, hi-hat, and hardware.',
    image: 'http://www.dwdrums.com/images/drums/kits/coll-ex-regalnatburst-mineralmaple.jpg',
    price: 1500.00
  },
  { title: 'East of Eden',
    description: 'Set in the rich farmland of California’s Salinas Valley, this sprawling and often brutal novel follows the intertwined destinies of two families—the Trasks and the Hamiltons.',
    image: 'https://images.gr-assets.com/books/1441547516l/4406.jpg',
    price: 15.99
  },
  { title: 'Climbing Rope',
    description: 'A high end rope with small diameter for experienced climbers to use in rock, mixed, snow, and ice climbing',
    image: 'https://www.rei.com/media/c096c235-053f-49a7-882a-600fbb78412d?size=1020x510',
    price: 249.99
  },
  { title: 'MacBook Pro',
    description: 'MacBook Pro in Space Gray, with a 2.3 GHz dual-core processor, 128GB SSD storage.',
    image: 'https://store.storeimages.cdn-apple.com/4974/as-images.apple.com/is/image/AppleInc/aos/published/images/m/bp/mbp13/gray/mbp13-gray-select-cto-201610?wid=1808&hei=1680&fmt=jpeg&qlt=80&.v=1495842443716',
    price: 1299.00
  },
  { title: 'Sunglasses',
    description: 'Stylish and functional shades for keeping the sun out of your eyes, and making you once cool cucumber.',
    image: 'https://cdn-us-ec.yottaa.net/53c4dce0ea2e0c13de0003b8/us.vonzipper.com/v~13.54/media/filter/l/img/smpfjelm_bpp_1.jpg?1416151294&yocs=1t_&yoloc=us',
    price: 99.00
  },

];

const orderHistory = [
  { total: 100.00 }
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
