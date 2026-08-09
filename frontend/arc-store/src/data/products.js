// ---------------------------------------------------------------------------
// Product data layer.
//
// `source: "dataset"`  -> came from the original project dataset
// `source: "demo"`     -> added here so every category has a realistic amount
//                         of inventory. Safe to delete once the real dataset
//                         grows — nothing in the UI depends on the flag,
//                         it exists purely so these rows are easy to find
//                         and swap out later.
//
// Images are placeholder Unsplash source URLs sized consistently (4:5).
// Swap `image` for a local asset path or CDN URL when real product photos
// are available — no other field needs to change.
//
// `id` doubles as a stable SKU: `{category-prefix}-{zero-padded sequence}`
// (e.g. "elec-001", "beau-002"). Keep this format when adding rows so it
// maps cleanly to a MySQL primary key / SKU column later — the `sku` field
// below is just an explicit alias of `id` for that integration.
// ---------------------------------------------------------------------------

const img = (seed) => `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=600&h=750&q=80`;

export const products = [
  // ---------- Electronics (dataset) ----------
  { id: 'elec-001', name: 'Aurora Wireless ANC Headphones', category: 'electronics', subcategory: 'Audio', price: 179.0, discount: 15, rating: 4.6, reviews: 328, stock: 42, image: img('photo-1505740420928-5e560c06d30e'), description: 'Over-ear headphones with adaptive noise cancellation, 40-hour battery life, and a memory-foam headband built for all-day comfort.', badges: ['bestseller'], source: 'dataset' },
  { id: 'elec-002', name: 'Pulse Fitness Smartwatch', category: 'electronics', subcategory: 'Wearables', price: 149.0, discount: 0, rating: 4.4, reviews: 201, stock: 65, image: img('photo-1523275335684-37898b6baf30'), description: 'Track heart rate, sleep, and workouts with a always-on AMOLED display and 10-day battery.', badges: ['new'], source: 'dataset' },
  { id: 'elec-003', name: 'Halo Portable Bluetooth Speaker', category: 'electronics', subcategory: 'Audio', price: 59.0, discount: 20, rating: 4.3, reviews: 412, stock: 90, image: img('photo-1608043152269-423dbba4e7e1'), description: 'Pocket-sized speaker with 360° sound, IPX7 waterproofing, and a 12-hour charge.', badges: [], source: 'dataset' },
  { id: 'elec-004', name: 'Cascade Mechanical Keyboard', category: 'electronics', subcategory: 'Accessories', price: 89.0, discount: 0, rating: 4.7, reviews: 156, stock: 33, image: img('photo-1618384887929-16ec33fab9ef'), description: 'Hot-swappable switches, per-key RGB, and a CNC aluminum frame for a satisfying daily type.', badges: [], source: 'dataset' },
  { id: 'elec-005', name: 'Nimbus Smart Home Hub', category: 'electronics', subcategory: 'Smart Home', price: 99.0, discount: 10, rating: 4.2, reviews: 88, stock: 51, image: img('photo-1558002038-1055907df827'), description: 'Control lights, locks, and thermostats from one hub with voice assistant built in.', badges: [], source: 'demo' },
  { id: 'elec-006', name: 'Drift True Wireless Earbuds', category: 'electronics', subcategory: 'Audio', price: 129.0, discount: 25, rating: 4.5, reviews: 540, stock: 120, image: img('photo-1590658268037-6bf12165a8df'), description: 'Compact earbuds with active noise cancellation and a wireless charging case.', badges: ['bestseller'], source: 'demo' },
  { id: 'elec-007', name: 'Vantage 4K Webcam', category: 'electronics', subcategory: 'Accessories', price: 74.0, discount: 0, rating: 4.1, reviews: 63, stock: 40, image: img('photo-1587825140708-dfaf72ae4b04'), description: 'Crisp 4K video with auto-framing, perfect for calls and streaming.', badges: ['new'], source: 'demo' },
  { id: 'elec-008', name: 'Origin Fast-Charge Power Bank', category: 'electronics', subcategory: 'Accessories', price: 39.0, discount: 10, rating: 4.4, reviews: 298, stock: 200, image: img('photo-1609091839311-d5365f9ff1c5'), description: '20,000mAh with 65W fast charging — enough for a laptop and phone on one trip.', badges: [], source: 'demo' },

  // ---------- Beauty (dataset — small, filled out with demo items) ----------
  { id: 'beau-001', name: 'Velora Vitamin C Serum', category: 'beauty', subcategory: 'Skincare', price: 34.0, discount: 0, rating: 4.6, reviews: 512, stock: 150, image: img('photo-1620916566398-39f1143ab7be'), description: 'Brightening serum with 15% vitamin C and hyaluronic acid for a smoother, more even tone.', badges: ['bestseller'], source: 'dataset' },
  { id: 'beau-002', name: 'Solace Rosewater Toner', category: 'beauty', subcategory: 'Skincare', price: 18.0, discount: 0, rating: 4.5, reviews: 187, stock: 110, image: img('photo-1556228720-195a672e8a03'), description: 'Alcohol-free toner that calms and preps skin, with real rose distillate.', badges: [], source: 'dataset' },
  { id: 'beau-003', name: 'Ember Matte Lip Set', category: 'beauty', subcategory: 'Makeup', price: 26.0, discount: 15, rating: 4.3, reviews: 94, stock: 75, image: img('photo-1586495777744-4413f21062fa'), description: 'Four long-wear matte shades in a travel-friendly set.', badges: ['new'], source: 'dataset' },
  { id: 'beau-004', name: 'Linen & Amber Eau de Parfum', category: 'beauty', subcategory: 'Fragrance', price: 68.0, discount: 0, rating: 4.7, reviews: 143, stock: 60, image: img('photo-1541643600914-78b084683601'), description: 'A warm, understated fragrance with notes of amber, cedar, and fresh linen.', badges: [], source: 'demo' },
  { id: 'beau-005', name: 'Bloom Repair Hair Mask', category: 'beauty', subcategory: 'Haircare', price: 22.0, discount: 10, rating: 4.4, reviews: 231, stock: 130, image: img('photo-1526947425960-945c6e72858f'), description: 'Weekly deep-conditioning mask with argan oil for dry or color-treated hair.', badges: [], source: 'demo' },
  { id: 'beau-006', name: 'Quartz Facial Roller Duo', category: 'beauty', subcategory: 'Skincare', price: 24.0, discount: 0, rating: 4.2, reviews: 76, stock: 85, image: img('photo-1570172619644-dfd03ed5d881'), description: 'Rose quartz roller and gua sha set for a calming skincare routine.', badges: [], source: 'demo' },
  { id: 'beau-007', name: 'Citrus Grove Body Wash', category: 'beauty', subcategory: 'Skincare', price: 14.0, discount: 0, rating: 4.3, reviews: 165, stock: 200, image: img('photo-1570194065650-d99fb4bedf0a'), description: 'Sulfate-free body wash with cold-pressed citrus oils.', badges: [], source: 'demo' },

  // ---------- Clothing ----------
  { id: 'clo-001', name: 'Everyday Oxford Shirt', category: 'clothing', subcategory: "Men's", price: 54.0, discount: 0, rating: 4.5, reviews: 220, stock: 140, image: img('photo-1602810318383-e386cc2a3ccf'), description: 'A breathable cotton-blend oxford cut for a relaxed, tailored fit.', badges: [], source: 'dataset' },
  { id: 'clo-002', name: 'Wren Wrap Midi Dress', category: 'clothing', subcategory: "Women's", price: 72.0, discount: 20, rating: 4.6, reviews: 189, stock: 95, image: img('photo-1595777457583-95e059d581b8'), description: 'A flattering wrap silhouette in a soft, drapey fabric — day-to-evening ready.', badges: ['bestseller'], source: 'dataset' },
  { id: 'clo-003', name: 'Trailhead Canvas Sneakers', category: 'clothing', subcategory: 'Footwear', price: 65.0, discount: 0, rating: 4.4, reviews: 302, stock: 180, image: img('photo-1595950653106-6c9ebd614d3a'), description: 'Low-profile canvas sneakers with a cushioned sole for all-day wear.', badges: [], source: 'demo' },
  { id: 'clo-004', name: 'Fenwick Wool Overcoat', category: 'clothing', subcategory: 'Outerwear', price: 189.0, discount: 10, rating: 4.7, reviews: 78, stock: 40, image: img('photo-1539533018447-63fcce2678e3'), description: 'A structured wool-blend overcoat built for cold-weather layering.', badges: ['new'], source: 'demo' },
  { id: 'clo-005', name: 'Harbor Relaxed Denim', category: 'clothing', subcategory: "Men's", price: 58.0, discount: 0, rating: 4.3, reviews: 134, stock: 160, image: img('photo-1541099649105-f69ad21f3246'), description: 'Mid-rise straight denim with just enough stretch for everyday comfort.', badges: [], source: 'demo' },
  { id: 'clo-006', name: 'Sable Ribbed Knit Set', category: 'clothing', subcategory: "Women's", price: 48.0, discount: 15, rating: 4.5, reviews: 97, stock: 88, image: img('photo-1434389677669-e08b4cac3105'), description: 'A matching ribbed-knit top and skirt set in a soft stretch fabric.', badges: [], source: 'demo' },

  // ---------- Home & Kitchen ----------
  { id: 'home-001', name: 'Kettle & Co. Pour-Over Set', category: 'home-kitchen', subcategory: 'Cookware', price: 42.0, discount: 0, rating: 4.6, reviews: 176, stock: 100, image: img('photo-1544787219-7f47ccb76574'), description: 'A gooseneck kettle and ceramic dripper set for a slower, better morning.', badges: [], source: 'dataset' },
  { id: 'home-002', name: 'Linen Weave Throw Blanket', category: 'home-kitchen', subcategory: 'Decor', price: 36.0, discount: 0, rating: 4.5, reviews: 145, stock: 120, image: img('photo-1522708323590-d24dbb6b0267'), description: 'A textured cotton-linen throw that softens with every wash.', badges: ['bestseller'], source: 'dataset' },
  { id: 'home-003', name: 'Modular Bamboo Organizer', category: 'home-kitchen', subcategory: 'Storage', price: 29.0, discount: 10, rating: 4.3, reviews: 88, stock: 140, image: img('photo-1595515106969-1ce29566ff1c'), description: 'Stackable bamboo drawer trays that adapt to any kitchen layout.', badges: [], source: 'demo' },
  { id: 'home-004', name: 'Aria Countertop Blender', category: 'home-kitchen', subcategory: 'Small Appliances', price: 79.0, discount: 15, rating: 4.4, reviews: 210, stock: 70, image: img('photo-1570222094114-d054a817e56b'), description: 'A quiet, powerful blender with pre-set programs for smoothies and soups.', badges: ['new'], source: 'demo' },
  { id: 'home-005', name: 'Terra Ceramic Dinnerware Set', category: 'home-kitchen', subcategory: 'Cookware', price: 96.0, discount: 0, rating: 4.7, reviews: 62, stock: 45, image: img('photo-1584346133934-a3afd2a33f4d'), description: 'A 16-piece stoneware set with a warm, hand-finished glaze.', badges: [], source: 'demo' },

  // ---------- Books ----------
  { id: 'book-001', name: 'The Quiet Coastline', category: 'books', subcategory: 'Fiction', price: 16.0, discount: 0, rating: 4.5, reviews: 340, stock: 300, image: img('photo-1544947950-fa07a98d237f'), description: 'A quiet, atmospheric novel about a family returning to their childhood home.', badges: ['bestseller'], source: 'dataset' },
  { id: 'book-002', name: 'Systems of Everyday Thinking', category: 'books', subcategory: 'Non-Fiction', price: 22.0, discount: 0, rating: 4.6, reviews: 198, stock: 210, image: img('photo-1512820790803-83ca734da794'), description: 'A practical guide to building better habits through small systems.', badges: [], source: 'demo' },
  { id: 'book-003', name: 'The Paper Lantern Festival', category: 'books', subcategory: "Children's", price: 12.0, discount: 0, rating: 4.8, reviews: 122, stock: 260, image: img('photo-1512820790803-83ca734da794'), description: 'An illustrated picture book about a village festival, for ages 4–8.', badges: ['new'], source: 'demo' },

  // ---------- Sports ----------
  { id: 'sport-001', name: 'Flex Foam Yoga Mat', category: 'sports', subcategory: 'Fitness', price: 32.0, discount: 0, rating: 4.5, reviews: 267, stock: 190, image: img('photo-1601925260368-ae2f83cf8b7f'), description: 'An extra-cushioned, non-slip mat with alignment guides.', badges: ['bestseller'], source: 'dataset' },
  { id: 'sport-002', name: 'Trailblazer Hydration Pack', category: 'sports', subcategory: 'Outdoor', price: 54.0, discount: 10, rating: 4.4, reviews: 91, stock: 80, image: img('photo-1523362628745-0c100150b504'), description: 'A 2L hydration pack built for trail runs and day hikes.', badges: [], source: 'demo' },
  { id: 'sport-003', name: 'Core Adjustable Dumbbell Set', category: 'sports', subcategory: 'Fitness', price: 149.0, discount: 20, rating: 4.6, reviews: 134, stock: 35, image: img('photo-1571019613454-1cb2f99b2d8b'), description: 'Space-saving adjustable dumbbells, 5–52.5 lbs per hand.', badges: ['new'], source: 'demo' },

  // ---------- Grocery ----------
  { id: 'gro-001', name: 'Highland Cold-Brew Coffee Bags', category: 'grocery', subcategory: 'Beverages', price: 15.0, discount: 0, rating: 4.6, reviews: 402, stock: 400, image: img('photo-1447933601403-0c6688de566e'), description: 'Single-origin cold brew bags — just steep in cold water overnight.', badges: ['bestseller'], source: 'dataset' },
  { id: 'gro-002', name: 'Grove Raw Honey Trio', category: 'grocery', subcategory: 'Pantry', price: 24.0, discount: 0, rating: 4.7, reviews: 156, stock: 220, image: img('photo-1587049352846-4a222e784d38'), description: 'Three raw, single-flower honeys from small independent apiaries.', badges: [], source: 'demo' },
  { id: 'gro-003', name: 'Harvest Trail Mix Pouches', category: 'grocery', subcategory: 'Snacks', price: 18.0, discount: 5, rating: 4.3, reviews: 210, stock: 350, image: img('photo-1599599810769-bcde5a160d32'), description: 'Ten single-serve pouches of nuts, seeds, and dried fruit.', badges: [], source: 'demo' },

  // ---------- Accessories ----------
  { id: 'acc-001', name: 'Fold Leather Card Wallet', category: 'accessories', subcategory: 'Bags', price: 38.0, discount: 0, rating: 4.6, reviews: 189, stock: 150, image: img('photo-1627123424574-724758594e93'), description: 'A slim full-grain leather wallet that patinas beautifully with age.', badges: ['bestseller'], source: 'dataset' },
  { id: 'acc-002', name: 'Meridian Aviator Sunglasses', category: 'accessories', subcategory: 'Eyewear', price: 46.0, discount: 15, rating: 4.4, reviews: 112, stock: 130, image: img('photo-1572635196237-14b3f281503f'), description: 'Polarized lenses in a lightweight titanium frame.', badges: [], source: 'demo' },
  { id: 'acc-003', name: 'Woven Chain Layered Necklace', category: 'accessories', subcategory: 'Jewelry', price: 29.0, discount: 0, rating: 4.3, reviews: 84, stock: 160, image: img('photo-1611591437281-460bfbe1220a'), description: 'A set of three delicate layered chains, water-resistant plating.', badges: ['new'], source: 'demo' },
];

// Explicit SKU alias (== id) for future MySQL/backend integration, so API
// payloads can reference `sku` without depending on the frontend's `id` shape.
products.forEach((p) => {
  p.sku = p.id;
});

export const getProductById = (id) => products.find((p) => p.id === id);

export const getProductsByCategory = (categoryId) =>
  products.filter((p) => p.category === categoryId);

export const getDiscountedPrice = (product) =>
  product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;

export const searchProducts = (query) => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
};
