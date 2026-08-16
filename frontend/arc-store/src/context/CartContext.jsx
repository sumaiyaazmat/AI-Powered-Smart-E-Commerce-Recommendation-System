import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useCallback,
} from 'react';

import { getDiscountedPrice } from '../data/products';
import { apiRequest } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET':
      return {
        items: action.payload,
      };

    case 'ADD': {
      const { product, quantity = 1 } = action.payload;

      const existing = state.items.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                }
              : item
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            ...product,
            quantity,
          },
        ],
      };
    }

    case 'REMOVE':
      return {
        items: state.items.filter(
          (item) => item.id !== action.payload.id
        ),
      };

    case 'UPDATE_QUANTITY':
      return {
        items: state.items
          .map((item) =>
            item.id === action.payload.id
              ? {
                  ...item,
                  quantity: action.payload.quantity,
                }
              : item
          )
          .filter((item) => item.quantity > 0),
      };

    case 'CLEAR':
      return {
        items: [],
      };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth();

  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
  });

  // ==========================================================
  // LOAD CART FROM BACKEND
  // ==========================================================

  const loadCart = useCallback(async () => {
    if (!user?.customerId) {
      dispatch({
        type: 'SET',
        payload: [],
      });
      return;
    }

    try {
      const data = await apiRequest(
        `/cart/${user.customerId}`
      );

     const backendItems = data.map((item) => ({
  id: item.Product_ID,
  cartItemId: item.Cart_Item_ID,
  productId: item.Product_ID,

  name: item.Product_Name,
  image: item.Image_URL,

  price: item.Price,
  quantity: item.Quantity,
}));

      dispatch({
        type: 'SET',
        payload: backendItems,
      });

      console.log('CART LOADED:', data);
    } catch (error) {
      console.error('LOAD CART ERROR:', error);
    }
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // ==========================================================
  // ADD TO CART
  // ==========================================================

  const addItem = async (product, quantity = 1) => {
  if (!user?.customerId) {
    throw new Error('Please login before adding items to cart.');
  }

  try {
    const data = await apiRequest(
      `/cart/?customer_id=${user.customerId}`,
      {
        method: 'POST',
        body: JSON.stringify({
          Product_ID: product.id,
          Quantity: quantity,
        }),
      }
    );

    console.log('ADD TO CART SUCCESS:', data);

    // Backend successful → frontend cart update
    await loadCart();

    return data;

  } catch (error) {
    console.error('ADD TO CART ERROR:', error);

    // Backend fail ho to bhi frontend cart mein add kar do
    dispatch({
      type: 'ADD',
      payload: {
        product,
        quantity,
      },
    });

    console.log('ADDED TO FRONTEND CART ONLY');

    throw error;
  }
};

  // ==========================================================
  // UPDATE QUANTITY
  // ==========================================================

  const updateQuantity = async (item, quantity) => {
    if (!user?.customerId) {
      throw new Error('Please login first.');
    }

    if (quantity <= 0) {
      return removeItem(item);
    }

    try {
      const data = await apiRequest(
        `/cart/${item.cartItemId}?customer_id=${user.customerId}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            Quantity: quantity,
          }),
        }
      );

      console.log('QUANTITY UPDATED:', data);

      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: {
          id: item.id,
          quantity,
        },
      });
    } catch (error) {
      console.error('UPDATE QUANTITY ERROR:', error);
      throw error;
    }
  };

  // ==========================================================
  // INCREMENT
  // ==========================================================

  const increment = async (item) => {
    await updateQuantity(item, item.quantity + 1);
  };

  // ==========================================================
  // DECREMENT
  // ==========================================================

  const decrement = async (item) => {
    await updateQuantity(item, item.quantity - 1);
  };

  // ==========================================================
  // REMOVE
  // ==========================================================

  const removeItem = async (item) => {
    if (!user?.customerId) {
      throw new Error('Please login first.');
    }

    try {
      await apiRequest(
        `/cart/${item.cartItemId}?customer_id=${user.customerId}`,
        {
          method: 'DELETE',
        }
      );

      console.log('ITEM REMOVED:', item);

      dispatch({
        type: 'REMOVE',
        payload: {
          id: item.id,
        },
      });
    } catch (error) {
      console.error('REMOVE CART ITEM ERROR:', error);
      throw error;
    }
  };

  // ==========================================================
  // CLEAR CART
  // ==========================================================

  const clearCart = async () => {
    // Backend mein abhi clear-cart endpoint nahi hai.
    // Isko next step mein add karenge.
    dispatch({
      type: 'CLEAR',
    });
  };

  // ==========================================================
  // TOTALS
  // ==========================================================

  const subtotal = state.items.reduce(
    (sum, item) =>
      sum + getDiscountedPrice(item) * item.quantity,
    0
  );

  const itemCount = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const api = useMemo(
    () => ({
      items: state.items,
      itemCount,
      subtotal,
      total: subtotal,

      addItem,
      removeItem,
      increment,
      decrement,
      updateQuantity,
      clearCart,
      loadCart,
    }),
    [state.items, itemCount, subtotal, loadCart]
  );

  return (
    <CartContext.Provider value={api}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);