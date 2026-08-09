// Category catalog. Icon names map to lucide-react components (see CategoryDropdown).
export const categories = [
  { id: 'electronics', name: 'Electronics', icon: 'Cpu', subcategories: ['Audio', 'Wearables', 'Accessories', 'Smart Home'] },
  { id: 'beauty', name: 'Beauty', icon: 'Sparkles', subcategories: ['Skincare', 'Fragrance', 'Haircare', 'Makeup'] },
  { id: 'clothing', name: 'Clothing', icon: 'Shirt', subcategories: ["Men's", "Women's", 'Footwear', 'Outerwear'] },
  { id: 'home-kitchen', name: 'Home & Kitchen', icon: 'Sofa', subcategories: ['Cookware', 'Decor', 'Storage', 'Small Appliances'] },
  { id: 'books', name: 'Books', icon: 'BookOpen', subcategories: ['Fiction', 'Non-Fiction', "Children's"] },
  { id: 'sports', name: 'Sports', icon: 'Dumbbell', subcategories: ['Fitness', 'Outdoor', 'Team Sports'] },
  { id: 'grocery', name: 'Grocery', icon: 'ShoppingBasket', subcategories: ['Pantry', 'Beverages', 'Snacks'] },
  { id: 'accessories', name: 'Accessories', icon: 'Watch', subcategories: ['Bags', 'Jewelry', 'Eyewear'] },
];

export const getCategoryById = (id) => categories.find((c) => c.id === id);
