# ARC Market — E-Commerce Frontend

A complete React + Vite frontend for a premium e-commerce store, built as a
foundation for a future MySQL backend and ML-based recommendation system.

## Tech stack

- React 18 + Vite
- React Router v6
- Framer Motion (animations)
- lucide-react (icons)
- Plain CSS with a token-based design system (`src/styles/tokens.css`)
- No backend — cart/auth state is local (React Context + `localStorage`)

## Requirements

- Node.js 18+ and npm (Node 20 LTS recommended)

## Installation

```bash
cd arc-store
npm install
```

## Run locally

```bash
npm run dev
```

Then open the URL Vite prints (default **http://localhost:5173**).

## Production build

```bash
npm run build     # outputs to dist/
npm run preview   # serve the production build locally to sanity-check it
```

## Project structure

```
src/
  components/
    layout/     Navbar, Footer, SearchBar, CategoryDropdown, Layout, PageTransition
    product/    ProductCard, ProductGrid, ProductCarousel, QuickViewModal,
                RecommendationSection
    cart/       CartDrawer, CartItem
    home/       HeroSection, FeaturedCategories, WhyChooseUs, CustomerReviews
    ui/         Button, RatingStars, ProductBadge/PriceTag, LoadingSpinner
  pages/        Home, ProductsPage, ProductDetailsPage, CartPage,
                LoginPage, SignupPage, ContactPage, NotFoundPage
  context/      CartContext, AuthContext, ToastContext
  data/         products.js, categories.js   ← product/category data lives here only
  hooks/        useWishlist, useScrollToTop
  utils/        recommendations.js           ← ML integration seam (see below)
  styles/       tokens.css (design tokens), index.css (component styles)
```

## Product data & the real dataset

All product/category data lives in `src/data/products.js` and
`src/data/categories.js` — nothing is hardcoded in UI components.

Each product has a `source` field:
- `"dataset"` — came from the original project dataset
- `"demo"` — added here so every category has a realistic amount of
  inventory (some categories, like Beauty, only had ~3 real items).
  Safe to delete once the real dataset grows; nothing in the UI depends on
  this flag, it's just there so these rows are easy to find and swap out.

**Product IDs double as SKUs**, formatted `{category-prefix}-{seq}` (e.g.
`elec-001`, `beau-002`). Keep that format for new rows — it's what a future
MySQL `products` table would key off (`id`/`sku` column). Each product also
carries an explicit `sku` field (== `id`) so backend payloads don't have to
assume anything about the frontend's ID shape.

To connect to a real backend later, the natural seam is replacing the
functions in `src/data/products.js` (`getProductById`, `getProductsByCategory`,
`searchProducts`, etc.) with API calls — the components that consume them
don't need to change.

## ML recommendation system integration

`src/utils/recommendations.js` is the single place the ML service plugs in.
Right now `getRecommendations()` mocks network latency and returns a
highest-rated sort as a placeholder. Replace its body with:

```js
const res = await fetch(`/api/recommendations/${customerId}`);
return res.json();
```

`<RecommendationSection />` (used on the homepage and product details page)
only calls `getRecommendations()` and renders whatever comes back — no other
file needs to change when the real model is wired up.

## Auth

`src/context/AuthContext.jsx` is a **frontend-only placeholder**. Login and
signup forms work and persist a minimal profile to `localStorage` so the UI
has real state to react to, but no request is sent anywhere. Both pages show
an explicit on-screen notice saying so. Swap the bodies of `login`/`signup`
in that file for real API calls once auth endpoints exist.

## Cart

`src/context/CartContext.jsx` uses `useReducer` + `localStorage` persistence.
`subtotal`/`total` are computed there; a `total` field is already separated
from `subtotal` so shipping/tax logic has an obvious place to go once the
backend calculates it.

## Known placeholders (by design)

- Checkout button shows a toast explaining checkout isn't connected yet.
- Product images are placeholder Unsplash URLs — swap the `image` field in
  `products.js` for local assets or CDN URLs when real product photos exist.
- Login/Signup do not create real accounts.
