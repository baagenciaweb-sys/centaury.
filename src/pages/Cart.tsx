import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useCollection } from '../hooks/useFirestore';
import { Category } from '../types';
import { Package, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, total, itemCount } = useCart();
  const { data: categories } = useCollection<Category>('categories');
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5492284740199';

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl rounded-[32px] border border-slate-200 bg-white/90 px-8 py-16 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-sm sm:px-12 lg:px-16 lg:py-24">
          <ShoppingBag className="w-32 h-32 mx-auto text-gray-300 mb-8" />
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">Tu carrito esta vacio</h2>
          <p className="text-2xl sm:text-3xl text-gray-500 mb-10 leading-relaxed">Agrega productos para comenzar</p>
          <Link
            to="/catalog"
            className="inline-flex items-center px-8 py-4 bg-slate-800 hover:bg-slate-900 text-white text-xl font-semibold rounded-2xl transition-colors"
          >
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  // Agrupar los items del carrito por categoria
  const groups = categories
    .map(category => ({
      category,
      items: items.filter(item => item.product.categoryId === category.id),
    }))
    .filter(group => group.items.length > 0);

  const itemsWithoutCategory = items.filter(
    item => !categories.some(c => c.id === item.product.categoryId)
  );

  const whatsappMessage = encodeURIComponent(
    `Hola! Me gustaria hacer el siguiente pedido:\n\n` +
      groups
        .map(group =>
          `*${group.category.name.toUpperCase()}*\n` +
          group.items
            .map(item => `- ${item.product.name}${item.selectedSize ? ` (Talle ${item.selectedSize})` : ''} x${item.quantity} = $${(item.product.price * item.quantity).toFixed(2)}`)
            .join('\n')
        )
        .join('\n\n') +
      (itemsWithoutCategory.length > 0
        ? `\n\n${itemsWithoutCategory
            .map(item => `- ${item.product.name}${item.selectedSize ? ` (Talle ${item.selectedSize})` : ''} x${item.quantity} = $${(item.product.price * item.quantity).toFixed(2)}`)
            .join('\n')}`
        : '') +
      `\n\nTotal: $${total.toFixed(2)}`
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Carrito de Compras</h1>
            <p className="text-gray-500 mt-1">{itemCount} productos</p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Vaciar carrito
          </button>
        </div>

        <div className="space-y-8">
          {groups.map(group => (
            <div key={group.category.id}>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 px-1">
                {group.category.name}
                <span className="ml-2 text-xs font-normal normal-case text-gray-400">
                  ({group.items.reduce((sum, i) => sum + i.quantity, 0)} prendas)
                </span>
              </h2>
              <div className="space-y-4">
                {group.items.map(item => (
                  <CartItemCard
                    key={`${item.product.id}-${item.selectedSize || 'nosize'}`}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
            </div>
          ))}

          {itemsWithoutCategory.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 px-1">
                Otros productos
              </h2>
              <div className="space-y-4">
                {itemsWithoutCategory.map(item => (
                  <CartItemCard
                    key={`${item.product.id}-${item.selectedSize || 'nosize'}`}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del pedido</h2>

          <div className="space-y-2 mb-6">
            {groups.map(group => (
              <div key={group.category.id} className="flex justify-between text-sm text-gray-500">
                <span>{group.category.name} ({group.items.reduce((sum, i) => sum + i.quantity, 0)})</span>
                <span>${group.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 mb-6 border-t pt-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Envio</span>
              <span className="text-green-600">A calcular</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-4">
            Revisa talles y cantidades antes de confirmar. Podes editarlos con los botones + y - en cada producto.
          </p>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-semibold transition-colors"
          >
            Realizar pedido por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove
}: {
  item: { product: any; quantity: number; selectedSize?: string };
  onUpdateQuantity: (id: string, qty: number, selectedSize?: string) => void;
  onRemove: (id: string, selectedSize?: string) => void;
}) {
  const { product, quantity, selectedSize } = item;
  const stockForSize: number | undefined = selectedSize ? product.stockBySize?.[selectedSize] : undefined;
  const reachedMax = typeof stockForSize === 'number' && quantity >= stockForSize;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex gap-4">
      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-300" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
            {selectedSize && (
              <span className="inline-block mt-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-medium">
                Talle {selectedSize}
              </span>
            )}
          </div>
          <button
            onClick={() => onRemove(product.id, selectedSize)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-1 mb-3">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onUpdateQuantity(product.id, quantity - 1, selectedSize)}
              className="w-8 h-8 flex items-center justify-center hover:bg-white rounded transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-semibold w-6 text-center">{quantity}</span>
            <button
              onClick={() => !reachedMax && onUpdateQuantity(product.id, quantity + 1, selectedSize)}
              disabled={reachedMax}
              className="w-8 h-8 flex items-center justify-center hover:bg-white rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <span className="font-bold text-gray-900">
            ${(product.price * quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
