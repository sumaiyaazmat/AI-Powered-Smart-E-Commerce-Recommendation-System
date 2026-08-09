import { products } from '../data/products';

// ---------------------------------------------------------------------------
// This is the single seam where the ML recommendation service plugs in.
//
// Later, replace the body of `getRecommendations` with:
//
//   const res = await fetch(`/api/recommendations/${customerId}`);
//   return res.json();
//
// Nothing in <RecommendationSection /> needs to change — it only calls
// this function and renders whatever product list comes back.
// ---------------------------------------------------------------------------

export async function getRecommendations({ customerId = 'guest', productId, categoryId, limit = 8 } = {}) {
  // Mock latency so loading states are visible/testable.
  await new Promise((resolve) => setTimeout(resolve, 350));

  let pool = products;
  if (categoryId) pool = pool.filter((p) => p.category === categoryId);
  if (productId) pool = pool.filter((p) => p.id !== productId);

  // Placeholder heuristic: highest-rated first. The ML model will replace
  // this ordering with personalized scores per `customerId`.
  const sorted = [...pool].sort((a, b) => b.rating - a.rating);
  return sorted.slice(0, limit);
}
