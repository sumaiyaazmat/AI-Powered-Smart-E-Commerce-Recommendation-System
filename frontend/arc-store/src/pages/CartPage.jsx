import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2 } from 'lucide-react';

import CartItem from '../components/cart/CartItem';
import PaymentMethodSelector, {
  PAYMENT_METHODS,
} from '../components/cart/PaymentMethodSelector';

import Button from '../components/ui/Button';

import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

import { apiRequest } from '../services/api';

export default function CartPage() {
  const {
    items,
    subtotal,
    clearCart,
    loadCart,
  } = useCart();

  const { user } = useAuth();
  const { showToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);

  const shipping =
    subtotal > 75 || subtotal === 0
      ? 0
      : 6.99;

  const total = subtotal + shipping;

  // ==========================================================
  // CHECKOUT
  // ==========================================================

  const handleCheckout = async () => {
    // --------------------------------------------------------
    // Check login
    // --------------------------------------------------------

    if (!user?.customerId) {
      showToast(
        'Please login before checkout.',
        'error'
      );
      return;
    }

    // --------------------------------------------------------
    // Check payment method
    // --------------------------------------------------------

    if (!paymentMethod) {
      showToast(
        'Please select a payment method to continue.',
        'error'
      );
      return;
    }

    // --------------------------------------------------------
    // Convert frontend payment ID
    // to backend payment method
    // --------------------------------------------------------

    const selectedMethod = PAYMENT_METHODS.find(
      (method) =>
        method.id === paymentMethod
    );

    if (!selectedMethod) {
      showToast(
        'Invalid payment method.',
        'error'
      );
      return;
    }

    // --------------------------------------------------------
    // Prevent double checkout
    // --------------------------------------------------------

    if (checkingOut) return;

    try {
      setCheckingOut(true);

      console.log(
        'CHECKOUT STARTED FOR CUSTOMER:',
        user.customerId
      );

      console.log(
        'PAYMENT METHOD:',
        selectedMethod.label
      );

      // ------------------------------------------------------
      // Send checkout request to backend
      // ------------------------------------------------------

      const response = await apiRequest(
        `/checkout/${user.customerId}`,
        {
          method: 'POST',

          body: JSON.stringify({
            Payment_Method:
              selectedMethod.label,

            Shipping_Method:
              'Standard',
          }),
        }
      );

      console.log(
        'CHECKOUT SUCCESS:',
        response
      );

      // ------------------------------------------------------
      // Refresh cart from backend
      // Backend already clears the cart
      // ------------------------------------------------------

      await loadCart();

      // ------------------------------------------------------
      // Success message
      // ------------------------------------------------------

      showToast(
        `Order placed successfully! Total: $${Number(
          response.total_amount
        ).toFixed(2)}`,
        'success'
      );

      // Reset payment method
      setPaymentMethod(null);

    } catch (error) {
      console.error(
        'CHECKOUT ERROR:',
        error
      );

      showToast(
        error.message ||
          'Checkout failed. Please try again.',
        'error'
      );

    } finally {
      setCheckingOut(false);
    }
  };

  // ==========================================================
  // EMPTY CART
  // ==========================================================

  if (items.length === 0) {
    return (
      <div className="container empty-state empty-state--tall">
        <ShoppingBag
          size={48}
          strokeWidth={1.2}
        />

        <h2>Your cart is empty</h2>

        <p>
          Browse the catalog and add something
          you'll actually use.
        </p>

        <Button
          as={Link}
          to="/products"
          variant="primary"
        >
          Start Shopping
        </Button>
      </div>
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="container cart-page">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="cart-page__head">

        <h1>Your Cart</h1>

        <button
          className="cart-page__clear"
          onClick={() => {
            clearCart();

            showToast(
              'Cart cleared.',
              'info'
            );
          }}
        >
          <Trash2 size={14} />

          Clear cart
        </button>

      </div>

      {/* ====================================================
          CART
      ==================================================== */}

      <div className="cart-page__grid">

        <div className="cart-page__items">

          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
            />
          ))}

        </div>

        {/* ==================================================
            ORDER SUMMARY
        ================================================== */}

        <aside className="cart-summary">

          <h3>
            Order Summary
          </h3>

          <div className="cart-summary__row">

            <span>
              Subtotal
            </span>

            <span className="price">
              ${subtotal.toFixed(2)}
            </span>

          </div>

          <div className="cart-summary__row">

            <span>
              Shipping
            </span>

            <span className="price">
              {shipping === 0
                ? 'Free'
                : `$${shipping.toFixed(2)}`}
            </span>

          </div>

          {shipping > 0 && (
            <p className="cart-summary__hint">
              Add $
              {(75 - subtotal).toFixed(2)}
              {' '}
              more for free shipping.
            </p>
          )}

          <div className="cart-summary__row cart-summary__row--total">

            <span>
              Total
            </span>

            <span className="price">
              ${total.toFixed(2)}
            </span>

          </div>

          {/* ==================================================
              PAYMENT METHOD
          ================================================== */}

          <PaymentMethodSelector
            selected={paymentMethod}
            onSelect={setPaymentMethod}
          />

          {/* ==================================================
              CHECKOUT BUTTON
          ================================================== */}

          <Button
            variant="accent"
            size="lg"
            className="w-full"
            onClick={handleCheckout}
            disabled={checkingOut}
          >
            {checkingOut
              ? 'Processing Order...'
              : 'Proceed to Checkout'}
          </Button>

          <Link
            to="/products"
            className="cart-summary__continue"
          >
            Continue shopping
          </Link>

        </aside>

      </div>
    </div>
  );
}