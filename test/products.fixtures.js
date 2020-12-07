function makeProductsArray() {
  return [
    {
      id: 1,
      user_id: 1,
      name: 'Samsung Refridgerator',
      url: 'https://www.bestbuy.com/site/samsung-28-cu-ft-large-capacity-3-door-french-door-refrigerator-with-autofill-water-pitcher-fingerprint-resistant-stainless-steel/6417768.p?skuId=6417768',
      comments: 'Has tons of storage!',
      category: 'Kitchen',
      date_created: '2020-09-05T20:00:00.000Z',
    },
    {
      id: 2,
      user_id: 1,
      name: 'Sonos TV Soundbar',
      url: 'https://www.bestbuy.com/site/sonos-beam-soundbar-with-voice-control-built-in-black/6253409.p?skuId=6253409',
      comments: 'Great sound!',
      category: 'Living Room',
      date_created: '2020-09-10T20:00:00.000Z',
    },
    {
      id: 3,
      user_id: 2,
      name: 'Sienna High Table & 4 Barstools',
      url: 'https://www.cityfurniture.com/product/9715395/ei-sienna-dark-tone-high-tbl-4-bs-9715395',
      comments: 'We have the dark tone color.',
      category: 'Dining Room',
      date_created: '2020-10-05T20:00:00.000Z',
    },
    {
      id: 4,
      user_id: 2,
      name: 'Raegan Gray Fabric Right Chaise Sectional',
      url: 'https://www.cityfurniture.com/product/9711891/gy-raegan-gray-fabric-right-chaise-sect',
      comments: 'Such a comfy couch!',
      category: 'Living Room',
      date_created: '2020-10-10T20:00:00.000Z',
    },
    {
      id: 5,
      user_id: 3,
      name: 'Lacey Gray Uph Platform Bed',
      url: 'https://www.cityfurniture.com/product/9716528/lacey-gray-uph-platform-bed',
      comments: '',
      category: 'Bedroom',
      date_created: '2020-11-05T19:00:00.000Z',
    },
    {
      id: 6,
      user_id: 3,
      name: 'Sutton Light Tone Dresser',
      url: 'https://www.cityfurniture.com/product/35006/sg-sutton-dark-tone-dresser',
      comments: 'Great quality dresser.',
      category: 'Bedroom',
      date_created: '2020-11-10T19:00:00.000Z',
    },
  ];
}

function seedProducts(db, products) {
  return db
    .into('products')
    .insert(products)
    .then(() => {
      return db.raw(`SELECT setval('products_id_seq',?)`, [
        products[products.length - 1].id,
      ]);
    });
}

module.exports = {
  makeProductsArray,
  seedProducts
}