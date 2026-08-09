import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import Button from '../ui/Button';

export default function CartDrawer({ open, onClose }) {
  const { items, subtotal, itemCount } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            <header className="cart-drawer__head">
              <h3>
                <ShoppingBag size={18} /> Your Cart ({itemCount})
              </h3>
              <button aria-label="Close cart" onClick={onClose}>
                <X size={20} />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="cart-drawer__empty">
                <ShoppingBag size={40} strokeWidth={1.2} />
                <p>Your cart is empty.</p>
                <Button variant="primary" as={Link} to="/products" onClick={onClose}>
                  Start Shopping
                </Button>
              </div>
            ) : (
              <>
                <div className="cart-drawer__list">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
                <footer className="cart-drawer__foot">
                  <div className="cart-drawer__subtotal">
                    <span>Subtotal</span>
                    <span className="price">${subtotal.toFixed(2)}</span>
                  </div>
                  <Button variant="primary" size="lg" as={Link} to="/cart" onClick={onClose} className="w-full">
                    View Cart & Checkout
                  </Button>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
