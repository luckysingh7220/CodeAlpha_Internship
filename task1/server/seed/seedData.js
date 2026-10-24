const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('../models/Product');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const products = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description:
      'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and studio-quality sound. Features Bluetooth 5.3 and multipoint connectivity for seamless switching between devices.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    category: 'Electronics',
    brand: 'SoundWave',
    countInStock: 25,
    rating: 4.7,
    numReviews: 184,
  },
  {
    name: 'Ultra-Slim Laptop 15"',
    description:
      'Powerful yet portable laptop with a 15.6" 4K OLED display, latest-gen processor, 16GB RAM, and 512GB SSD. Perfect for professionals and creatives who need performance on the go.',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80',
    category: 'Electronics',
    brand: 'TechPro',
    countInStock: 12,
    rating: 4.8,
    numReviews: 256,
  },
  {
    name: 'Smart Fitness Watch',
    description:
      'Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and 100+ workout modes. Water-resistant to 50m with a vibrant AMOLED always-on display.',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    category: 'Electronics',
    brand: 'FitTech',
    countInStock: 40,
    rating: 4.5,
    numReviews: 312,
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description:
      'RGB backlit mechanical keyboard with hot-swappable switches, N-key rollover, and aircraft-grade aluminum frame. Comes with custom keycap set and detachable USB-C cable.',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
    category: 'Electronics',
    brand: 'KeyForge',
    countInStock: 30,
    rating: 4.6,
    numReviews: 89,
  },
  {
    name: 'Premium Leather Jacket',
    description:
      'Handcrafted genuine leather jacket with a modern slim-fit design. Features YKK zippers, quilted lining, and adjustable waist straps. Available in classic black.',
    price: 389.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80',
    category: 'Fashion',
    brand: 'UrbanEdge',
    countInStock: 15,
    rating: 4.4,
    numReviews: 67,
  },
  {
    name: 'Designer Sunglasses',
    description:
      'Polarized UV400 protection sunglasses with titanium frame and gradient lenses. Lightweight, durable, and perfect for any occasion. Includes premium carrying case.',
    price: 179.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80',
    category: 'Fashion',
    brand: 'LuxVision',
    countInStock: 50,
    rating: 4.3,
    numReviews: 145,
  },
  {
    name: 'Canvas Sneakers',
    description:
      'Classic low-top canvas sneakers with vulcanized rubber sole and breathable cotton upper. Timeless design that pairs perfectly with any casual outfit.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80',
    category: 'Fashion',
    brand: 'StreetStep',
    countInStock: 60,
    rating: 4.2,
    numReviews: 203,
  },
  {
    name: 'Minimalist Backpack',
    description:
      'Water-resistant everyday backpack with padded laptop compartment, hidden anti-theft pocket, and ergonomic shoulder straps. Made from recycled materials.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
    category: 'Fashion',
    brand: 'EcoCarry',
    countInStock: 35,
    rating: 4.6,
    numReviews: 178,
  },
  {
    name: 'Artisan Coffee Maker',
    description:
      'Pour-over coffee maker with borosilicate glass carafe, reusable stainless steel filter, and wooden collar grip. Brews barista-quality coffee in minutes.',
    price: 64.99,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80',
    category: 'Home',
    brand: 'BrewMaster',
    countInStock: 45,
    rating: 4.8,
    numReviews: 234,
  },
  {
    name: 'Smart LED Desk Lamp',
    description:
      'Adjustable LED desk lamp with wireless charging base, 5 color temperatures, and touch dimmer. Eye-care technology reduces blue light and flicker for comfortable reading.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=500&q=80',
    category: 'Home',
    brand: 'LumiPro',
    countInStock: 28,
    rating: 4.5,
    numReviews: 92,
  },
  {
    name: 'Ceramic Plant Pot Set',
    description:
      'Set of 3 handmade ceramic pots in graduated sizes with bamboo saucers. Matte finish with drainage holes. Perfect for succulents, herbs, or small houseplants.',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&q=80',
    category: 'Home',
    brand: 'GreenNest',
    countInStock: 55,
    rating: 4.7,
    numReviews: 156,
  },
  {
    name: 'Portable Bluetooth Speaker',
    description:
      'Compact 360° sound Bluetooth speaker with 20-hour battery, IPX7 waterproof rating, and built-in microphone. Pairs two speakers for immersive stereo sound.',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80',
    category: 'Electronics',
    brand: 'BassBoost',
    countInStock: 38,
    rating: 4.4,
    numReviews: 267,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected for seeding');

    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    const created = await Product.insertMany(products);
    console.log(`🌱 Seeded ${created.length} products`);

    await mongoose.connection.close();
    console.log('✅ Done! Database seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seed Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
