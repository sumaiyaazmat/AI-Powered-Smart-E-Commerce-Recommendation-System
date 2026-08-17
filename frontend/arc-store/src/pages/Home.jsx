import { useEffect, useState } from 'react';

import HeroSection from '../components/home/HeroSection';
import FeaturedCategories from '../components/home/FeaturedCategories';
import WhyChooseUs from '../components/home/WhyChooseUs';
import CustomerReviews from '../components/home/CustomerReviews';

import ProductCarousel from '../components/product/ProductCarousel';
import RecommendationSection from '../components/product/RecommendationSection';

import { apiRequest } from '../services/api';

// ==========================================================
// BACKEND PRODUCT -> FRONTEND PRODUCT
// ==========================================================

function mapProduct(product) {
  const price = Number(product.Price ?? 0);
  const listPrice = Number(product.List_Price ?? price);

  const discount =
    listPrice > price
      ? Math.round(
          ((listPrice - price) / listPrice) * 100
        )
      : 0;

  const badges = [];

  if (product.BestSeller) {
    badges.push('bestseller');
  }

  if (product.Prime) {
    badges.push('prime');
  }

  if (product.AmazonChoice) {
    badges.push('amazon-choice');
  }

  const categoryMap = {
    Electronics: 'electronics',
    Beauty: 'beauty',
    Fashion: 'clothing',
    Home: 'home-kitchen',
    Books: 'books',
    Other: 'accessories',
  };

  const category =
    categoryMap[product.Category] ||
    String(product.Category || 'other')
      .toLowerCase()
      .replace(/\s+/g, '-');

  return {
    id: product.Product_ID,
    sku: product.Product_ID,

    name: product.Product_Name,

    category,
    subcategory: product.Category,

    price,
    listPrice,
    discount,

    rating: Number(product.Rating ?? 0),
    reviews: Number(product.Reviews ?? 0),
    stock: Number(product.Stock ?? 0),

    image: product.Image_URL || '',

    description: product.Description || '',
    brand: product.Brand || '',
    status: product.Status || '',

    badges,
  };
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const data = await apiRequest('/products/');

        const mappedProducts = data.map(mapProduct);

        if (!cancelled) {
          setProducts(mappedProducts);

          console.log(
            'HOME PRODUCTS LOADED:',
            mappedProducts.length
          );
        }
      } catch (error) {
        console.error(
          'HOME PRODUCTS LOAD ERROR:',
          error
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  // ========================================================
  // HOME PRODUCT SECTIONS
  // ========================================================

  const bestSellers = products.filter(
    (product) =>
      product.badges.includes('bestseller')
  );

  const flashDeals = [...products]
    .filter(
      (product) =>
        product.discount >= 15
    )
    .sort(
      (a, b) =>
        b.discount - a.discount
    );

  const trending = [...products]
    .sort(
      (a, b) =>
        b.reviews - a.reviews
    )
    .slice(0, 10);

  // Until the database has a dedicated "new arrival"
  // field, use the first products as the New Arrivals section.
  const newArrivals = products.slice(0, 10);

  return (
    <>
      <HeroSection />

      <FeaturedCategories />

      {loading ? (
        <section className="container empty-state">
          <h2>Loading products...</h2>
          <p>
            Fetching the latest products.
          </p>
        </section>
      ) : (
        <>
          {/* FLASH DEALS */}

          <ProductCarousel
            eyebrow="Limited time"
            title="Flash Deals"
            subtitle="Discounted picks, refreshed daily."
            products={flashDeals}
          />

          {/* TRENDING */}

          <ProductCarousel
            eyebrow="Most watched"
            title="Trending Now"
            products={trending}
          />

          <WhyChooseUs />

          {/* BEST SELLERS */}

          <ProductCarousel
            eyebrow="Customer favorites"
            title="Best Sellers"
            products={bestSellers}
          />

          {/* NEW ARRIVALS */}

          <ProductCarousel
            eyebrow="Just landed"
            title="New Arrivals"
            products={newArrivals}
          />
        </>
      )}

      {/* AI RECOMMENDATIONS WILL BE CONNECTED SEPARATELY */}

      <RecommendationSection
        title="Recommended For You"
        eyebrow="Personalized"
      />

      <CustomerReviews />
    </>
  );
}