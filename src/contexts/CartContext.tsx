import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, selectedSize?: string) => void;
  removeFromCart: (productId: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Un mismo producto con distinto talle debe tratarse como items distintos
function isSameCartLine(item: CartItem, productId: string, selectedSize?: string) {
  return item.product.id === productId && (item.selectedSize || undefined) === (selectedSize || undefined);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, selectedSize?: string) => {
    setItems(prev => {
      const existing = prev.find(item => isSameCartLine(item, product.id, selectedSize));
      if (existing) {
        return prev.map(item =>
          isSameCartLine(item, product.id, selectedSize)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedSize }];
    });
  };

  const removeFromCart = (productId: string, selectedSize?: string) => {
    setItems(prev => prev.filter(item => !isSameCartLine(item, productId, selectedSize)));
  };

  const updateQuantity = (productId: string, quantity: number, selectedSize?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        isSameCartLine(item, productId, selectedSize)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}
