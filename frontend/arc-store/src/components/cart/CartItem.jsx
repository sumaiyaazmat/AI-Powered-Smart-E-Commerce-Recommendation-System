import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getDiscountedPrice } from '../../data/products';

export default function CartItem({ item }) {
  const { increment, decrement, removeItem } = useCart();
  const price = getDiscountedPrice(item);

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item__img" />
      <div className="cart-item__info">
        <p className="cart-item__name">{item.name}</p>
        <span className="price cart-item__price">${price.toFixed(2)}</span>
        <div className="cart-item__qty">
          <button aria-label="Decrease quantity" onClick={() => decrement(item.id)}>
            <Minus size={13} />
          </button>
          <span>{item.quantity}</span>
          <button aria-label="Increase quantity" onClick={() => increment(item.id)}>
            <Plus size={13} />
          </button>
        </div>
      </div>
      <button className="cart-item__remove" aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.id)}>
        <Trash2 size={16} />
      </button>
    </div>
  );
}
