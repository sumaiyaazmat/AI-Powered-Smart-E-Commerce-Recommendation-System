import { CreditCard, Wallet, Landmark, Banknote } from 'lucide-react';

// Frontend-only placeholder, same spirit as AuthContext — no real payment
// processor is wired up. `selected` is lifted to the parent (CartPage) so
// the chosen method can be sent along with a real order once checkout
// connects to a backend.
export const PAYMENT_METHODS = [
  { id: 'credit-card', label: 'Credit Card', icon: CreditCard },
  { id: 'debit-card', label: 'Debit Card', icon: Landmark },
  { id: 'paypal', label: 'PayPal', icon: Wallet },
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
];

export default function PaymentMethodSelector({ selected, onSelect }) {
  return (
    <div className="payment-methods" role="radiogroup" aria-label="Payment method">
      <h4>Payment Method</h4>
      <div className="payment-methods__grid">
        {PAYMENT_METHODS.map((m) => {
          const Icon = m.icon;
          const isActive = selected === m.id;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              className={`payment-method ${isActive ? 'is-active' : ''}`}
              onClick={() => onSelect(m.id)}
            >
              <Icon size={18} />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
