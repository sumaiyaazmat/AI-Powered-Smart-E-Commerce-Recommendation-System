import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import RatingStars from '../ui/RatingStars';
import { PriceTag } from '../ui/ProductBadge';
import Button from '../ui/Button';
import { getDiscountedPrice } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export default function QuickViewModal({ product, onClose }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const finalPrice = getDiscountedPrice(product);

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal quick-view"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={`Quick view: ${product.name}`}
        >
          <button className="modal__close" aria-label="Close quick view" onClick={onClose}>
            <X size={18} />
          </button>
          <div className="quick-view__media">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="quick-view__body">
            <span className="product-card__category">{product.subcategory}</span>
            <h3>{product.name}</h3>
            <RatingStars rating={product.rating} reviews={product.reviews} />
            <PriceTag price={finalPrice} originalPrice={product.price} discount={product.discount} />
            <p className="quick-view__desc">{product.description}</p>
            <div className="quick-view__actions">
              <Button
                variant="primary"
                icon={ShoppingCart}
                onClick={() => {
                  addItem(product, 1);
                  showToast('Product added to your cart.');
                  onClose();
                }}
              >
                Add to Cart
              </Button>
              <Link to={`/product/${product.id}`} onClick={onClose} className="quick-view__link">
                View full details →
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
