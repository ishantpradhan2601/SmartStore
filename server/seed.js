const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Sale = require('./models/Sale');

dotenv.config();

const sampleProducts = [
  {
    name: 'AeroSound Pro Headset',
    category: 'Electronics',
    price: 199.99,
    costPrice: 95.0,
    stock: 8, // Low Stock for alerts!
    sku: 'SKU-AEROSOUND-01',
    description: 'Elite noise-canceling over-ear headphones with custom spatial audio profiles and 40-hour ultra-charge life.',
    aiDescription: 'Elevate your acoustic experience with the AeroSound Pro Headset. Equipped with custom-engineered spatial audio and advanced active noise-canceling circuitry, these over-ear headphones transport you directly into the center of the soundstage. Enjoy pristine highs, rich mids, and a thunderous low-end. Engineered with soft-touch memory-foam ear cushions, they remain incredibly comfortable for marathon listening sessions. Complete with a 40-hour battery, they are your ultimate audio companion.',
    aiTags: ['headphones', 'wireless', 'noise-canceling', 'premium-audio', 'spatial-sound', 'tech'],
    aiCaption: '🎧 Sound like you have never heard before. Immerse yourself in total clarity with the AeroSound Pro Headset. Custom spatial audio, 40-hour battery, and perfect noise isolation. ✨ Buy now and feel the music! #PremiumSound #AeroSound #WirelessAudio'
  },
  {
    name: 'Quantum LED Desk Lamp',
    category: 'Home & Garden',
    price: 64.5,
    costPrice: 28.0,
    stock: 24,
    sku: 'SKU-QUANTUM-LED',
    description: 'Smart ambient desk lamp with temperature sliders, wireless phone charging, and voice assistant sync.',
    aiDescription: 'Brighten your workspace smart with the Quantum LED Desk Lamp. Featuring integrated wireless charging at the base and customizable temperature settings, this sleek minimalist fixture is optimized to prevent eye strain. Program specific profiles from sunset warm to active studio white, and sync directly with your Alexa or Google Home system.',
    aiTags: ['desk-lamp', 'smart-home', 'led-lighting', 'office-setup', 'wireless-charging'],
    aiCaption: '💡 Upgrade your desk aesthetic with the Quantum LED Desk Lamp! Wireless phone charging base + custom ambiance modes. Perfect for late-night creators. 🚀 Get yours today! #DeskGoals #MinimalistSetup #SmartLighting'
  },
  {
    name: 'FitPulse V2 Smart Band',
    category: 'Sports',
    price: 89.0,
    costPrice: 42.0,
    stock: 5, // Low Stock!
    sku: 'SKU-FITPULSE-V2',
    description: 'High-accuracy fitness band tracking heart-rate, VO2 max, sleep patterns, and 28 dedicated sport exercises.',
    aiDescription: 'Meet your personal health architect: FitPulse V2. Featuring an ultra-slim chassis, vibrant OLED display, and 50-meter water resistance, it continuously measures biological markers. Unlock comprehensive insights about sleep stages and heart rate recovery to unlock peak athletic performance.',
    aiTags: ['fitness-tracker', 'smart-watch', 'wearables', 'sports-gear', 'heart-rate-monitor'],
    aiCaption: '🏃‍♂️ Consistency starts with tracking. Optimize your training cycles, recovery scores, and daily health metrics with the sleek FitPulse V2. Water-resistant up to 50m! 🌟 Stay active, stay smart. #FitnessTracker #HealthMatters #SportsLife'
  },
  {
    name: 'Organic Roast Espresso Blend',
    category: 'Food & Beverage',
    price: 18.99,
    costPrice: 6.5,
    stock: 140,
    sku: 'SKU-COFFEE-ESP',
    description: 'Single-origin organic dark roast beans sourced directly from certified ethical farms in Colombia.',
    aiDescription: 'Awaken your senses with our Organic Roast Espresso Blend. Meticulously slow-roasted in micro-batches, this single-origin Colombian blend exudes intense, complex notes of dark cocoa and rich brown sugar. Sourced strictly from certified carbon-neutral cooperatives.',
    aiTags: ['espresso', 'coffee-beans', 'organic-food', 'artisan-roast', 'ethical-coffee'],
    aiCaption: '☕️ Fuel your day with pure ethical luxury. Slow-roasted organic beans with hints of cocoa and warm caramel. Taste the authentic single-origin Colombian rich roast! ❤️ Order fresh bags now. #CoffeeLover #EspressoShot #OrganicRoast'
  },
  {
    name: 'Nova Glow Facial Serum',
    category: 'Beauty',
    price: 49.0,
    costPrice: 15.0,
    stock: 35,
    sku: 'SKU-NOVAGLOW-03',
    description: 'Hydrating facial serum enriched with 15% Vitamin C, pure hyaluronic acid, and organic botanicals.',
    aiDescription: 'Unlock a radiant skin texture with Nova Glow. Engineered using a potent 15% Vitamin C core coupled with triple-weight Hyaluronic Acid, it instantly locks moisture, reduces micro-blemishes, and gives an ethereal glow.',
    aiTags: ['facial-serum', 'skincare', 'vitamin-c', 'beauty-routine', 'glow-serum'],
    aiCaption: '✨ Say hello to radiant skin with the Nova Glow Serum. 15% active Vitamin C and triple-action hyaluronic acid. Hydrates, plumps, and glows! 🌟 Nourish your beauty. #SkincareAddict #GlowUp #CleanBeauty'
  },
  {
    name: 'Apex Mechanical Keyboard',
    category: 'Electronics',
    price: 129.99,
    costPrice: 58.0,
    stock: 3, // Low Stock!
    sku: 'SKU-APEX-KEYBOARD',
    description: 'Hot-swappable tactile linear switches with RGB backlit illumination and dual wireless/wired options.',
    aiDescription: 'Indulge in tactile typing excellence with the Apex Mechanical Keyboard. Hot-swappable sockets let you customize switches on the fly, while the custom aircraft-grade aluminum alloy body ensures absolute structural rigidity during fast-paced coding or gaming.',
    aiTags: ['mechanical-keyboard', 'gaming-gear', 'hot-swappable', 'custom-keyboards', 'desk-decor'],
    aiCaption: '⌨️ Pure typing bliss is here. Customize on the fly with hot-swappable mechanical switches. Double-shot keycaps and fully addressable RGB lighting. 🎨 Elevate your workstation! #MechanicalKeyboard #TechSetup #Gamers'
  },
  {
    name: 'AeroCore Yoga Mat',
    category: 'Sports',
    price: 39.99,
    costPrice: 16.0,
    stock: 50,
    sku: 'SKU-AERO-YOGA',
    description: '6mm eco-friendly anti-slip yoga mat with guide lines and shoulder carrying strap.',
    aiDescription: 'Practice alignment and balance comfortably on our 6mm AeroCore Yoga Mat. Sourced from high-density TPE natural materials that are fully bio-degradable, it offers advanced joint cushioning and absolute non-slip traction under sweaty poses.',
    aiTags: ['yoga-mat', 'fitness-accessories', 'meditation-gear', 'workout', 'eco-friendly'],
    aiCaption: '🧘‍♀️ Find your balance on the eco-friendly AeroCore Yoga Mat. Non-slip, 6mm premium cushioning, and smart posture guidelines. Start your mindful journey today! 🌿 #YogaLife #Mindfulness #FitnessGear'
  },
  {
    name: 'Minimalist Leather Wallet',
    category: 'Clothing',
    price: 45.0,
    costPrice: 18.0,
    stock: 22,
    sku: 'SKU-WALLET-LEATH',
    description: 'Ultra-slim top-grain leather card holder with integrated RFID scanning protection.',
    aiDescription: 'Streamline your everyday carry with the Minimalist Leather Wallet. Designed with premium full-grain Italian leather, it holds up to 8 cards and cash securely while protecting your digital information with comprehensive built-in RFID blocking materials.',
    aiTags: ['leather-wallet', 'minimalist-wallet', 'everyday-carry', 'mens-fashion', 'accessories'],
    aiCaption: '💼 Ditch the pocket bulk! Swap to our ultra-slim, RFID-blocking Minimalist Leather Wallet. Handcrafted from premium top-grain Italian leather. 💎 Built to last. #EverydayCarry #MinimalistWallet #LeatherCraft'
  },
  {
    name: 'Eco-Smart Travel Mug',
    category: 'Home & Garden',
    price: 29.99,
    costPrice: 12.0,
    stock: 45,
    sku: 'SKU-TRAVELMUG-01',
    description: 'Double-walled vacuum insulated stainless steel travel mug. Keeps hot for 12h, cold for 24h.',
    aiDescription: 'Sip in convenience with the Eco-Smart Travel Mug. Constructed from premium kitchen-grade 18/8 stainless steel, its double-walled vacuum sealing guarantees heat conservation for up to 12 hours. Comes with an airtight leak-proof magnetic lid.',
    aiTags: ['travel-mug', 'insulated-bottle', 'coffee-cup', 'eco-friendly', 'commuter-style'],
    aiCaption: '☕️ Hot coffee for 12 hours, ice-cold water for 24. Take your favorite brew anywhere with the leak-proof, insulated Eco-Smart Travel Mug. 🚶‍♂️ Refill sustainable, live smart! #SustainableCommute #InsulatedMug #CoffeeToGo'
  },
  {
    name: 'HyperCharge Powerbank 20K',
    category: 'Electronics',
    price: 59.99,
    costPrice: 24.0,
    stock: 2, // Low stock!
    sku: 'SKU-POWER-20K',
    description: '20,000mAh external battery packs with 65W Power Delivery and triple rapid outports.',
    aiDescription: 'Never run out of power with the HyperCharge Powerbank 20K. Boasting a heavy 20,000mAh lithium-polymer core, it supports 65W high-speed USB-C Power Delivery, letting you charge compatible laptops, tablets, and phones simultaneously at peak charging speeds.',
    aiTags: ['powerbank', 'portable-charger', 'fast-charging', 'tech-gadgets', 'travel-accessories'],
    aiCaption: '⚡️ Heavy-duty power in your pocket. 20,000mAh capacity and 65W output—powerful enough to charge your USB-C laptop! Triple outlets mean you can charge everything at once. 🔋 Travel free! #HyperCharge #Gadgets #Powerbank'
  }
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Successfully connected to MongoDB.');

    // 1. Wipe current collections
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Sale.deleteMany({});
    console.log('Existing collections successfully cleared.');

    // 2. Create the main Demo User
    console.log('Seeding Demo User...');
    const demoUser = await User.create({
      name: 'Demo Store Owner',
      email: 'demo@smartstore.com',
      password: 'password123', // Will be hashed by mongoose pre-save hook
      storeName: 'TechnoGlow Boutique',
      role: 'admin',
    });
    console.log(`Demo User successfully created! ID: ${demoUser._id}`);

    // 3. Create Products for User
    console.log('Seeding products...');
    const productsData = sampleProducts.map((p) => ({
      ...p,
      user: demoUser._id,
    }));
    const createdProducts = await Product.create(productsData);
    console.log(`Successfully seeded ${createdProducts.length} products.`);

    // 4. Seed historical sales data over the last 90 days to populate Chart.js beautifully!
    console.log('Generating 75 high-fidelity historical sales entries...');
    const channels = ['online', 'in-store', 'marketplace'];
    const sales = [];

    const now = new Date();

    // Create a series of transactions spread over the last 90 days
    for (let i = 0; i < 75; i++) {
      // Pick a random product
      const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
      
      // Select quantity: usually 1 or 2, sometimes more for cheaper items
      const quantity = product.price < 30 ? Math.floor(Math.random() * 4) + 1 : Math.floor(Math.random() * 2) + 1;
      
      const totalAmount = product.price * quantity;
      
      // Scatter dates backward in time
      // Higher density of sales closer to the present to make the chart look nice and active!
      const daysAgo = Math.floor(Math.pow(Math.random(), 1.5) * 90);
      const saleDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      // Random hour
      saleDate.setHours(Math.floor(Math.random() * 12) + 9);
      saleDate.setMinutes(Math.floor(Math.random() * 60));

      sales.push({
        user: demoUser._id,
        product: product._id,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        totalAmount: Math.round(totalAmount * 100) / 100,
        channel: channels[Math.floor(Math.random() * channels.length)],
        date: saleDate,
      });
    }

    await Sale.create(sales);
    console.log(`Seeding complete. Successfully generated ${sales.length} orders.`);
    
    mongoose.connection.close();
    console.log('Database connection successfully closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
