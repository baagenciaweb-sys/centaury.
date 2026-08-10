import { useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useCollection } from '../hooks/useFirestore';
import { useCart } from '../contexts/CartContext';
import { Category, Product } from '../types';
import { Package, ShoppingCart, Search, Plus, Minus } from 'lucide-react';

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const productId = searchParams.get('product');
  const [search, setSearch] = useState('');
  const { data: categories } = useCollection<Category>('categories');
  const { data: products } = useCollection<Product>('products');
  const { addToCart, flyToCart } = useCart();

  const filteredProducts = products.filter(product => {
    const matchesCategory = !categoryId || product.categoryId === categoryId;
    const matchesSearch = !search || 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedCategory = categories.find(c => c.id === categoryId);
  const selectedProduct = productId ? products.find(p => p.id === productId) : null;

  if (selectedProduct) {
    return <ProductDetail product={selectedProduct} categories={categories} categoryId={categoryId} />;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {selectedCategory ? selectedCategory.name : 'Catalogo'}
          </h1>
          {selectedCategory?.description && (
            <p className="text-slate-400">{selectedCategory.description}</p>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-400/50 focus:outline-none"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Link
              to="/catalog"
              className={`px-4 py-2 rounded-full font-medium text-sm border transition-all duration-300 ${
                !categoryId
                  ? 'bg-rose-600 border-rose-600 text-white shadow-[0_0_20px_rgba(190,40,40,0.3)]'
                  : 'bg-black/30 text-slate-200 border-white/10 hover:border-rose-400/50 hover:text-white'
              }`}
            >
              Todos
            </Link>
            {categories.map(category => (
              <Link
                key={category.id}
                to={`/catalog?category=${category.id}`}
                className={`px-4 py-2 rounded-full font-medium text-sm border transition-all duration-300 ${
                  categoryId === category.id
                    ? 'bg-rose-600 border-rose-600 text-white shadow-[0_0_20px_rgba(190,40,40,0.3)]'
                    : 'bg-black/30 text-slate-200 border-white/10 hover:border-rose-400/50 hover:text-white'
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="admin-neon-container text-center py-16">
            <div className="admin-neon-glow-top" />
            <Package className="relative w-20 h-20 mx-auto text-slate-600 mb-4" />
            <p className="relative text-slate-400 text-lg">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" style={{ perspective: 1200 }}>
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                categories={categories}
                onAddToCart={(el) => {
                  flyToCart(product.imageUrl, el);
                  addToCart(product);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ 
  product, 
  categories,
  onAddToCart 
}: { 
  product: Product;
  categories: Category[];
  onAddToCart: (originEl: HTMLElement | null) => void;
}) {
  const category = categories.find(c => c.id === product.categoryId);
  const cardRef = useRef<HTMLDivElement>(null);
  const hasSizes = !!product.sizes && product.sizes.length > 0;
  const totalStock = hasSizes
    ? product.sizes!.reduce((sum, s) => sum + (product.stockBySize?.[s] ?? 0), 0)
    : Infinity;
  const isSoldOut = hasSizes && totalStock <= 0;

  // --- Tilt 3D al mouse ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);
  const scale = useSpring(1, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => scale.set(1.04);
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d' }}
      className="admin-neon-container group overflow-hidden hover:-translate-y-0.5 hover:border-rose-400/40 hover:shadow-[0_0_30px_rgba(190,40,40,0.18)] transition-all duration-300"
    >
      <div className="admin-neon-glow-top" />
      <Link to={`/catalog?product=${product.id}`}>
        <div className="aspect-square bg-black/30 overflow-hidden relative">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-16 h-16 text-slate-600" />
            </div>
          )}
          {category && (
            <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-xs font-medium text-rose-200 border border-white/10 px-2 py-1 rounded-full">
              {category.name}
            </span>
          )}
          {isSoldOut && (
            <span className="absolute top-3 right-3 bg-red-600/90 backdrop-blur-sm text-xs font-bold text-white px-2 py-1 rounded-full">
              Agotado
            </span>
          )}
        </div>
      </Link>
      
      <div className="relative p-4" style={{ transform: 'translateZ(20px)' }}>
        <Link to={`/catalog?product=${product.id}`}>
          <h3 className="font-semibold text-white mb-1 line-clamp-1 hover:text-rose-300 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-2 mb-3">
            {product.description}
          </p>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-white">
            ${product.price.toFixed(2)}
          </span>
          {product.sizes && product.sizes.length > 0 ? (
            <Link
              to={`/catalog?product=${product.id}`}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-[0_0_18px_rgba(190,40,40,0.25)]"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm font-medium">{isSoldOut ? 'Ver producto' : 'Elegir talle'}</span>
            </Link>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                onAddToCart(e.currentTarget);
              }}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-[0_0_18px_rgba(190,40,40,0.25)]"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm font-medium">Agregar</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ProductDetail({ 
  product, 
  categories,
  categoryId,
}: { 
  product: Product; 
  categories: Category[];
  categoryId: string | null;
}) {
  const category = categories.find(c => c.id === product.categoryId);
  const { addToCart, items, updateQuantity, flyToCart } = useCart();
  const hasSizes = !!product.sizes && product.sizes.length > 0;
  const getStock = (size?: string) => {
    if (!size) return Infinity;
    return product.stockBySize?.[size] ?? 0;
  };
  const firstAvailableSize = hasSizes
    ? product.sizes!.find(s => getStock(s) > 0) || product.sizes![0]
    : undefined;
  const [selectedSize, setSelectedSize] = useState<string | undefined>(firstAvailableSize);
  const cartItem = items.find(
    item => item.product.id === product.id && (item.selectedSize || undefined) === (selectedSize || undefined)
  );
  const quantity = cartItem?.quantity || 0;
  const sizeStock = getStock(selectedSize);
  const outOfStock = hasSizes && selectedSize ? sizeStock <= 0 : false;
  const reachedMax = hasSizes && selectedSize ? quantity >= sizeStock : false;
  // El talle no está elegido solo si el producto tiene talles y ninguno quedó seleccionado
  const sizeMissing = hasSizes && !selectedSize;

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to={categoryId ? `/catalog?category=${categoryId}` : '/catalog'}
          className="inline-flex items-center text-slate-300 hover:text-white font-medium mb-6 transition-colors"
        >
          <Minus className="w-4 h-4 mr-1 rotate-90" />
          Volver al catalogo
        </Link>

        <div className="admin-neon-container overflow-hidden">
          <div className="admin-neon-glow-top" />
          <div className="relative grid md:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Product Image */}
            <div className="aspect-square bg-black/30 rounded-xl overflow-hidden">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-slate-600" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {category && (
                <span className="text-sm font-medium text-rose-200 bg-black/40 border border-rose-500/20 px-3 py-1 rounded-full w-fit mb-4">
                  {category.name}
                </span>
              )}
              <h1 className="text-3xl font-bold text-white mb-4">
                {product.name}
              </h1>
              <p className="text-slate-400 mb-6 leading-relaxed">
                {product.description}
              </p>
              <div className="text-4xl font-bold text-white mb-8">
                ${product.price.toFixed(2)}
              </div>

              {hasSizes && (
                <div className="mb-8">
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Talle
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes!.map(size => {
                      const stockForSize = getStock(size);
                      const disabled = stockForSize <= 0;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => !disabled && setSelectedSize(size)}
                          disabled={disabled}
                          className={`px-4 py-2 rounded-lg font-medium text-sm border transition-colors ${
                            disabled
                              ? 'bg-black/20 text-slate-600 border-white/5 line-through cursor-not-allowed'
                              : selectedSize === size
                                ? 'bg-rose-600 text-white border-rose-600 shadow-[0_0_18px_rgba(190,40,40,0.25)]'
                                : 'bg-black/30 text-slate-200 border-white/10 hover:border-rose-400/50'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                  {selectedSize && (
                    <p className={`text-xs mt-2 ${outOfStock ? 'text-red-400' : 'text-slate-500'}`}>
                      {outOfStock
                        ? 'Talle agotado'
                        : `${sizeStock} disponibles`}
                    </p>
                  )}
                  {sizeMissing && (
                    <p className="text-xs mt-2 text-rose-300">
                      Elegi un talle para poder agregar al carrito
                    </p>
                  )}
                </div>
              )}

              <div className="mt-auto">
                {quantity === 0 ? (
                  <button
                    onClick={(e) => {
                      flyToCart(product.imageUrl, e.currentTarget);
                      addToCart(product, selectedSize);
                    }}
                    disabled={sizeMissing || outOfStock}
                    className="w-full flex items-center justify-center gap-3 bg-rose-600 hover:bg-rose-500 text-white py-4 rounded-xl font-semibold transition-colors text-lg shadow-[0_0_20px_rgba(190,40,40,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {outOfStock ? 'Sin stock' : sizeMissing ? 'Elegi un talle' : 'Agregar al carrito'}
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-4 bg-black/30 border border-white/10 rounded-xl p-2">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1, selectedSize)}
                      className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-2xl font-bold text-white min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={(e) => {
                        if (reachedMax) return;
                        flyToCart(product.imageUrl, e.currentTarget);
                        updateQuantity(product.id, quantity + 1, selectedSize);
                      }}
                      disabled={reachedMax}
                      className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
