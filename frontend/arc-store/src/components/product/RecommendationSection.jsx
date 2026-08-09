import { useEffect, useState } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';
import ProductCarousel from './ProductCarousel';
import { getRecommendations } from '../../utils/recommendations';
import { useAuth } from '../../context/AuthContext';

/**
 * Drop this anywhere a personalized product rail is needed. It never talks
 * to UI state directly — it only calls getRecommendations() and renders the
 * result, so swapping the mock heuristic for the real ML endpoint later is a
 * one-file change (src/utils/recommendations.js).
 */
export default function RecommendationSection({
  title = 'Recommended For You',
  eyebrow = 'Picked for you',
  productId,
  categoryId,
}) {
  const { user } = useAuth();
  const [items, setItems] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setItems(null);
    getRecommendations({ customerId: user?.email || 'guest', productId, categoryId }).then((data) => {
      if (!cancelled) setItems(data);
    });
    return () => {
      cancelled = true;
    };
  }, [user, productId, categoryId]);

  if (items === null) {
    return (
      <section className="carousel-section">
        <div className="container">
          <LoadingSpinner label="Loading recommendations" />
        </div>
      </section>
    );
  }

  return <ProductCarousel title={title} eyebrow={eyebrow} products={items} />;
}
