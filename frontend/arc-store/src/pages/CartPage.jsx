import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2 } from 'lucide-react';
import CartItem from '../components/cart/CartItem';
import PaymentMethodSelector, { PAYMENT_METHODS } from '../components/cart/PaymentMethodSelector';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function CartPage() {
  const { items, subtotal, clearCart } = useCart();
  const { showToast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const shipping = subtotal > 75 || subtotal === 0 ? 0 : 6.99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container empty-state empty-state--tall">
        <ShoppingBag size={48} strokeWidth={1.2} />
        <h2>Your cart is empty</h2>
        <p>Browse the catalog and add something you'll actually use.</p>
        <Button as={Link} to="/products" variant="primary">Start Shopping</Button>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!paymentMethod) {
      showToast('Please select a payment method to continue.', 'error');
      return;
    }
    const methodLabel = PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label;
    showToast(`Checkout isn\u2019t connected yet — this is a frontend demo. (${methodLabel} selected)`, 'info');
  };

  return (
    <div className="container cart-page">
      <div className="cart-page__head">
        <h1>Your Cart</h1>
        <button className="cart-page__clear" onClick={() => { clearCart(); showToast('Cart cleared.', 'info'); }}>
          <Trash2 size={14} /> Clear cart
        </button>
      </div>

      <div className="cart-page__grid">
        <div className="cart-page__items">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <aside className="cart-summary">
          <h3>Order Summary</h3>
          <div className="cart-summary__row">
            <span>Subtotal</span>
            <span className="price">${subtotal.toFixed(2)}</span>
          </div>
          <div className="cart-summary__row">
            <span>Shipping</span>
            <span className="price">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </div>
          {shipping > 0 && <p className="cart-summary__hint">Add ${(75 - subtotal).toFixed(2)} more for free shipping.</p>}
          <div className="cart-summary__row cart-summary__row--total">
            <span>Total</span>
            <span className="price">${total.toFixed(2)}</span>
          </div>

          <PaymentMethodSelector selected={paymentMethod} onSelect={setPaymentMethod} />

          <Button
            variant="accent"
            size="lg"
            className="w-full"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </Button>
          <Link to="/products" className="cart-summary__continue">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}
