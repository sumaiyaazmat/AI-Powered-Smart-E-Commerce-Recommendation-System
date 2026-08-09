import HeroSection from '../components/home/HeroSection';
import FeaturedCategories from '../components/home/FeaturedCategories';
import WhyChooseUs from '../components/home/WhyChooseUs';
import CustomerReviews from '../components/home/CustomerReviews';
import ProductCarousel from '../components/product/ProductCarousel';
import RecommendationSection from '../components/product/RecommendationSection';
import { products } from '../data/products';

const bestSellers = products.filter((p) => p.badges.includes('bestseller'));
const newArrivals = products.filter((p) => p.badges.includes('new'));
const flashDeals = [...products].filter((p) => p.discount >= 15).sort((a, b) => b.discount - a.discount);
const trending = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 10);

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedCategories />

      <ProductCarousel
        eyebrow="Limited time"
        title="Flash Deals"
        subtitle="Discounted picks, refreshed daily."
        products={flashDeals}
      />

      <ProductCarousel
        eyebrow="Most watched"
        title="Trending Now"
        products={trending}
      />

      <WhyChooseUs />

      <ProductCarousel
        eyebrow="Customer favorites"
        title="Best Sellers"
        products={bestSellers}
      />

      <ProductCarousel
        eyebrow="Just landed"
        title="New Arrivals"
        products={newArrivals}
      />

      <RecommendationSection title="Recommended For You" eyebrow="Personalized" />

      <CustomerReviews />
    </>
  );
}
