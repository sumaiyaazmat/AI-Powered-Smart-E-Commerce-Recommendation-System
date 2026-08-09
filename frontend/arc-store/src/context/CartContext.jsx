import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { getDiscountedPrice } from '../data/products';

const CartContext = createContext(null);
const STORAGE_KEY = 'arc_cart_v1';

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { items: JSON.parse(raw) };
  } catch (err) {
    console.warn('Could not read cart from storage', err);
  }
  return { items: [] };
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
          ),
        };
      }
      return { items: [...state.items, { ...product, quantity }] };
    }
    case 'REMOVE':
      return { items: state.items.filter((i) => i.id !== action.payload.id) };
    case 'INCREMENT':
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    case 'DECREMENT':
      return {
        items: state.items
          .map((i) => (i.id === action.payload.id ? { ...i, quantity: i.quantity - 1 } : i))
          .filter((i) => i.quantity > 0),
      };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const api = useMemo(() => {
    const subtotal = state.items.reduce(
      (sum, i) => sum + getDiscountedPrice(i) * i.quantity,
      0
    );
    const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

    return {
      items: state.items,
      itemCount,
      subtotal,
      total: subtotal, // shipping/tax hooks go here once the backend is connected
      addItem: (product, quantity = 1) => dispatch({ type: 'ADD', payload: { product, quantity } }),
      removeItem: (id) => dispatch({ type: 'REMOVE', payload: { id } }),
      increment: (id) => dispatch({ type: 'INCREMENT', payload: { id } }),
      decrement: (id) => dispatch({ type: 'DECREMENT', payload: { id } }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
    };
  }, [state.items]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
