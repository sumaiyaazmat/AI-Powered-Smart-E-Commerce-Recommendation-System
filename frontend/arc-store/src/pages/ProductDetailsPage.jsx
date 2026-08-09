import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingCart, Heart, CheckCircle2, ChevronRight } from 'lucide-react';
import RatingStars from '../components/ui/RatingStars';
import { PriceTag } from '../components/ui/ProductBadge';
import Button from '../components/ui/Button';
import RecommendationSection from '../components/product/RecommendationSection';
import { getProductById, getDiscountedPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../hooks/useWishlist';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id);
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { isWishlisted, toggle } = useWishlist();
  const [qty, setQty] = useState(1);

  useEffect(() => setQty(1), [id]);

  if (!product) {
    return (
      <div className="container empty-state">
        <p>We couldn't find that product.</p>
        <Button as={Link} to="/products" variant="primary">Back to Products</Button>
      </div>
    );
  }

  const finalPrice = getDiscountedPrice(product);
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="container product-details">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <ChevronRight size={13} />
        <Link to={`/products?category=${product.category}`}>{product.category.replace('-', ' & ')}</Link>
        <ChevronRight size={13} />
        <span>{product.name}</span>
      </nav>

      <div className="product-details__grid">
        <motion.div
          className="product-details__media"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <img src={product.image} alt={product.name} />
          {product.badges?.length > 0 && (
            <div className="product-card__badges product-details__badges">
              {product.badges.map((b) => (
                <span key={b} className={`badge badge--${b}`}>{b === 'new' ? 'New' : 'Bestseller'}</span>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          className="product-details__info"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <span className="product-card__category">{product.category.replace('-', ' & ')} / {product.subcategory}</span>
          <h1>{product.name}</h1>
          <RatingStars rating={product.rating} reviews={product.reviews} size={16} />
          <PriceTag price={finalPrice} originalPrice={product.price} discount={product.discount} />

          <p className="product-details__desc">{product.description}</p>

          <div className="product-details__meta">
            <span className={`availability ${product.stock > 0 ? 'availability--in' : 'availability--out'}`}>
              <CheckCircle2 size={14} /> {product.stock > 0 ? `In stock (${product.stock} available)` : 'Out of stock'}
            </span>
          </div>

          <div className="product-details__qty">
            <span>Quantity</span>
            <div className="qty-stepper">
              <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                <Minus size={14} />
              </button>
              <span>{qty}</span>
              <button aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="product-details__actions">
            <Button
              variant="primary"
              size="lg"
              icon={ShoppingCart}
              onClick={() => {
                addItem(product, qty);
                showToast('Product added to your cart.');
              }}
            >
              Add to Cart
            </Button>
            <Button
              variant="accent"
              size="lg"
              onClick={() => {
                addItem(product, qty);
                navigate('/cart');
              }}
            >
              Buy Now
            </Button>
            <button
              className={`icon-btn icon-btn--lg ${wishlisted ? 'icon-btn--active' : ''}`}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              onClick={() => {
                toggle(product.id);
                showToast(wishlisted ? 'Removed from wishlist.' : 'Saved to your wishlist.', 'info');
              }}
            >
              <Heart size={19} fill={wishlisted ? 'var(--accent-deep)' : 'none'} />
            </button>
          </div>
        </motion.div>
      </div>

      <RecommendationSection
        title="Related Products"
        eyebrow="You might also like"
        productId={product.id}
        categoryId={product.category}
      />
    </div>
  );
}
