/**
 * FoodOrder - Comprehensive Sample & Initial Dataset
 * Contains 7 food categories, 8 restaurants, 40+ menu items, demo users, promo codes, and sample reviews.
 */

export const INITIAL_CATEGORIES = [
  { id: 'cat-pizza', name: 'Pizza', icon: '🍕', description: 'Wood-fired artisanal pizzas & cheesy slices' },
  { id: 'cat-burgers', name: 'Burgers', icon: '🍔', description: 'Juicy handcrafted smash burgers & crispy sides' },
  { id: 'cat-sushi', name: 'Sushi', icon: '🍣', description: 'Fresh sashimi, maki rolls & nigiri combos' },
  { id: 'cat-noodles', name: 'Noodles', icon: '🍜', description: 'Authentic ramen, pad thai & wok-tossed noodles' },
  { id: 'cat-salads', name: 'Salads', icon: '🥗', description: 'Crisp garden salads, organic grain bowls & greens' },
  { id: 'cat-desserts', name: 'Desserts', icon: '🍰', description: 'Decadent cakes, pastries, waffles & churros' },
  { id: 'cat-beverages', name: 'Beverages', icon: '🍹', description: 'Craft coffees, fresh smoothies & cool mocktails' },
];

export const INITIAL_RESTAURANTS = [
  {
    id: 'rest-1',
    name: 'Bella Italia Trattoria',
    tagline: 'Authentic stone-baked pizzas & homemade pasta',
    cuisines: ['Italian', 'Pizza', 'Pasta'],
    rating: 4.8,
    reviewCount: 342,
    deliveryTime: '25-35 min',
    deliveryFee: 1.99,
    minOrder: 15.00,
    priceRange: '$$',
    featured: true,
    popular: true,
    address: '142 Little Italy Way, Culinary District',
    phone: '+1 (555) 234-9871',
    description: 'Family-owned Italian trattoria bringing authentic rustic flavors from Naples and Tuscany. Hand-stretched dough, San Marzano tomatoes, and fresh buffalo mozzarella baked at 800 degrees.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'rest-2',
    name: 'The Burger Foundry',
    tagline: 'Gourmet smashed beef burgers & hand-spun shakes',
    cuisines: ['American', 'Burgers', 'Fast Food'],
    rating: 4.7,
    reviewCount: 512,
    deliveryTime: '20-30 min',
    deliveryFee: 2.49,
    minOrder: 12.00,
    priceRange: '$$',
    featured: true,
    popular: true,
    address: '88 Foundry Boulevard, Downtown',
    phone: '+1 (555) 872-3490',
    description: 'We believe in burger perfection: 100% prime Angus beef smashed ultra-thin for crispy, caramelized edges on toasted brioche buns with signature secret sauce.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'rest-3',
    name: 'Sakura Zen Sushi Bar',
    tagline: 'Precision omakase sushi & artful rolls',
    cuisines: ['Japanese', 'Sushi', 'Asian'],
    rating: 4.9,
    reviewCount: 428,
    deliveryTime: '30-40 min',
    deliveryFee: 3.49,
    minOrder: 20.00,
    priceRange: '$$$',
    featured: true,
    popular: true,
    address: '12 Cherry Blossom Lane, Midtown',
    phone: '+1 (555) 438-9123',
    description: 'Traditional Edo-style sushi masterfully prepared with daily air-shipped seafood from Tsukiji, seasoned Koshihikari sushi rice, and house-brewed aged soy sauce.',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'rest-4',
    name: 'Wok & Roll Noodle House',
    tagline: 'Steaming ramen, wok-tossed noodles & dumplings',
    cuisines: ['Asian', 'Noodles', 'Thai'],
    rating: 4.6,
    reviewCount: 285,
    deliveryTime: '20-35 min',
    deliveryFee: 1.99,
    minOrder: 14.00,
    priceRange: '$',
    featured: false,
    popular: true,
    address: '405 Dragon Gate Street, Chinatown',
    phone: '+1 (555) 789-0124',
    description: 'From 18-hour simmered Tonkotsu broths to flame-kissed wok noodles with smoky wok hei aroma. Fast, heartwarming, and deeply flavorful.',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'rest-5',
    name: 'Fresh Greens & Bowls',
    tagline: 'Wholesome organic salads, warm grains & superfoods',
    cuisines: ['Salads', 'Healthy', 'Vegan'],
    rating: 4.8,
    reviewCount: 196,
    deliveryTime: '15-25 min',
    deliveryFee: 0.00,
    minOrder: 10.00,
    priceRange: '$$',
    featured: true,
    popular: false,
    address: '77 Greenway Park, West End',
    phone: '+1 (555) 345-6781',
    description: 'Farm-to-table organic salad bowls, locally sourced produce, antioxidant-packed grains, and scratch-made dressings created daily without preservatives.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'rest-6',
    name: 'Sweet Treats & Patisserie',
    tagline: 'Artisanal French pastries, waffles & decadent cakes',
    cuisines: ['Desserts', 'Bakery', 'Cafe'],
    rating: 4.9,
    reviewCount: 310,
    deliveryTime: '20-30 min',
    deliveryFee: 1.49,
    minOrder: 10.00,
    priceRange: '$$',
    featured: false,
    popular: true,
    address: '22 Sugar Plum Plaza, South Quarter',
    phone: '+1 (555) 678-9012',
    description: 'A Parisian-inspired confectionery and dessert lounge. Indulge in warm molten lava cakes, silky New York cheesecakes, colorful macarons, and handcrafted gelatos.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'rest-7',
    name: 'El Sombrero Cantina',
    tagline: 'Zesty Mexican street tacos, fajitas & fresh guacamole',
    cuisines: ['Mexican', 'Street Food', 'Beverages'],
    rating: 4.7,
    reviewCount: 240,
    deliveryTime: '25-35 min',
    deliveryFee: 2.29,
    minOrder: 15.00,
    priceRange: '$$',
    featured: false,
    popular: true,
    address: '530 Fiesta Way, Eastside',
    phone: '+1 (555) 901-2345',
    description: 'Vibrant street-style Mexican dining featuring slow-cooked birria, fire-roasted salsa, handmade corn tortillas, and refreshing horchata and hibiscus aguas frescas.',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'rest-8',
    name: 'The Daily Grind Cafe & Brews',
    tagline: 'Specialty pour-overs, nitro cold brews & gourmet toasts',
    cuisines: ['Beverages', 'Cafe', 'Breakfast'],
    rating: 4.8,
    reviewCount: 375,
    deliveryTime: '15-25 min',
    deliveryFee: 1.29,
    minOrder: 8.00,
    priceRange: '$',
    featured: false,
    popular: false,
    address: '9 Roast Lane, Financial District',
    phone: '+1 (555) 567-8901',
    description: 'Third-wave specialty coffee shop roasting single-origin beans, craft espresso concoctions, matcha lattes, and fruit smoothies alongside artisan bakery treats.',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'
  }
];

export const INITIAL_FOOD_ITEMS = [
  // Restaurant 1: Bella Italia Trattoria (Italian / Pizza / Pasta)
  {
    id: 'food-101',
    restaurantId: 'rest-1',
    restaurantName: 'Bella Italia Trattoria',
    name: 'Margherita Pizza Di Bufala',
    category: 'Pizza',
    price: 15.99,
    description: 'Traditional wood-fired pizza topped with Italian San Marzano tomato sauce, fresh buffalo mozzarella, aromatic fresh basil leaves, and extra virgin olive oil.',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isVegan: false,
    isSpicy: false,
    isChefSpecial: true,
    rating: 4.9,
    ratingCount: 164,
    available: true,
    cookingTime: '15-20 min',
    customizations: [
      {
        name: 'Crust Type',
        required: true,
        options: [
          { name: 'Classic Neapolitan Crust', price: 0 },
          { name: 'Thin & Crispy', price: 0 },
          { name: 'Garlic Butter Stuffed Crust', price: 2.50 }
        ]
      },
      {
        name: 'Extra Toppings',
        required: false,
        options: [
          { name: 'Extra Buffalo Mozzarella', price: 2.00 },
          { name: 'Kalamata Olives', price: 1.50 },
          { name: 'Sauteed Wild Mushrooms', price: 1.75 }
        ]
      }
    ]
  },
  {
    id: 'food-102',
    restaurantId: 'rest-1',
    restaurantName: 'Bella Italia Trattoria',
    name: 'Truffle Mushroom Pizza',
    category: 'Pizza',
    price: 18.50,
    description: 'White base pizza with roasted cremini & shiitake mushrooms, melted fior di latte mozzarella, fragrant black truffle oil, and shaved aged parmesan.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isVegan: false,
    isSpicy: false,
    isChefSpecial: true,
    rating: 4.8,
    ratingCount: 98,
    available: true,
    cookingTime: '15-20 min',
    customizations: [
      {
        name: 'Crust Type',
        required: true,
        options: [
          { name: 'Classic Neapolitan', price: 0 },
          { name: 'Gluten-Free Cauliflower Crust', price: 3.00 }
        ]
      }
    ]
  },
  {
    id: 'food-103',
    restaurantId: 'rest-1',
    restaurantName: 'Bella Italia Trattoria',
    name: 'Classic Lasagna Bolognese',
    category: 'Noodles',
    price: 17.25,
    description: 'Layered ribbon pasta with slow-simmered beef and pork ragu, silky bechamel sauce, melted mozzarella, and fresh herbs baked golden brown.',
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isVegan: false,
    isSpicy: false,
    isChefSpecial: false,
    rating: 4.7,
    ratingCount: 84,
    available: true,
    cookingTime: '20-25 min',
    customizations: []
  },
  {
    id: 'food-104',
    restaurantId: 'rest-1',
    restaurantName: 'Bella Italia Trattoria',
    name: 'Tiramisu Tradizionale',
    category: 'Desserts',
    price: 8.50,
    description: 'Authentic Venetian dessert made with espresso-soaked ladyfinger biscuits, whipped mascarpone cream, and dusted with dark cocoa powder.',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isVegan: false,
    isSpicy: false,
    isChefSpecial: false,
    rating: 4.9,
    ratingCount: 112,
    available: true,
    cookingTime: '5 min',
    customizations: []
  },
  {
    id: 'food-105',
    restaurantId: 'rest-1',
    restaurantName: 'Bella Italia Trattoria',
    name: 'San Pellegrino Sparkling Blood Orange',
    category: 'Beverages',
    price: 3.75,
    description: 'Chilled sparkling Italian citrus beverage made with Mediterranean blood oranges and sparkling natural mineral water.',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isVegan: true,
    isSpicy: false,
    isChefSpecial: false,
    rating: 4.6,
    ratingCount: 45,
    available: true,
    cookingTime: '2 min',
    customizations: []
  },

  // Restaurant 2: The Burger Foundry (American Burgers)
  {
    id: 'food-201',
    restaurantId: 'rest-2',
    restaurantName: 'The Burger Foundry',
    name: 'Double Smash Truffle Burger',
    category: 'Burgers',
    price: 14.95,
    description: 'Two smashed prime Angus beef patties with crispy lace edges, melted aged white cheddar, caramelized balsamic onions, and black truffle aioli on brioche.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isVegan: false,
    isSpicy: false,
    isChefSpecial: true,
    rating: 4.9,
    ratingCount: 220,
    available: true,
    cookingTime: '15-20 min',
    customizations: [
      {
        name: 'Side Choice',
        required: true,
        options: [
          { name: 'Seasoned French Fries', price: 0 },
          { name: 'Cajun Sweet Potato Fries', price: 1.50 },
          { name: 'Beer-Battered Onion Rings', price: 2.00 }
        ]
      },
      {
        name: 'Burger Add-ons',
        required: false,
        options: [
          { name: 'Smoked Applewood Bacon', price: 2.00 },
          { name: 'Pickled Jalapenos', price: 0.75 },
          { name: 'Extra Melted Cheddar', price: 1.25 }
        ]
      }
    ]
  },
  {
    id: 'food-202',
    restaurantId: 'rest-2',
    restaurantName: 'The Burger Foundry',
    name: 'Crispy Buttermilk Chicken Burger',
    category: 'Burgers',
    price: 13.50,
    description: '24-hour marinated buttermilk fried chicken breast, crunchy purple slaw, house dill pickles, and creamy spicy mayo on a toasted potato bun.',
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isVegan: false,
    isSpicy: true,
    isChefSpecial: false,
    rating: 4.7,
    ratingCount: 145,
    available: true,
    cookingTime: '15-20 min',
    customizations: []
  },
  {
    id: 'food-203',
    restaurantId: 'rest-2',
    restaurantName: 'The Burger Foundry',
    name: 'Loaded Cheddar Bacon Fries',
    category: 'Burgers',
    price: 7.95,
    description: 'Golden crispy skin-on fries smothered in hot cheddar cheese sauce, crispy bacon bits, sour cream, and fresh chopped scallions.',
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isVegan: false,
    isSpicy: false,
    isChefSpecial: false,
    rating: 4.8,
    ratingCount: 178,
    available: true,
    cookingTime: '10 min',
    customizations: []
  },
  {
    id: 'food-204',
    restaurantId: 'rest-2',
    restaurantName: 'The Burger Foundry',
    name: 'Salted Caramel Pretzel Shake',
    category: 'Beverages',
    price: 6.50,
    description: 'Hand-spun Madagascar vanilla bean ice cream blended with sea salt caramel syrup, topped with whipped cream and crushed butter pretzels.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isVegan: false,
    isSpicy: false,
    isChefSpecial: true,
    rating: 4.9,
    ratingCount: 130,
    available: true,
    cookingTime: '5 min',
    customizations: []
  },
  {
    id: 'food-205',
    restaurantId: 'rest-2',
    restaurantName: 'The Burger Foundry',
    name: 'Beyond Meat Veggie Burger',
    category: 'Burgers',
    price: 15.25,
    description: 'Char-grilled 100% plant-based Beyond patty, vegan smoked gouda, crisp romaine lettuce, ripe tomato, and roasted garlic vegan mayo.',
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isVegan: true,
    isSpicy: false,
    isChefSpecial: false,
    rating: 4.6,
    ratingCount: 88,
    available: true,
    cookingTime: '15 min',
    customizations: []
  },

  // Restaurant 3: Sakura Zen Sushi Bar (Japanese / Sushi)
  {
    id: 'food-301',
    restaurantId: 'rest-3',
    restaurantName: 'Sakura Zen Sushi Bar',
    name: 'Dragon Roll Supreme (8pcs)',
    category: 'Sushi',
    price: 18.95,
    description: 'Crispy jumbo shrimp tempura and fresh cucumber rolled inside, layered with ripe avocado and barbecue freshwater eel, finished with tobiko and unagi glaze.',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isVegan: false,
    isSpicy: false,
    isChefSpecial: true,
    rating: 4.9,
    ratingCount: 195,
    available: true,
    cookingTime: '15-20 min',
    customizations: [
      {
        name: 'Accompaniment',
        required: false,
        options: [
          { name: 'Extra Fresh Wasabi & Pickled Ginger', price: 1.00 },
          { name: 'Spicy Mayo Dip', price: 0.75 }
        ]
      }
    ]
  },
  {
    id: 'food-302',
    restaurantId: 'rest-3',
    restaurantName: 'Sakura Zen Sushi Bar',
    name: 'Salmon Lover Nigiri & Maki Combo',
    category: 'Sushi',
    price: 22.50,
    description: 'Fresh Norwegian Atlantic salmon prepared three ways: 4pcs fresh salmon nigiri, 4pcs torched aburi salmon belly with yuzu glaze, and 6pcs spicy salmon maki roll.',
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isVegan: false,
    isSpicy: false,
    isChefSpecial: true,
    rating: 4.9,
    ratingCount: 162,
    available: true,
    cookingTime: '15-20 min',
    customizations: []
  },
  {
    id: 'food-303',
    restaurantId: 'rest-3',
    restaurantName: 'Sakura Zen Sushi Bar',
    name: 'Spicy Tuna Crispy Rice (4pcs)',
    category: 'Sushi',
    price: 13.50,
    description: 'Pan-crisped golden sushi rice cakes topped with spicy minced yellowfin tuna, jalapeno slices, microgreens, and sweet soy reduction.',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isVegan: false,
    isSpicy: true,
    isChefSpecial: false,
    rating: 4.8,
    ratingCount: 104,
    available: true,
    cookingTime: '12 min',
    customizations: []
  },
  {
    id: 'food-304',
    restaurantId: 'rest-3',
    restaurantName: 'Sakura Zen Sushi Bar',
    name: 'Matcha Green Tea Boba Latte',
    category: 'Beverages',
    price: 6.25,
    description: 'Ceremonial grade Uji Japanese matcha whisked with oat milk and honey, served over ice with chewy brown sugar tapioca pearls.',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isVegan: true,
    isSpicy: false,
    isChefSpecial: false,
    rating: 4.7,
    ratingCount: 76,
    available: true,
    cookingTime: '5 min',
    customizations: []
  },
  {
    id: 'food-305',
    restaurantId: 'rest-3',
    restaurantName: 'Sakura Zen Sushi Bar',
    name: 'Japanese Mochi Ice Cream Trio',
    category: 'Desserts',
    price: 7.50,
    description: 'Chewy sweet rice cake dumplings filled with artisanal ice cream. Includes three flavours: Green Tea Matcha, Black Sesame, and Sweet Mango.',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isVegan: false,
    isSpicy: false,
    isChefSpecial: false,
    rating: 4.8,
    ratingCount: 89,
    available: true,
    cookingTime: '3 min',
    customizations: []
  },

  // Restaurant 4: Wok & Roll Noodle House (Noodles / Asian)
  {
    id: 'food-401',
    restaurantId: 'rest-4',
    restaurantName: 'Wok & Roll Noodle House',
    name: 'Authentic Tonkotsu Ramen',
    category: 'Noodles',
    price: 15.50,
    description: 'Rich, creamy 18-hour pork bone broth served with springy ramen noodles, tender chashu pork belly, seasoned soft-boiled ajitsuke egg, wood ear mushrooms, and nori.',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isVegan: false,
    isSpicy: false,
    isChefSpecial: true,
    rating: 4.9,
    ratingCount: 230,
    available: true,
    cookingTime: '15-20 min',
    customizations: [
      {
        name: 'Spice Level',
        required: true,
        options: [
          { name: 'Mild (Original Broth)', price: 0 },
          { name: 'Medium Spicy Red Chili Oil', price: 0.50 },
          { name: 'Fiery Ghost Pepper Oil', price: 1.00 }
        ]
      },
      {
        name: 'Extra Toppings',
        required: false,
        options: [
          { name: 'Extra Chashu Pork (2 slices)', price: 3.00 },
          { name: 'Extra Marinated Soft Egg', price: 1.50 },
          { name: 'Bamboo Shoots (Menma)', price: 1.00 }
        ]
      }
    ]
  },
  {
    id: 'food-402',
    restaurantId: 'rest-4',
    restaurantName: 'Wok & Roll Noodle House',
    name: 'Classic Bangkok Pad Thai',
    category: 'Noodles',
    price: 13.95,
    description: 'Stir-fried flat rice noodles in tangy tamarind sauce with plump shrimp, organic tofu, egg, bean sprouts, crushed roasted peanuts, and fresh lime wedge.',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isVegan: false,
    isSpicy: false,
    isChefSpecial: false,
    rating: 4.8,
    ratingCount: 142,
    available: true,
    cookingTime: '12 min',
    customizations: [
      {
        name: 'Protein Choice',
        required: true,
        options: [
          { name: 'Shrimp & Prawns', price: 0 },
          { name: 'Tender Chicken Breast', price: 0 },
          { name: 'Organic Crispy Tofu (Vegetarian)', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'food-403',
    restaurantId: 'rest-4',
    restaurantName: 'Wok & Roll Noodle House',
    name: 'Szechuan Spicy Dan Dan Noodles',
    category: 'Noodles',
    price: 14.25,
    description: 'Wheat noodles tossed in a rich roasted sesame and chili sauce, topped with crispy minced pork, preserved mustard greens, bok choy, and toasted peanuts.',
    image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isVegan: false,
    isSpicy: true,
    isChefSpecial: false,
    rating: 4.7,
    ratingCount: 95,
    available: true,
    cookingTime: '15 min',
    customizations: []
  },
  {
    id: 'food-404',
    restaurantId: 'rest-4',
    restaurantName: 'Wok & Roll Noodle House',
    name: 'Steamed Pork & Shrimp Dumplings (6pcs)',
    category: 'Noodles',
    price: 8.50,
    description: 'Delicate handmade steamed dumplings stuffed with seasoned minced pork and fresh shrimp, served with aromatic chili soy dipping sauce.',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isVegan: false,
    isSpicy: false,
    isChefSpecial: false,
    rating: 4.8,
    ratingCount: 110,
    available: true,
    cookingTime: '10 min',
    customizations: []
  },
  {
    id: 'food-405',
    restaurantId: 'rest-4',
    restaurantName: 'Wok & Roll Noodle House',
    name: 'Sweet Thai Mango Sticky Rice',
    category: 'Desserts',
    price: 7.95,
    description: 'Warm glutinous rice cooked in rich sweetened coconut milk, served with fresh ripe sliced Thai honey mango and toasted sesame seeds.',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isVegan: true,
    isSpicy: false,
    isChefSpecial: false,
    rating: 4.8,
    ratingCount: 84,
    available: true,
    cookingTime: '5 min',
    customizations: []
  },

  // Restaurant 5: Fresh Greens & Bowls (Salads / Healthy)
  {
    id: 'food-501',
    restaurantId: 'rest-5',
    restaurantName: 'Fresh Greens & Bowls',
    name: 'Mediterranean Rainbow Quinoa Bowl',
    category: 'Salads',
    price: 13.75,
    description: 'Warm organic tricolor quinoa, roasted sweet potatoes, crispy chickpeas, baby spinach, cherry tomatoes, kalamata olives, and creamy lemon-tahini dressing.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isVegan: true,
    isSpicy: false,
    isChefSpecial: true,
    rating: 4.9,
    ratingCount: 154,
    available: true,
    cookingTime: '10-15 min',
    customizations: [
      {
        name: 'Add Protein',
        required: false,
        options: [
          { name: 'Grilled Herb Chicken', price: 3.50 },
          { name: 'Pan-Seared Organic Tofu', price: 2.50 },
          { name: 'Hass Avocado Half', price: 2.00 }
        ]
      }
    ]
  },
  {
    id: 'food-502',
    restaurantId: 'rest-5',
    restaurantName: 'Fresh Greens & Bowls',
    name: 'Grilled Chicken Caesar Salad',
    category: 'Salads',
    price: 14.50,
    description: 'Crisp romaine hearts tossed in scratch Caesar dressing with herb-marinated grilled chicken breast, sourdough garlic croutons, and shaved Parmigiano-Reggiano.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isVegan: false,
    isSpicy: false,
    isChefSpecial: false,
    rating: 4.8,
    ratingCount: 118,
    available: true,
    cookingTime: '12 min',
    customizations: []
  },
  {
    id: 'food-503',
    restaurantId: 'rest-5',
    restaurantName: 'Fresh Greens & Bowls',
    name: 'Avocado Goddess Superfood Salad',
    category: 'Salads',
    price: 13.95,
    description: 'Shredded Tuscan kale, baby arugula, edamame, sliced Hass avocado, cucumber ribbons, pumpkin seeds, and green goddess cilantro lime dressing.',
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isVegan: true,
    isSpicy: false,
    isChefSpecial: true,
    rating: 4.8,
    ratingCount: 92,
    available: true,
    cookingTime: '10 min',
    customizations: []
  },
  {
    id: 'food-504',
    restaurantId: 'rest-5',
    restaurantName: 'Fresh Greens & Bowls',
    name: 'Acai Berry Superfood Bowl',
    category: 'Desserts',
    price: 11.25,
    description: 'Frozen organic Brazilian acai blended with banana and almond milk, topped with gluten-free coconut granola, fresh blueberries, strawberries, and chia seeds.',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isVegan: true,
    isSpicy: false,
    isChefSpecial: false,
    rating: 4.9,
    ratingCount: 135,
    available: true,
    cookingTime: '5 min',
    customizations: []
  },
  {
    id: 'food-505',
    restaurantId: 'rest-5',
    restaurantName: 'Fresh Greens & Bowls',
    name: 'Cold-Pressed Green Detox Elixir',
    category: 'Beverages',
    price: 6.95,
    description: 'Pure cold-pressed juice of organic Granny Smith apples, cucumber, celery, baby spinach, fresh ginger, and Meyer lemon. Zero added sugar.',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isVegan: true,
    isSpicy: false,
    isChefSpecial: false,
    rating: 4.7,
    ratingCount: 65,
    available: true,
    cookingTime: '2 min',
    customizations: []
  },

  // Restaurant 6: Sweet Treats & Patisserie (Desserts / Bakery)
  {
    id: 'food-601',
    restaurantId: 'rest-6',
    restaurantName: 'Sweet Treats & Patisserie',
    name: 'Warm Belgian Chocolate Lava Cake',
    category: 'Desserts',
    price: 9.75,
    description: 'Decadent dark Valrhona chocolate sponge cake with a warm flowing molten center, served with Madagascan vanilla ice cream and raspberry coulis.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isVegan: false,
    isSpicy: false,
    isChefSpecial: true,
    rating: 4.9,
    ratingCount: 245,
    available: true,
    cookingTime: '12 min',
    customizations: [
      {
        name: 'Ice Cream Flavor',
        required: true,
        options: [
          { name: 'Bourbon Vanilla Bean', price: 0 },
          { name: 'Dark Chocolate Gelato', price: 0 },
          { name: 'Pistachio Gelato', price: 1.00 }
        ]
      }
    ]
  },
  {
    id: 'food-602',
    restaurantId: 'rest-6',
    restaurantName: 'Sweet Treats & Patisserie',
    name: 'New York Baked Berry Cheesecake',
    category: 'Desserts',
    price: 8.95,
    description: 'Velvety smooth cream cheese filling baked over a butter graham cracker crust, topped with fresh blueberry and strawberry compote.',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isVegan: false,
    isSpicy: false,
    isChefSpecial: false,
    rating: 4.8,
    ratingCount: 167,
    available: true,
    cookingTime: '3 min',
    customizations: []
  },
  {
    id: 'food-603',
    restaurantId: 'rest-6',
    restaurantName: 'Sweet Treats & Patisserie',
    name: 'French Macaron Gift Collection (6pcs)',
    category: 'Desserts',
    price: 14.50,
    description: 'Artisanal Parisian almond meringue shells filled with rich ganache: Salted Caramel, Dark Chocolate, Pistachio, Raspberry, Lemon, and Lavender Vanilla.',
    image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isVegan: false,
    isSpicy: false,
    isChefSpecial: true,
    rating: 4.9,
    ratingCount: 180,
    available: true,
    cookingTime: '2 min',
    customizations: []
  },
  {
    id: 'food-604',
    restaurantId: 'rest-6',
    restaurantName: 'Sweet Treats & Patisserie',
    name: 'Belgian Waffle with Fresh Strawberries',
    category: 'Desserts',
    price: 10.50,
    description: 'Golden, crispy pearl-sugar Belgian waffle piled with fresh sliced strawberries, warm Belgian chocolate drizzle, and homemade chantilly cream.',
    image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isVegan: false,
    isSpicy: false,
    isChefSpecial: false,
    rating: 4.8,
    ratingCount: 114,
    available: true,
    cookingTime: '10 min',
    customizations: []
  },
  {
    id: 'food-605',
    restaurantId: 'rest-6',
    restaurantName: 'Sweet Treats & Patisserie',
    name: 'Iced Vanilla Bean Latte',
    category: 'Beverages',
    price: 5.50,
    description: 'Double shot of house espresso, organic whole milk, and real crushed vanilla bean syrup served over ice.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isVegan: false,
    isSpicy: false,
    isChefSpecial: false,
    rating: 4.7,
    ratingCount: 88,
    available: true,
    cookingTime: '4 min',
    customizations: []
  },

  // Restaurant 7: El Sombrero Cantina (Mexican / Street Food)
  {
    id: 'food-701',
    restaurantId: 'rest-7',
    restaurantName: 'El Sombrero Cantina',
    name: 'Crispy Birria Quesatacos Trio',
    category: 'Burgers', // street food snack
    price: 15.95,
    description: 'Three crispy griddled corn tortillas stuffed with slow-cooked shredded beef birria and melted Oaxaca cheese, served with rich consomme broth for dipping.',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isVegan: false,
    isSpicy: true,
    isChefSpecial: true,
    rating: 4.9,
    ratingCount: 215,
    available: true,
    cookingTime: '15-20 min',
    customizations: [
      {
        name: 'Salsa Heat Level',
        required: true,
        options: [
          { name: 'Mild Salsa Verde (Tomatillo)', price: 0 },
          { name: 'Hot Roasted Habanero', price: 0.50 }
        ]
      }
    ]
  },
  {
    id: 'food-702',
    restaurantId: 'rest-7',
    restaurantName: 'El Sombrero Cantina',
    name: 'Chipotle Chicken Burrito Bowl',
    category: 'Salads',
    price: 13.95,
    description: 'Cilantro-lime brown rice, slow-braised chipotle chicken, black beans, charred sweet corn salsa, guacamole, and queso fresco.',
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
    isVeg: false,
    isVegan: false,
    isSpicy: true,
    isChefSpecial: false,
    rating: 4.8,
    ratingCount: 140,
    available: true,
    cookingTime: '12 min',
    customizations: []
  },
  {
    id: 'food-703',
    restaurantId: 'rest-7',
    restaurantName: 'El Sombrero Cantina',
    name: 'Warm Cinnamon Sugar Churros',
    category: 'Desserts',
    price: 7.25,
    description: 'Crispy golden fried dough pastries tossed in cinnamon sugar, served with warm dulce de leche and Mexican chocolate dipping sauce.',
    image: 'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isVegan: false,
    isSpicy: false,
    isChefSpecial: false,
    rating: 4.9,
    ratingCount: 172,
    available: true,
    cookingTime: '8 min',
    customizations: []
  },
  {
    id: 'food-704',
    restaurantId: 'rest-7',
    restaurantName: 'El Sombrero Cantina',
    name: 'Fresh Guacamole & Tortilla Chips',
    category: 'Salads',
    price: 8.50,
    description: 'Fresh Hass avocados mashed to order with lime, diced red onions, jalapenos, and fresh cilantro, served with house-fried sea salt tortilla chips.',
    image: 'https://images.unsplash.com/photo-1541288097308-7b8e3f58c4c6?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isVegan: true,
    isSpicy: false,
    isChefSpecial: false,
    rating: 4.8,
    ratingCount: 122,
    available: true,
    cookingTime: '5 min',
    customizations: []
  },
  {
    id: 'food-705',
    restaurantId: 'rest-7',
    restaurantName: 'El Sombrero Cantina',
    name: 'Traditional Horchata Fresca',
    category: 'Beverages',
    price: 4.50,
    description: 'Refreshing homemade Mexican drink prepared with sweet rice milk, cinnamon bark, pure vanilla, and served chilled over crushed ice.',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isVegan: true,
    isSpicy: false,
    isChefSpecial: false,
    rating: 4.7,
    ratingCount: 79,
    available: true,
    cookingTime: '2 min',
    customizations: []
  },

  // Restaurant 8: The Daily Grind Cafe & Brews (Beverages / Cafe)
  {
    id: 'food-801',
    restaurantId: 'rest-8',
    restaurantName: 'The Daily Grind Cafe & Brews',
    name: 'Nitro Cold Brew with Sweet Vanilla Foam',
    category: 'Beverages',
    price: 5.75,
    description: 'Single-origin Ethiopian coffee steeped for 24 hours, nitrogen-infused for a creamy cascading Guinness-style body, topped with sweet cream cold foam.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isVegan: false,
    isSpicy: false,
    isChefSpecial: true,
    rating: 4.9,
    ratingCount: 198,
    available: true,
    cookingTime: '3 min',
    customizations: [
      {
        name: 'Milk / Cream Option',
        required: true,
        options: [
          { name: 'Sweet Dairy Cream', price: 0 },
          { name: 'Oat Milk Cream Foam', price: 0.75 },
          { name: 'Black (No Sweet Cream)', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'food-802',
    restaurantId: 'rest-8',
    restaurantName: 'The Daily Grind Cafe & Brews',
    name: 'Artisan Avocado & Sourdough Toast',
    category: 'Salads',
    price: 11.50,
    description: 'Thick toasted artisanal levain sourdough topped with smashed Hass avocado, heirloom cherry tomatoes, crumbled Danish feta, and everything bagel seasoning.',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isVegan: false,
    isSpicy: false,
    isChefSpecial: false,
    rating: 4.8,
    ratingCount: 145,
    available: true,
    cookingTime: '8 min',
    customizations: [
      {
        name: 'Egg Option',
        required: false,
        options: [
          { name: 'Add Poached Farm Egg', price: 2.00 },
          { name: 'Add Smoked Salmon', price: 4.00 }
        ]
      }
    ]
  },
  {
    id: 'food-803',
    restaurantId: 'rest-8',
    restaurantName: 'The Daily Grind Cafe & Brews',
    name: 'Mango Passionfruit Sunshine Smoothie',
    category: 'Beverages',
    price: 6.75,
    description: 'Tropical blend of golden Alfonso mango chunks, tangy passionfruit puree, Greek yogurt, and coconut water.',
    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isVegan: false,
    isSpicy: false,
    isChefSpecial: false,
    rating: 4.8,
    ratingCount: 112,
    available: true,
    cookingTime: '4 min',
    customizations: []
  },
  {
    id: 'food-804',
    restaurantId: 'rest-8',
    restaurantName: 'The Daily Grind Cafe & Brews',
    name: 'Flaky French Butter Croissant',
    category: 'Desserts',
    price: 4.25,
    description: 'Traditional laminated pastry made with Normandy butter, baked to golden perfection with a shatteringly crisp exterior and soft honeycomb interior.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isVegan: false,
    isSpicy: false,
    isChefSpecial: false,
    rating: 4.7,
    ratingCount: 96,
    available: true,
    cookingTime: '2 min',
    customizations: []
  },
  {
    id: 'food-805',
    restaurantId: 'rest-8',
    restaurantName: 'The Daily Grind Cafe & Brews',
    name: 'Iced Caramel Macchiato Supreme',
    category: 'Beverages',
    price: 5.95,
    description: 'Freshly steamed milk marked with rich espresso shots, infused with Madagascan vanilla syrup and crowned with buttery caramel drizzle.',
    image: 'https://images.unsplash.com/photo-1578314670553-33e164478170?auto=format&fit=crop&w=800&q=80',
    isVeg: true,
    isVegan: false,
    isSpicy: false,
    isChefSpecial: false,
    rating: 4.8,
    ratingCount: 130,
    available: true,
    cookingTime: '4 min',
    customizations: []
  }
];

export const INITIAL_PROMO_CODES = [
  {
    code: 'FOODIE20',
    discountPercent: 20,
    minOrder: 15.00,
    maxDiscount: 15.00,
    description: '20% off on all orders above $15'
  },
  {
    code: 'FREEDEL',
    discountType: 'free_delivery',
    minOrder: 15.00,
    description: 'Free delivery on orders above $15'
  },
  {
    code: 'WELCOME50',
    discountAmount: 5.00,
    minOrder: 25.00,
    description: '$5 off on orders above $25'
  },
  {
    code: 'FLAT10',
    discountAmount: 10.00,
    minOrder: 40.00,
    description: 'Flat $10 off on orders above $40'
  },
  {
    code: 'HUNGRY15',
    discountPercent: 15,
    minOrder: 30.00,
    maxDiscount: 12.00,
    description: '15% off on orders above $30'
  }
];

export const INITIAL_USERS = [
  {
    id: 'user-customer',
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    phone: '+1 (555) 234-5678',
    role: 'customer',
    avatar: 'SC',
    addresses: [
      {
        id: 'addr-1',
        title: 'Home',
        recipient: 'Sarah Connor',
        phone: '+1 (555) 234-5678',
        street: 'Apt 4B, 742 Evergreen Terrace',
        area: 'Westside Residential',
        city: 'Springfield',
        state: 'OR',
        postalCode: '97477',
        isDefault: true,
        instructions: 'Please ring the doorbell and leave package on the porch.'
      },
      {
        id: 'addr-2',
        title: 'Work / Office',
        recipient: 'Sarah Connor',
        phone: '+1 (555) 234-5678',
        street: 'Suite 300, 100 Tech Boulevard',
        area: 'Cyber Center',
        city: 'Springfield',
        state: 'OR',
        postalCode: '97477',
        isDefault: false,
        instructions: 'Deliver to reception on the 3rd floor.'
      }
    ]
  },
  {
    id: 'user-owner',
    name: 'Chef Marco Rossi',
    email: 'chef.marco@example.com',
    phone: '+1 (555) 890-1234',
    role: 'owner',
    restaurantId: 'rest-1',
    restaurantName: 'Bella Italia Trattoria',
    avatar: 'MR',
    addresses: []
  },
  {
    id: 'user-admin',
    name: 'Alex Admin',
    email: 'admin@foodorder.com',
    phone: '+1 (555) 999-0000',
    role: 'admin',
    avatar: 'AA',
    addresses: []
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'FO-98214',
    userId: 'user-customer',
    userName: 'Sarah Connor',
    userEmail: 'sarah@example.com',
    restaurantId: 'rest-1',
    restaurantName: 'Bella Italia Trattoria',
    restaurantImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
    items: [
      {
        foodId: 'food-101',
        name: 'Margherita Pizza Di Bufala',
        price: 15.99,
        quantity: 1,
        customizations: ['Crust Type: Classic Neapolitan Crust'],
        subtotal: 15.99
      },
      {
        foodId: 'food-104',
        name: 'Tiramisu Tradizionale',
        price: 8.50,
        quantity: 1,
        customizations: [],
        subtotal: 8.50
      }
    ],
    subtotal: 24.49,
    deliveryFee: 1.99,
    tax: 1.96,
    discount: 4.90,
    promoCode: 'FOODIE20',
    total: 23.54,
    deliveryAddress: {
      recipient: 'Sarah Connor',
      phone: '+1 (555) 234-5678',
      street: 'Apt 4B, 742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      postalCode: '97477'
    },
    paymentMethod: 'Credit Card (ending 4242)',
    status: 'delivered',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    statusHistory: [
      { status: 'pending', timestamp: new Date(Date.now() - 86400000 * 2).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), note: 'Order placed by customer' },
      { status: 'preparing', timestamp: new Date(Date.now() - 86400000 * 2 + 300000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), note: 'Chef confirmed order and started preparation' },
      { status: 'out_for_delivery', timestamp: new Date(Date.now() - 86400000 * 2 + 1500000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), note: 'Delivery courier picked up package' },
      { status: 'delivered', timestamp: new Date(Date.now() - 86400000 * 2 + 2400000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), note: 'Delivered to recipient on porch' }
    ]
  },
  {
    id: 'FO-98452',
    userId: 'user-customer',
    userName: 'Sarah Connor',
    userEmail: 'sarah@example.com',
    restaurantId: 'rest-2',
    restaurantName: 'The Burger Foundry',
    restaurantImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
    items: [
      {
        foodId: 'food-201',
        name: 'Double Smash Truffle Burger',
        price: 14.95,
        quantity: 2,
        customizations: ['Side Choice: Seasoned French Fries'],
        subtotal: 29.90
      },
      {
        foodId: 'food-204',
        name: 'Salted Caramel Pretzel Shake',
        price: 6.50,
        quantity: 1,
        customizations: [],
        subtotal: 6.50
      }
    ],
    subtotal: 36.40,
    deliveryFee: 2.49,
    tax: 2.91,
    discount: 5.00,
    promoCode: 'WELCOME50',
    total: 36.80,
    deliveryAddress: {
      recipient: 'Sarah Connor',
      phone: '+1 (555) 234-5678',
      street: 'Apt 4B, 742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      postalCode: '97477'
    },
    paymentMethod: 'UPI (sarah@okbank)',
    status: 'delivered',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    statusHistory: [
      { status: 'pending', timestamp: '12:30 PM', note: 'Order placed' },
      { status: 'preparing', timestamp: '12:35 PM', note: 'Kitchen preparing order' },
      { status: 'out_for_delivery', timestamp: '12:55 PM', note: 'Out for delivery' },
      { status: 'delivered', timestamp: '01:15 PM', note: 'Order successfully delivered' }
    ]
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    restaurantId: 'rest-1',
    foodId: 'food-101',
    userName: 'Sarah Connor',
    userAvatar: 'SC',
    rating: 5,
    date: '2 days ago',
    comment: 'The crust on the Margherita Di Bufala was exceptional! Perfect blistered char from the wood oven and the fresh basil smelled heavenly.',
    helpfulCount: 14
  },
  {
    id: 'rev-2',
    restaurantId: 'rest-2',
    foodId: 'food-201',
    userName: 'David Miller',
    userAvatar: 'DM',
    rating: 5,
    date: '1 week ago',
    comment: 'Best smash burger in town hands down! The caramelized onions and truffle aioli took it to another level.',
    helpfulCount: 28
  },
  {
    id: 'rev-3',
    restaurantId: 'rest-3',
    foodId: 'food-301',
    userName: 'Elena Rostova',
    userAvatar: 'ER',
    rating: 5,
    date: '3 days ago',
    comment: 'The dragon roll was fresh, beautifully plated, and arrived in insulated packaging perfectly chilled. Will definitely order again!',
    helpfulCount: 9
  }
];

