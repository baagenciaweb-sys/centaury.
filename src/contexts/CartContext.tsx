import { createContext, useContext, useState, ReactNode, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem, Product } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, selectedSize?: string, quantity?: number) => void;
  removeFromCart: (productId: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  cartIconRef: React.RefObject<HTMLElement>;
  flyToCart: (imageUrl: string | undefined, originEl: HTMLElement | null) => void;
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

interface FlyingItem {
  id: number;
  imageUrl?: string;
  startRect: DOMRect;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, selectedSize?: string, quantity: number = 1) => {
    setItems(prev => {
      const existing = prev.find(item => isSameCartLine(item, product.id, selectedSize));
      if (existing) {
        return prev.map(item =>
          isSameCartLine(item, product.id, selectedSize)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedSize }];
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

  // --- Animación "volar al carrito" ---
  const cartIconRef = useRef<HTMLElement>(null);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const flyIdRef = useRef(0);

  const flyToCart = useCallback((imageUrl: string | undefined, originEl: HTMLElement | null) => {
    if (!originEl) return;
    const startRect = originEl.getBoundingClientRect();
    const id = flyIdRef.current++;
    setFlyingItems(prev => [...prev, { id, imageUrl, startRect }]);
  }, []);

  const removeFlyingItem = (id: number) => {
    setFlyingItems(prev => prev.filter(f => f.id !== id));
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      itemCount,
      cartIconRef,
      flyToCart,
    }}>
      {children}

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {flyingItems.map(item => {
            const endRect = cartIconRef.current?.getBoundingClientRect();
            const endTop = endRect ? endRect.top + endRect.height / 2 - 16 : item.startRect.top;
            const endLeft = endRect ? endRect.left + endRect.width / 2 - 16 : item.startRect.left;

            // Punto intermedio para que el vuelo dibuje un pequeño arco hacia arriba
            const midTop = Math.min(item.startRect.top, endTop) - 110;
            const midLeft = (item.startRect.left + endLeft) / 2;

            return (
              <motion.div
                key={item.id}
                style={{
                  position: 'fixed',
                  zIndex: 9999,
                  pointerEvents: 'none',
                  overflow: 'hidden',
                  boxShadow: '0 0 25px rgba(190,40,40,0.55)',
                }}
                initial={{
                  top: item.startRect.top,
                  left: item.startRect.left,
                  width: item.startRect.width,
                  height: item.startRect.height,
                  borderRadius: 16,
                  opacity: 1,
                  scale: 1,
                }}
                animate={{
                  top: [item.startRect.top, midTop, endTop],
                  left: [item.startRect.left, midLeft, endLeft],
                  width: [item.startRect.width, item.startRect.width * 0.55, 32],
                  height: [item.startRect.height, item.startRect.height * 0.55, 32],
                  borderRadius: [16, 16, 9999],
                  opacity: [1, 1, 0.9, 0],
                  scale: [1, 1, 0.9],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.9, ease: [0.33, 0.05, 0.2, 1], times: [0, 0.55, 1] }}
                onAnimationComplete={() => removeFlyingItem(item.id)}
              >
                {item.imageUrl ? (
                  <img src={item.imageUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-rose-600" />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>,
        document.body
      )}
    </CartContext.Provider>
  );
}
