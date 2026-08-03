import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCollection } from '../hooks/useFirestore';
import { useCart } from '../contexts/CartContext';
import { Category, Product } from '../types';
import { Package, ShoppingCart, Search, Filter, Plus, Minus } from 'lucide-react';

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const productId = searchParams.get('product');
  const [search, setSearch] = useState('');
  const { data: categories } = useCollection<Category>('categories');
  const { data: products } = useCollection<Product>('products');
  const { addToCart } = useCart();

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
    return <ProductDetail product={selectedProduct} categories={categories} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {selectedCategory ? selectedCategory.name : 'Catalogo'}
          </h1>
          {selectedCategory?.description && (
            <p className="text-gray-600">{selectedCategory.description}</p>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Link
              to="/catalog"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !categoryId
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Todos
            </Link>
            {categories.map(category => (
              <Link
                key={category.id}
                to={`/catalog?category=${category.id}`}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  categoryId === category.id
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <Package className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                categories={categories}
                onAddToCart={() => addToCart(product)}
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
  onAddToCart: () => void;
}) {
  const category = categories.find(c => c.id === product.categoryId);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <Link to={`/catalog?product=${product.id}`}>
        <div className="aspect-square bg-gray-100 overflow-hidden relative">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-16 h-16 text-gray-300" />
            </div>
          )}
          {category && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-slate-700 px-2 py-1 rounded-full">
              {category.name}
            </span>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/catalog?product=${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 hover:text-slate-700">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {product.description}
          </p>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-slate-900">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              onAddToCart();
            }}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm font-medium">Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductDetail({ product, categories }: { product: Product; categories: Category[] }) {
  const category = categories.find(c => c.id === product.categoryId);
  const { addToCart, items, updateQuantity } = useCart();
  const cartItem = items.find(item => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to={categoryId ? `/catalog?category=${categoryId}` : '/catalog'}
          className="inline-flex items-center text-slate-700 hover:text-slate-900 font-medium mb-6"
        >
          <Minus className="w-4 h-4 mr-1 rotate-90" />
          Volver al catalogo
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Product Image */}
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-gray-300" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {category && (
                <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full w-fit mb-4">
                  {category.name}
                </span>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description}
              </p>
              <div className="text-4xl font-bold text-slate-900 mb-8">
                ${product.price.toFixed(2)}
              </div>

              <div className="mt-auto">
                {quantity === 0 ? (
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-xl font-semibold transition-colors text-lg"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Agregar al carrito
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-4 bg-slate-800 rounded-xl p-2">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-2xl font-bold text-white min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
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
