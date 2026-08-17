import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getDiscountedPrice } from '../../data/products';

export default function CartItem({ item }) {
  const {
    increment,
    decrement,
    removeItem,
  } = useCart();

  const price = getDiscountedPrice(item);

  const handleIncrement = async () => {
    try {
      await increment(item);
    } catch (error) {
      console.error('INCREMENT FAILED:', error);
    }
  };

  const handleDecrement = async () => {
    try {
      await decrement(item);
    } catch (error) {
      console.error('DECREMENT FAILED:', error);
    }
  };

  const handleRemove = async () => {
    try {
      await removeItem(item);
    } catch (error) {
      console.error('REMOVE FAILED:', error);
    }
  };

  return (
    <div className="cart-item">

      {/* PRODUCT IMAGE */}
      <img
        src={item.image}
        alt={item.name}
        className="cart-item__img"
      />

      <div className="cart-item__info">

        {/* PRODUCT NAME */}
        <p className="cart-item__name">
          {item.name}
        </p>

        {/* PRICE */}
        <span className="price cart-item__price">
          ${price.toFixed(2)}
        </span>

        {/* QUANTITY */}
        <div className="cart-item__qty">

          {/* DECREASE */}
          <button
            aria-label="Decrease quantity"
            onClick={handleDecrement}
            disabled={item.quantity <= 1}
          >
            <Minus size={13} />
          </button>

          <span>
            {item.quantity}
          </span>

          {/* INCREASE */}
          <button
            aria-label="Increase quantity"
            onClick={handleIncrement}
          >
            <Plus size={13} />
          </button>

        </div>

      </div>

      {/* DELETE */}
      <button
        className="cart-item__remove"
        aria-label={`Remove ${item.name}`}
        onClick={handleRemove}
      >
        <Trash2 size={16} />
      </button>

    </div>
  );
}