import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  // --- iPHONE 13 SERIES ---
  {
    id: 'iphone-13',
    name: 'iPhone 13',
    description: 'A total powerhouse. Superbright Super Retina XDR display. Durable flat-edge design. lightning-fast A15 Bionic chip.',
    category: 'iphones',
    price: 59900,
    discount: 16, // Approx ₹49,900
    colors: ['#004b6e', '#1c1d21', '#faf9f6', '#bf263c', '#dceef3'],
    colorNames: ['Blue', 'Midnight', 'Starlight', 'Product RED', 'Green'],
    storages: ['128GB', '256GB', '512GB'],
    specs: {
      'Display': '6.1-inch Super Retina XDR OLED',
      'Processor': 'A15 Bionic chip with 4-core GPU',
      'Camera': 'Advanced dual-camera system (12MP Main + Ultra Wide) with Cinematic mode',
      'Battery Life': 'Up to 19 hours video playback',
      'Durability': 'Ceramic Shield front, aerospace-grade aluminum border'
    },
    ratings: { average: 4.7, count: 184 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1632661674596-df8be070a585?auto=format&fit=crop&q=80&w=800', // Back view
      'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=800', // Front view
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800', // Side view
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=800', // Detail camera view
      'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=800'  // Multiple color variants
    ],
    stock: 25,
    isBestSeller: true
  },
  {
    id: 'iphone-13-mini',
    name: 'iPhone 13 Mini',
    description: 'Enormous capabilities packed into a pocket-sized design. Huge camera upgrades. Longer battery life. Superfast 5G.',
    category: 'iphones',
    price: 64900,
    discount: 23, // Approx ₹49,900
    colors: ['#1c1d21', '#faf9f6', '#004b6e', '#bf263c', '#faf4d3'],
    colorNames: ['Midnight', 'Starlight', 'Blue', 'Product RED', 'Pink'],
    storages: ['128GB', '256GB'],
    specs: {
      'Display': '5.4-inch Super Retina XDR OLED screen',
      'Processor': 'A15 Bionic premium chip with 16-core NE',
      'Camera': 'Dual 12MP system with Sensor-shift OIS tracking',
      'Battery Life': 'Up to 17 hours video playback',
      'Weight': 'Lightweight 141 grams pocket layout'
    },
    ratings: { average: 4.6, count: 98 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=800', // Back view
      'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=800', // Front view
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800', // Side view
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=800', // Detail camera view
      'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=800'  // Color variants
    ],
    stock: 12
  },
  {
    id: 'iphone-13-pro',
    name: 'iPhone 13 Pro',
    description: 'A massive Pro camera system upgrade. Super Retina XDR display with ProMotion. Breathtaking speed of A15 Bionic with 5-core GPU.',
    category: 'iphones',
    price: 119900,
    discount: 20, // Approx ₹95,900
    colors: ['#a7c4da', '#d1cfcd', '#faf9f6', '#2d3238'],
    colorNames: ['Sierra Blue', 'Silver', 'Gold', 'Graphite'],
    storages: ['128GB', '256GB', '512GB', '1TB'],
    specs: {
      'Display': '6.1-inch display with ProMotion adaptive refresh rate up to 120Hz',
      'Processor': 'A15 Bionic chip with 5-core GPU',
      'Camera': 'Pro 12MP camera system (Telephoto, Wide, Ultra Wide) with LiDAR Scanner',
      'Optical Zoom': '6x optical zoom scope',
      'Storage Capacity': 'High capacity up to 1TB options'
    },
    ratings: { average: 4.8, count: 215 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800', // Back view
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800', // Front view
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800', // Side view
      'https://images.unsplash.com/photo-1727181516086-44cedf3eeb88?auto=format&fit=crop&q=80&w=800', // Detail camera view
      'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?auto=format&fit=crop&q=80&w=800'  // Color options
    ],
    stock: 18
  },
  {
    id: 'iphone-13-pro-max',
    name: 'iPhone 13 Pro Max',
    description: 'The ultimate iPhone model of its generation. Largest battery life, immersive 120Hz display, and breathtaking low-light Pro camera capabilities.',
    category: 'iphones',
    price: 129900,
    discount: 19, // Approx ₹1,04,900
    colors: ['#a7c4da', '#2d3238', '#faf9f6', '#596956'],
    colorNames: ['Sierra Blue', 'Graphite', 'Gold', 'Alpine Green'],
    storages: ['128GB', '256GB', '512GB', '1TB'],
    specs: {
      'Display': '6.7-inch Super Retina XDR with ProMotion 120Hz',
      'Processor': 'A15 Bionic 5-core GPU ultra silicon',
      'Camera': 'Pro 12MP triple layout with Cinematic tracking focus',
      'Battery Life': 'Up to 28 hours video playback capacity'
    },
    ratings: { average: 4.9, count: 340 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800', // Back view
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800', // Front view
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800', // Side view
      'https://images.unsplash.com/photo-1727181516086-44cedf3eeb88?auto=format&fit=crop&q=80&w=800', // Camera detail
      'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?auto=format&fit=crop&q=80&w=800'  // Color variants
    ],
    stock: 8,
    isTrending: true
  },

  // --- iPHONE 14 SERIES ---
  {
    id: 'iphone-14',
    name: 'iPhone 14',
    description: 'With the most impressive dual-camera system on iPhone. Capture stunning photos in low light and bright light. Emergency SOS crash detection features.',
    category: 'iphones',
    price: 69900,
    discount: 14, // Approx ₹59,900
    colors: ['#232a35', '#faf9f6', '#004b6e', '#baa6cf', '#ffccd5'],
    colorNames: ['Midnight', 'Starlight', 'Blue', 'Purple', 'Pink'],
    storages: ['128GB', '256GB', '512GB'],
    specs: {
      'Display': '6.1-inch Super Retina XDR OLED screen',
      'Processor': 'A15 Bionic chip with advanced 5-core GPU',
      'Safety': 'Emergency SOS via satellite & Crash Detection',
      'Camera': 'Dual 12MP setup with customized Photonic Engine'
    },
    ratings: { average: 4.7, count: 124 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&q=80&w=800', // Back view
      'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=800', // Front view
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800', // Side view
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=800', // Alternate camera view
      'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=800'  // Multi-color stack
    ],
    stock: 30
  },
  {
    id: 'iphone-14-plus',
    name: 'iPhone 14 Plus',
    description: 'Think big with a larger 6.7-inch display and the best battery life ever on any standard iPhone model with dual rear setup.',
    category: 'iphones',
    price: 79900,
    discount: 13, // Approx ₹69,900
    colors: ['#232a35', '#faf9f6', '#ffccd5', '#baa6cf', '#d62246'],
    colorNames: ['Midnight', 'Starlight', 'Pink', 'Purple', 'Product RED'],
    storages: ['128GB', '256GB', '512GB'],
    specs: {
      'Display': 'Large 6.7-inch Super Retina XDR display',
      'Processor': 'A15 Bionic with 5-core GPU architecture',
      'Battery Life': 'Up to 26 hours movie runtime playback',
      'Safety': 'Dynamic Crash Detection mechanics'
    },
    ratings: { average: 4.6, count: 88 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&q=80&w=800', // Back view
      'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=800', // Front view
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800', // Side view
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=800', // Alternate closeup
      'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=800'  // Colorful grid
    ],
    stock: 22
  },
  {
    id: 'iphone-14-pro',
    name: 'iPhone 14 Pro',
    description: 'The magic of Dynamic Island. A vital 48MP camera for mind-blowing detail. Always-On display, fueled by the revolutionary A16 Bionic.',
    category: 'iphones',
    price: 129900,
    discount: 15, // Approx ₹1,09,900
    colors: ['#443f4c', '#e3e4e5', '#f4efe1', '#1f2022'],
    colorNames: ['Deep Purple', 'Silver', 'Gold', 'Space Black'],
    storages: ['128GB', '256GB', '512GB', '1TB'],
    specs: {
      'Display': '6.1-inch Always-On Super Retina XDR with Dynamic Island interface',
      'Processor': 'A16 Bionic 4nm silicon chip',
      'Camera': '48MP Main camera with up to 4x crop density',
      'Video Mode': 'ProRes, Action Mode, Cinematic 4K render',
      'Brightness': 'Up to 2000 nits high-reflectance outdoor brightness'
    },
    ratings: { average: 4.8, count: 410 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800', // Back view
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800', // Front view
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800', // Side view
      'https://images.unsplash.com/photo-1727181516086-44cedf3eeb88?auto=format&fit=crop&q=80&w=800', // View control
      'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?auto=format&fit=crop&q=80&w=800'  // Group lineup
    ],
    stock: 14,
    isFeatured: true
  },
  {
    id: 'iphone-14-pro-max',
    name: 'iPhone 14 Pro Max',
    description: 'The ultimate 6.7-inch iPhone Pro. Incorporates Always-On screen mechanics, 48MP main sensor arrays, and the super-efficient A16 Bionic.',
    category: 'iphones',
    price: 139900,
    discount: 14, // Approx ₹1,19,900
    colors: ['#1f2022', '#443f4c', '#e3e4e5', '#f4efe1'],
    colorNames: ['Space Black', 'Deep Purple', 'Silver', 'Gold'],
    storages: ['128GB', '256GB', '512GB', '1TB'],
    specs: {
      'Display': '6.7-inch Always-On Super Retina panel with Dynamic Island',
      'Processor': 'A16 Bionic premium gaming engine',
      'Camera': '48MP Pro camera with advanced 3x optical telephoto lens',
      'Battery Life': 'Up to 29 hours non-stop video playback'
    },
    ratings: { average: 4.9, count: 490 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800', // Back view
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800', // Front view
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800', // Side view
      'https://images.unsplash.com/photo-1727181516086-44cedf3eeb88?auto=format&fit=crop&q=80&w=800', // Camera block view
      'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?auto=format&fit=crop&q=80&w=800'  // Titanium variations
    ],
    stock: 10
  },

  // --- iPHONE 15 SERIES ---
  {
    id: 'iphone-15',
    name: 'iPhone 15',
    description: 'Dynamic Island comes to iPhone 15. Super-high-resolution 48MP Main camera. Durable color-infused glass and aluminum design. Standard USB-C.',
    category: 'iphones',
    price: 79900,
    discount: 13, // Approx ₹69,900
    colors: ['#1c1d21', '#dceef3', '#edfaf5', '#faf4d3', '#fce9e9'],
    colorNames: ['Black', 'Blue', 'Green', 'Yellow', 'Pink'],
    storages: ['128GB', '256GB', '512GB'],
    specs: {
      'Display': '6.1-inch Super Retina display featuring Dynamic Island technology',
      'Processor': 'A16 Bionic blazing quad processor',
      'Camera': '48MP Main sensor + 12MP Ultra Wide with sharp 2x telephoto crop',
      'Connectivity': 'Modern universal USB-C connector integration',
      'Body': 'Color-infused durable glass backdrop with textured matte finish'
    },
    ratings: { average: 4.7, count: 280 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&q=80&w=800', // Back view
      'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=800', // Front view
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800', // Side view
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=800', // Detail camera
      'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=800'  // Multiple choices
    ],
    stock: 45,
    isNewArrival: true
  },
  {
    id: 'iphone-15-plus',
    name: 'iPhone 15 Plus',
    description: 'Immersive 6.7-inch screen layouts with Dynamic Island support. Durable aerospace aluminum housing with color-infused glass back and USB-C.',
    category: 'iphones',
    price: 89900,
    discount: 11, // Approx ₹79,900
    colors: ['#dceef3', '#edfaf5', '#fce9e9', '#faf4d3', '#1c1d21'],
    colorNames: ['Blue', 'Green', 'Pink', 'Yellow', 'Black'],
    storages: ['128GB', '256GB', '512GB'],
    specs: {
      'Display': '6.7-inch large screen Super Retina panel',
      'Processor': 'A16 Bionic high performance chip',
      'Battery': 'Up to 26 hours continuous movie playback',
      'Camera': '48MP high fidelity dual camera layout'
    },
    ratings: { average: 4.8, count: 195 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&q=80&w=800', // Back view
      'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=800', // Front view
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800', // Side view
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=800', // Detail camera
      'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=800'  // Colorful range (back view detail)
    ],
    stock: 35
  },
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    description: 'Forged in titanium frame. Revolutionary A17 Pro chip. Customizable Action button. Breathtaking triple-lens details.',
    category: 'iphones',
    price: 134900,
    discount: 11, // Approx ₹1,19,900
    colors: ['#8c8780', '#2d3238', '#faf9f6', '#2b2a33'],
    colorNames: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
    storages: ['128GB', '256GB', '512GB', '1TB'],
    specs: {
      'Display': '6.1-inch Super Retina XDR with ProMotion 120Hz refresh speed',
      'Processor': 'A17 Pro system on chip featuring console-level GPU',
      'Body Material': 'Sturdy lightweight aerospace titanium alloy frame',
      'Action Button': 'Tactile physical button for custom quick macros',
      'Transfer speed': 'Screaming fast USB 3 transfer speeds up to 10Gb/s'
    },
    ratings: { average: 4.8, count: 395 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800', // Back view
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800', // Front view
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800', // Side view
      'https://images.unsplash.com/photo-1727181516086-44cedf3eeb88?auto=format&fit=crop&q=80&w=800', // Camera controls detail
      'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?auto=format&fit=crop&q=80&w=800'  // Triple titanium lineup
    ],
    stock: 20
  },
  {
    id: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max',
    description: 'Strong, lightweight titanium build. Extreme A17 Pro chip. Advanced optical zoom 5x Telephoto prime lens. Exquisite multi-image capabilities.',
    category: 'iphones',
    price: 159900,
    discount: 15, // Approx ₹1,34,900
    colors: ['#8c8780', '#2d3238', '#faf9f6', '#2b2a33'],
    colorNames: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
    storages: ['256GB', '512GB', '1TB'],
    specs: {
      'Display': '6.7-inch Always-On immersive OLED display panel',
      'Processor': 'A17 Pro game-ready architecture',
      'Camera': 'Pro 48MP main camera with extreme 5x optic telephoto lens',
      'Connectivity': 'USB 3 high speed data sync profiles'
    },
    ratings: { average: 4.9, count: 620 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800', // Back view
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800', // Front view
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800', // Side view
      'https://images.unsplash.com/photo-1727181516086-44cedf3eeb88?auto=format&fit=crop&q=80&w=800', // Closeup camera structure
      'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?auto=format&fit=crop&q=80&w=800'  // Stack of three phones
    ],
    stock: 15,
    isTrending: true
  },

  // --- iPHONE 16 SERIES ---
  {
    id: 'iphone-16',
    name: 'iPhone 16',
    description: 'Built for Apple Intelligence. Interactive Camera Control. High power A18 chip with 5-core graphics. Stunning high-contrast colors.',
    category: 'iphones',
    price: 89900,
    discount: 11, // Approx ₹79,900
    colors: ['#005d7f', '#de6fa1', '#1ae1c6', '#faf9f6', '#111215'],
    colorNames: ['Ultramarine', 'Pink', 'Teal', 'White', 'Black'],
    storages: ['128GB', '256GB', '512GB'],
    specs: {
      'AI Engine': 'Native local support for Apple Intelligence',
      'Display': '6.1-inch Super Retina XDR OLED display',
      'Processor': 'A18 system chip built on second-generation 3nm technology',
      'Controls': 'Advanced state-of-the-art Camera Control tactile button slider',
      'Camera': '48MP Fusion main lens + 12MP Ultra Wide with precise Macro focusing'
    },
    ratings: { average: 4.8, count: 320 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&q=80&w=800', // Back view
      'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=800', // Front view
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800', // Side view
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=800', // Camera design profile
      'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=800'  // Multiple color options stack
    ],
    stock: 50,
    isNewArrival: true,
    isFeatured: true
  },
  {
    id: 'iphone-16-plus',
    name: 'iPhone 16 Plus',
    description: 'Expanded 6.7-inch display workspace. Formed to process complex local Apple Intelligence requests. Unrivaled battery life. Dynamic button layout.',
    category: 'iphones',
    price: 99900,
    discount: 10, // Approx ₹89,900
    colors: ['#005d7f', '#1ae1c6', '#de6fa1', '#faf9f6', '#111215'],
    colorNames: ['Ultramarine', 'Teal', 'Pink', 'White', 'Black'],
    storages: ['128GB', '256GB', '512GB'],
    specs: {
      'AI Engine': 'Full support for contextual Apple Intelligence models',
      'Display': '6.7-inch cinematic Super Retina OLED screen',
      'Battery life': 'Up to 27 hours high-capacity video streaming time',
      'Camera Access': 'Camera Control button with responsive sensory scroll feed'
    },
    ratings: { average: 4.7, count: 180 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&q=80&w=800', // Back view
      'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=800', // Front view
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800', // Side view
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=800', // Detail camera
      'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=800'  // Variant stacks
    ],
    stock: 40
  },
  {
    id: 'iphone-16-pro',
    name: 'iPhone 16 Pro',
    description: 'Formed in grade 5 titanium. Slimmer border for 6.3-inch immersive viewport. Dedicated Camera Control toggle. Power of A18 Pro.',
    category: 'iphones',
    price: 129900,
    discount: 7, // Approx ₹1,19,900
    colors: ['#cca185', '#8c8780', '#faf9f6', '#2b2a33'],
    colorNames: ['Desert Titanium', 'Natural Titanium', 'White Titanium', 'Black Titanium'],
    storages: ['128GB', '256GB', '512GB', '1TB'],
    specs: {
      'Screen size': '6.3-inch edge-to-edge bright dynamic active panel',
      'Processor': 'A18 Pro with outstanding ray tracing and high-efficiency performance',
      'Camera': '48MP Fusion + 48MP Ultra Wide + 12MP 5x telephoto optical camera',
      'Audio system': 'Four reference quality studio microphones with Spatial Audio capture mode',
      'Thermals': 'Innovative thermal chassis for optimal frame rate gaming preservation'
    },
    ratings: { average: 4.9, count: 480 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800', // Back view
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800', // Front view
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800', // Side view
      'https://images.unsplash.com/photo-1727181516086-44cedf3eeb88?auto=format&fit=crop&q=80&w=800', // Side bezel close up
      'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?auto=format&fit=crop&q=80&w=800'  // Group lineup
    ],
    stock: 35,
    isFeatured: true
  },
  {
    id: 'iphone-16-pro-max',
    name: 'iPhone 16 Pro Max',
    description: 'The pinnacle of mobile excellence. Massive 6.9-inch display with ultimate micro borders. Grade 5 Titanium armor. A18 Pro processing speeds.',
    category: 'iphones',
    price: 159900,
    discount: 9, // Approx ₹1,44,900
    colors: ['#cca185', '#8c8780', '#faf9f6', '#2b2a33'],
    colorNames: ['Desert Titanium', 'Natural Titanium', 'White Titanium', 'Black Titanium'],
    storages: ['256GB', '512GB', '1TB'],
    specs: {
      'Display': 'Massive 6.9-inch edge-to-edge screen with razor thin bezels',
      'Processor': 'A18 Pro master chipset with 6-core graphics processor unit',
      'Pro Video': 'Vibrant 4K 120 fps Dolby Vision capture modes',
      'Audio capture': 'Spatial studio microphone array with custom wind filters',
      'Efficiency': 'Industry leader in cellular runtime and background power savings'
    },
    ratings: { average: 4.9, count: 1250 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800', // Back view
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800', // Front view
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800', // Side view
      'https://images.unsplash.com/photo-1727181516086-44cedf3eeb88?auto=format&fit=crop&q=80&w=800', // Detail camera
      'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?auto=format&fit=crop&q=80&w=800'  // Metallic variants stack
    ],
    stock: 25,
    isBestSeller: true,
    isTrending: true
  },
  
  // --- iPAD SERIES ---
  {
    id: 'ipad-pro-m4',
    name: 'iPad Pro (M4)',
    description: 'The thinnest Apple product ever. Impossibly thin design. Blazing-fast Apple M4 chip. Breakthrough Ultra Retina XDR Tandem OLED screen.',
    category: 'ipads',
    price: 99900,
    discount: 5,
    colors: ['#2e2f30', '#e3e4e6'],
    colorNames: ['Space Black', 'Silver'],
    storages: ['256GB', '512GB', '1TB', '2TB'],
    specs: {
      'Display': '11-inch or 13-inch Ultra Retina XDR Tandem OLED dual panel',
      'Processor': 'Apple M4 silicon with up to 10-core CPU tracking speed',
      'Memory bandwidth': '120GB/s high speed multithreading support',
      'Pencil support': 'Works flawlessly with Apple Pencil Pro & Magic Keyboard'
    },
    ratings: { average: 4.8, count: 142 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 20,
    isFeatured: true
  },
  {
    id: 'ipad-air-m2',
    name: 'iPad Air (M2)',
    description: 'Fresh color finishes. Now available in 11-inch or 13-inch liquid display options. Supercharged by Apple M2 silicon for students and professionals.',
    category: 'ipads',
    price: 59900,
    discount: 8,
    colors: ['#1c1d21', '#faf9f6', '#dedfea', '#bfdfdf'],
    colorNames: ['Space Gray', 'Starlight', 'Blue', 'Purple'],
    storages: ['128GB', '256GB', '512GB', '1TB'],
    specs: {
      'Display': '11-inch Liquid Retina display with True Tone technology',
      'Processor': 'Apple M2 chip with 8-core CPU and 10-core graphics design'
    },
    ratings: { average: 4.7, count: 85 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 15
  },

  // --- MacBooks ---
  {
    id: 'macbook-pro-m4',
    name: 'MacBook Pro 14"',
    description: 'Mind-blowing performance. Stunning Liquid Retina XDR screen. Exceptional 24-hour battery endurance. M4 master layout silicon.',
    category: 'macbooks',
    price: 169900,
    discount: 7,
    colors: ['#252526', '#d2d3d5'],
    colorNames: ['Space Black', 'Silver'],
    storages: ['512GB SSD', '1TB SSD', '2TB SSD'],
    specs: {
      'Display': '14.2-inch Liquid Retina XDR screen with up to 1600 nits peak brightness',
      'Processor': 'Apple M4, M4 Pro or M4 Max chip supporting Apple Intelligence cores',
      'Memory': 'Supports up to 128GB unified RAM processing storage',
      'Ports': 'Thunderbolt 4, HDMI, SDXC, MagSafe 3'
    },
    ratings: { average: 4.9, count: 210 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 12,
    isFeatured: true,
    isTrending: true
  },
  {
    id: 'macbook-air-m3',
    name: 'MacBook Air 13" (M3)',
    description: 'Lean. Mean. Apple Silicon machine. Impossibly thin chassis. Jaw-dropping 18-hour continuous battery life. Perfect companion for dynamic life.',
    category: 'macbooks',
    price: 99900,
    discount: 10,
    colors: ['#1c1d21', '#faf9f6', '#dcd8cf', '#d2d3d5'],
    colorNames: ['Midnight', 'Starlight', 'Space Gray', 'Silver'],
    storages: ['256GB SSD', '512GB SSD'],
    specs: {
      'Display': '13.6-inch Liquid Retina Display with 500 nits brightness levels',
      'Processor': 'Apple M3 silicon with 8-core CPU and up to 10-core GPU engine'
    },
    ratings: { average: 4.8, count: 320 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 30,
    isBestSeller: true
  },

  // --- AirPods ---
  {
    id: 'airpods-pro-2',
    name: 'AirPods Pro (2nd Gen)',
    description: 'Rebuilt from the sound up. Advanced Active Noise Cancellation. Adaptive Audio filters. Transparency mode. Incredible Personalized Spatial soundscapes.',
    category: 'airpods',
    price: 24900,
    discount: 12,
    colors: ['#ffffff'],
    colorNames: ['White'],
    storages: ['Standard Case'],
    specs: {
      'Chipset': 'Apple H2 Silicon audio driver supporting adaptive transparency',
      'Noise Cancelling': 'Up to 2x more active cancellation than earlier AirPods Pro models',
      'Battery': 'Up to 6 hours listen time on a single charge with active ANC'
    },
    ratings: { average: 4.8, count: 830 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1588449668338-d15176d14719?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 50,
    isTrending: true
  },
  {
    id: 'airpods-4-anc',
    name: 'AirPods 4 (with ANC)',
    description: 'The standard icon rewritten. Experience active noise cancellation in an open-ear design. Power of H2 silicon. All-day customized fit.',
    category: 'airpods',
    price: 17900,
    discount: 5,
    colors: ['#ffffff'],
    colorNames: ['White'],
    storages: ['Standard Case'],
    specs: {
      'Acoustics': 'Custom high-excursion Apple driver with personalized spatial audio'
    },
    ratings: { average: 4.6, count: 180 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1588449668338-d15176d14719?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 40
  },

  // --- Watch ---
  {
    id: 'apple-watch-ultra-2',
    name: 'Apple Watch Ultra 2',
    description: 'The ultimate sports and adventure watch. Powered by Apple Silicon S9 SiP. The brightest display ever. Customized Action Button shortcuts.',
    category: 'watches',
    price: 89900,
    discount: 6,
    colors: ['#cca185', '#b5b4b2'],
    colorNames: ['Indigo Loop', 'Olive Alpine'],
    storages: ['49mm GPS + Cellular'],
    specs: {
      'Case': '49mm aerospace-grade titanium case structure with absolute screen shield',
      'Display': 'Always-On Retina peak OLED matching 3000 nits brightness standards',
      'Battery': 'Up to 36 hours standard operation, 72 hours low battery savings mode'
    },
    ratings: { average: 4.9, count: 244 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 18,
    isFeatured: true,
    isBestSeller: true
  },
  {
    id: 'apple-watch-series-10',
    name: 'Apple Watch Series 10',
    description: 'The thinnest design yet with the largest, most advanced display. Breakthrough health insights like sleep apnea detection. Fast charging cycles.',
    category: 'watches',
    price: 46900,
    discount: 8,
    colors: ['#222325', '#e9e8e5', '#eccbb5'],
    colorNames: ['Jet Black Aluminum', 'Silver Aluminum', 'Rose Gold'],
    storages: ['42mm', '46mm'],
    specs: {
      'Thickness': 'Sleek 9.7mm profile bezel casing size options',
      'Display': 'Wide-angle OLED Always-on retina panel with fluid responsive layouts'
    },
    ratings: { average: 4.8, count: 410 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 25,
    isTrending: true
  },
  // --- iPHONE 11 ---
  {
    id: 'iphone-11',
    name: 'iPhone 11',
    description: 'Just the right amount of everything. Dual-camera system. All-day battery life. Toughest glass in a smartphone and Apple A13 Bionic fast silicon.',
    category: 'iphones',
    price: 38905,
    discount: 5,
    colors: ['#000000', '#ffffff', '#ff3b30', '#ffe600', '#c2f5e9'],
    colorNames: ['Black', 'White', 'Product RED', 'Yellow', 'Green'],
    storages: ['64GB', '128GB'],
    specs: {
      'Display': '6.1-inch Liquid Retina HD LCD screen',
      'Processor': 'A13 Bionic chip with third-generation Neural Engine',
      'Camera': 'Dual 12MP Ultra Wide and Wide cameras with Night mode and 4K video',
      'Water Resistance': 'IP68 rated (maximum depth of 2 meters up to 30 minutes)'
    },
    ratings: { average: 4.6, count: 710 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 12
  },
  // --- iPHONE 11 PRO ---
  {
    id: 'iphone-11-pro',
    name: 'iPhone 11 Pro',
    description: 'A transformative triple‑camera system that adds tons of capability without complexity. An unprecedented leap in battery life and Super Retina XDR OLED.',
    category: 'iphones',
    price: 49900,
    discount: 10,
    colors: ['#3e4340', '#d2d3d5', '#f1ebd9'],
    colorNames: ['Midnight Green', 'Silver', 'Gold'],
    storages: ['64GB', '256GB'],
    specs: {
      'Display': '5.8-inch Super Retina XDR OLED display',
      'Processor': 'A13 Bionic chip with fast machine learning speed',
      'Camera': 'Triple 12MP Ultra Wide, Wide, and Telephoto cameras with Night mode'
    },
    ratings: { average: 4.7, count: 540 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 8
  },
  // --- iPHONE 12 ---
  {
    id: 'iphone-12',
    name: 'iPhone 12',
    description: 'Let there be light. Superfast 5G connectivity. A14 Bionic, the fastest chip in a smartphone. An edge-to-edge OLED display. Ceramic Shield durability.',
    category: 'iphones',
    price: 49905,
    discount: 8,
    colors: ['#222325', '#ffffff', '#004b6e', '#baa6cf', '#ffccd5'],
    colorNames: ['Black', 'Starlight', 'Blue', 'Purple', 'Pink'],
    storages: ['64GB', '128GB', '256GB'],
    specs: {
      'Display': '6.1-inch Super Retina XDR OLED display with HDR',
      'Processor': 'A14 Bionic chip with 16-core Neural Engine technology',
      'Camera': 'Advanced dual-camera system (12MP Ultra Wide + Wide) with Night mode'
    },
    ratings: { average: 4.7, count: 830 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 15
  },
  // --- iPHONE 12 PRO ---
  {
    id: 'iphone-12-pro',
    name: 'iPhone 12 Pro',
    description: 'A leap forward. 5G speed. A14 Bionic. Pro camera system for next-level low-light photography. Beautiful flat stainless steel edges.',
    category: 'iphones',
    price: 59900,
    discount: 12,
    colors: ['#2d3238', '#faf9f6', '#0f293a', '#d1cfcd'],
    colorNames: ['Graphite', 'Gold', 'Pacific Blue', 'Silver'],
    storages: ['128GB', '256GB', '512GB'],
    specs: {
      'Display': '6.1-inch Super Retina XDR OLED display screen',
      'Processor': 'A14 Bionic, highly optimized 5nm silicon layout',
      'Camera': 'Pro 12MP camera system with LiDAR Scanner supporting Night mode portraits'
    },
    ratings: { average: 4.8, count: 620 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 6
  },
  // --- iMac ---
  {
    id: 'imac-m3',
    name: 'iMac 24" (M3)',
    description: 'The world’s best all-in-one desktop computer, now supercharged by the Apple M3 chip. Strikingly thin design. Immersive 4.5K Retina display.',
    category: 'macbooks',
    price: 134900,
    discount: 5,
    colors: ['#a7c4da', '#ffccd5', '#edfaf5', '#eccbb5'],
    colorNames: ['Blue', 'Pink', 'Green', 'Orange'],
    storages: ['256GB SSD', '512GB SSD'],
    specs: {
      'Display': '24-inch 4.5K Retina display with 500 nits peak brightness and 1 billion colors',
      'Processor': 'Apple M3 silicon with 8-core CPU and up to 10-core GPU processing',
      'Camera & Mic': '1080p FaceTime HD camera paired with studio-quality three-mic array',
      'Audio': 'Six-speaker sound system with Spatial Audio support'
    },
    ratings: { average: 4.8, count: 95 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 14
  },
  // --- Mac Mini ---
  {
    id: 'mac-mini-m4',
    name: 'Mac Mini (M4)',
    description: 'More mini. More mighty. Built for Apple Intelligence. Impossibly small 5x5 inch footprint. Powered by next-gen Apple M4 silicon.',
    category: 'macbooks',
    price: 59900,
    discount: 5,
    colors: ['#faf9f6'],
    colorNames: ['Silver'],
    storages: ['256GB', '512GB', '1TB'],
    specs: {
      'Size': 'Ultracompact 5-inch by 5-inch premium aluminum shell',
      'Processor': 'Apple M4 chip supporting fast neural computation cores',
      'Memory': 'Comes standard with 16GB unified memory upgradeable to 64GB',
      'Connectivity': 'Thunderbolt 4/5 ports, elegant rear vent structure'
    },
    ratings: { average: 4.9, count: 150 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 22
  },
  // --- Mac Studio ---
  {
    id: 'mac-studio-m2',
    name: 'Mac Studio',
    description: 'Empowers creative professionals to build the studio of their dreams. Mind-blowing performance with M2 Max or M2 Ultra. Ultra-rich array of ports.',
    category: 'macbooks',
    price: 209900,
    discount: 5,
    colors: ['#faf9f6'],
    colorNames: ['Silver'],
    storages: ['512GB SSD', '1TB SSD', '2TB SSD'],
    specs: {
      'Processor': 'Apple M2 Max or ultra-powerful M2 Ultra with up to 24-core CPU',
      'Graphics': 'Up to 76-core GPU rendering graphics at breathtaking speed',
      'Connectivity': '4x Thunderbolt 4, 10Gb Ethernet, HDMI, SDXC slot'
    },
    ratings: { average: 4.9, count: 82 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 9
  },
  // --- Mac Pro ---
  {
    id: 'mac-pro-m2',
    name: 'Mac Pro',
    description: 'A mind-blowing combination of Apple silicon performance and PCIe expansion. Outfitted with the monstrous M2 Ultra chip. Made for demanding workflows.',
    category: 'macbooks',
    price: 729900,
    discount: 3,
    colors: ['#faf9f6'],
    colorNames: ['Silver'],
    storages: ['1TB SSD', '2TB SSD', '4TB SSD'],
    specs: {
      'Processor': 'Monstrous Apple M2 Ultra with 24-core CPU and 192GB unified RAM option',
      'PCI Slots': 'Seven PCIe expansion slots (six Gen 4 slots) supporting PCIe cards',
      'Enclosure': 'Heavyweight workspace aluminum tower with elegant lattice handles'
    },
    ratings: { average: 4.9, count: 18 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 3
  },
  // --- Apple Vision Pro ---
  {
    id: 'apple-vision-pro',
    name: 'Apple Vision Pro',
    description: 'Welcome to the era of spatial computing. Seamlessly blends digital content with your physical space. Controlled purely by your eyes, hands, and voice.',
    category: 'visionpro',
    price: 349900,
    discount: 4,
    colors: ['#a0a5aa'],
    colorNames: ['Solo Knit Band Gray'],
    storages: ['256GB', '512GB', '1TB'],
    specs: {
      'Display': 'Ultra-high-resolution dual micro-OLED displays delivering 23 million pixels',
      'Chips': 'Dual-chip architecture featuring powerful M2 and real-time R1 spatial processors',
      'Sensors': 'Highly responsive high-resolution cameras, spatial mapping LiDAR, and eye-tracking lens arrays',
      'Sound': 'Dual-driver spatial audio pods placed close to ears'
    },
    ratings: { average: 4.8, count: 140 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 12,
    isFeatured: true
  },
  // --- MagSafe Charger ---
  {
    id: 'magsafe-charger',
    name: 'MagSafe Charger',
    description: 'Provides faster wireless charging up to 15W. Perfectly aligned magnets snap securely to your iPhone 12 or newer. Retains Qi charging compatibility.',
    category: 'accessories',
    price: 4500,
    discount: 10,
    colors: ['#ffffff'],
    colorNames: ['White'],
    storages: ['Standard Cable'],
    specs: {
      'Power Delivery': 'Frictionless magnetic alignment supporting wireless charging up to 15W',
      'Compatibility': 'iPhone 12 through iPhone 16 Plus/Pro models, AirPods spatial wireless cases'
    },
    ratings: { average: 4.7, count: 1110 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1588449668338-d15176d14719?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 150
  },
  // --- Cases ---
  {
    id: 'iphone-silicone-case',
    name: 'Silicone Case with MagSafe',
    description: 'Silky, soft-touch exterior feels outstanding in your hand. Features built-in alignment magnets for seamless wireless battery replenishment.',
    category: 'accessories',
    price: 4900,
    discount: 15,
    colors: ['#1c1d21', '#ffccd5', '#baa6cf', '#baa68f'],
    colorNames: ['Midnight Dark', 'Pink Rose', 'Plum Purple', 'Stone Pine Gray'],
    storages: ['iPhone 16 Pro', 'iPhone 16 Pro Max'],
    specs: {
      'Material': 'Colored premium silicone lining, soft microfiber protective interior layer',
      'Sizing': 'Engineered to fit precise dimensions of iPhone 16 Pro arrays'
    },
    ratings: { average: 4.6, count: 910 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 120
  },
  // --- AirTag ---
  {
    id: 'airtag',
    name: 'AirTag (4 Pack)',
    description: 'Keep track of your keys, wallet, luggage, and backpack in the Apple Find My application. Set up in a single tap to sync tracks wirelessly.',
    category: 'accessories',
    price: 11900,
    discount: 8,
    colors: ['#ffffff'],
    colorNames: ['White Chrome'],
    storages: ['4-Pack Set'],
    specs: {
      'Tracking': 'Ultra Wideband technology guiding you directly to your nearby AirTag with Precision Finding',
      'Battery': 'Standard user-replaceable CR203.2 coin battery lasting over a calendar year'
    },
    ratings: { average: 4.8, count: 1820 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1588449668338-d15176d14719?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 90
  },
  // --- Apple Pencil ---
  {
    id: 'apple-pencil-pro',
    name: 'Apple Pencil Pro',
    description: 'Extends creative control with hover detection, squeeze gestures, haptic feedback, and double-tap shortcuts. Attaches and charges magnetically.',
    category: 'accessories',
    price: 11905,
    discount: 5,
    colors: ['#ffffff'],
    colorNames: ['White'],
    storages: ['Pro Edition'],
    specs: {
      'Pressure Sensitivity': 'Absolute precise pressure sensitivity, tilt detection, low latency drawing',
      'Find My': 'Supported for locating easily through Apple Find My integration maps'
    },
    ratings: { average: 4.8, count: 420 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 45
  },
  // --- Adapters ---
  {
    id: 'usb-c-power-adapter',
    name: '20W USB-C Power Adapter',
    description: 'Offers fast, efficient charging at home, in the office, or on the go. Perfectly match with any USB-C enabled Apple device.',
    category: 'accessories',
    price: 1900,
    discount: 5,
    colors: ['#ffffff'],
    colorNames: ['White'],
    storages: ['20W Adapter'],
    specs: {
      'Output': 'Fast charge charging capability reaching 50% battery in 30 minutes for iPhones',
      'Connector': 'USB-C female interface'
    },
    ratings: { average: 4.7, count: 2450 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1588449668338-d15176d14719?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 300
  },
  // --- Cables ---
  {
    id: 'thunderbolt-4-cable',
    name: 'Thunderbolt 4 Pro Cable (1.8m)',
    description: 'Features a black braided design that coils without tangling. Supports high data transfer speeds up to 40Gb/s and charging up to 100W.',
    category: 'accessories',
    price: 12900,
    discount: 6,
    colors: ['#1c1d21'],
    colorNames: ['Black Braided'],
    storages: ['1.8 Meters'],
    specs: {
      'Speed': 'Thunderbolt 4 data transfers up to 40Gb/s, USB 3.1 speeds up to 10Gb/s',
      'Power': 'Supports laptop power charging up to 100W power delivery'
    },
    ratings: { average: 4.9, count: 180 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1588449668338-d15176d14719?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 50
  },
  // --- Keyboards ---
  {
    id: 'magic-keyboard-id',
    name: 'Magic Keyboard with Touch ID',
    description: 'Brings wireless convenience, tactile response, and Touch ID for fast, easy authentication and secure shopping purchases.',
    category: 'accessories',
    price: 14500,
    discount: 5,
    colors: ['#ffffff', '#222325'],
    colorNames: ['Silver White', 'Space Black'],
    storages: ['Compact Size'],
    specs: {
      'Battery': 'Rechargeable internal cell delivering keyboard usage for about a month on charge',
      'Security': 'Touch ID sensor for instant iMac workstation user login'
    },
    ratings: { average: 4.8, count: 320 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1588449668338-d15176d14719?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 60
  },
  // --- Mouse ---
  {
    id: 'magic-mouse',
    name: 'Magic Mouse (Multi-Touch)',
    description: 'Wireless and rechargeable, with an optimized foot design that tracks smoothly across your desk. Top shell supports Multi-Touch gestures.',
    category: 'accessories',
    price: 7500,
    discount: 10,
    colors: ['#ffffff', '#222325'],
    colorNames: ['White Chrome', 'Space Black Chrome'],
    storages: ['USB-C Connection'],
    specs: {
      'Gestures': 'Swipe webpages, scroll documents, secondary click right shortcuts',
      'Replenishment': 'USB-C port on bottom side for charging cycles'
    },
    ratings: { average: 4.5, count: 830 },
    reviews: [],
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 140
  }
];
