import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import RatingStars from '../ui/RatingStars';
import ProductBadge, { PriceTag } from '../ui/ProductBadge';
import { getDiscountedPrice } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useWishlist } from '../../hooks/useWishlist';
import QuickViewModal from './QuickViewModal';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { isWishlisted, toggle } = useWishlist();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const finalPrice = getDiscountedPrice(product);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product, 1);
    showToast('Product added to your cart.');
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggle(product.id);
    showToast(wishlisted ? 'Removed from wishlist.' : 'Saved to your wishlist.', 'info');
  };

  return (
    <>
      <motion.article
        className="product-card"
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      >
        <Link to={`/product/${product.id}`} className="product-card__media">
          <motion.img
            src={product.image}
            alt={product.name}
            loading="lazy"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.4 }}
          />
          <div className="product-card__badges">
            {product.badges?.map((b) => (
              <ProductBadge key={b} type={b} />
            ))}
          </div>
          <div className="product-card__quick-actions">
            <button
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className={`icon-btn ${wishlisted ? 'icon-btn--active' : ''}`}
              onClick={handleWishlist}
            >
              <Heart size={16} fill={wishlisted ? 'var(--accent-deep)' : 'none'} />
            </button>
            <button
              aria-label="Quick view"
              className="icon-btn"
              onClick={(e) => {
                e.preventDefault();
                setQuickViewOpen(true);
              }}
            >
              <Eye size={16} />
            </button>
          </div>
        </Link>

        <div className="product-card__body">
          <span className="product-card__category">{product.subcategory}</span>
          <Link to={`/product/${product.id}`}>
            <h3 className="product-card__name">{product.name}</h3>
          </Link>
          <RatingStars rating={product.rating} reviews={product.reviews} />
          <div className="product-card__footer">
            <PriceTag price={finalPrice} originalPrice={product.price} discount={product.discount} />
            <button className="icon-btn icon-btn--accent" aria-label="Add to cart" onClick={handleAddToCart}>
              <ShoppingCart size={17} />
            </button>
          </div>
        </div>
      </motion.article>

      {quickViewOpen && (
        <QuickViewModal product={product} onClose={() => setQuickViewOpen(false)} />
      )}
    </>
  );
}
