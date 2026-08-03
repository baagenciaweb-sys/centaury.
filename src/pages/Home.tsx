import { useCollection } from '../hooks/useFirestore';
import { Category, Product } from '../types';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, ShoppingCart, MessageCircle } from 'lucide-react';
import logoCentaury from '../assets/images/centaury.jpeg';
import heroBanner from '../assets/images/FONDOBANNER.jpeg';
export default function Home() {
  const { data: categories } = useCollection<Category>('categories');
  const { data: products } = useCollection<Product>('products');
  const storeName = import.meta.env.VITE_STORE_NAME || 'centaury';

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative overflow-hidden text-white">
        <div className="absolute inset-0">
          <img
            src={heroBanner}
            alt=""
            className="h-full w-full object-cover object-[80%_center] scale-[1.04]"
            style={{ filter: 'brightness(1.65) contrast(1.6) saturate(1.45)', imageRendering: 'auto' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-900/50 to-slate-950/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="mb-3 flex items-center justify-start -mt-4">
            <img
              src={logoCentaury}
              alt={storeName}
              className="h-32 w-auto sm:h-44 lg:h-64 rounded-3xl object-contain p-4 shadow-2xl ring-1 ring-white/20"
              style={{ filter: 'drop-shadow(0 0 0 rgba(255,255,255,0.0)) brightness(0.95) contrast(1.05)' }}
            />
          </div>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-6 max-w-3xl leading-tight">
            Disenos que definen tu identidad.
          </p>
          <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
            Prendas premium con tecnologia DTF de ultima generacion, colores intensos y detalles creados para destacar.
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Ver Catalogo
            <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Quick Navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          <Link to="/catalog" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-slate-100 p-3">
                <Package className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>Ver catalogo</h3>
                <p className="text-sm text-gray-500">Explora los productos destacados</p>
              </div>
            </div>
          </Link>

          <Link to="/cart" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-slate-100 p-3">
                <ShoppingCart className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>Tu carrito</h3>
                <p className="text-sm text-gray-500">Revisa tus productos elegidos</p>
              </div>
            </div>
          </Link>

          <Link to="/contact" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-slate-100 p-3">
                <MessageCircle className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>Contactanos</h3>
                <p className="text-sm text-gray-500">Habla con nosotros por WhatsApp</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-5xl font-bold text-gray-900 mb-8 tracking-[0.06em]" style={{ fontFamily: 'ModernTokyo, Manrope, sans-serif' }}>Categorias</h2>
        {categories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No hay categorias disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map(category => (
              <Link
                key={category.id}
                to={`/catalog?category=${category.id}`}
                className="group bg-white rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center mb-4 group-hover:from-slate-800 group-hover:to-slate-900 transition-all duration-300">
                  <Package className="w-6 h-6 sm:w-8 sm:h-8 text-slate-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{category.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-5xl font-bold text-gray-900 tracking-[0.06em]" style={{ fontFamily: 'ModernTokyo, Manrope, sans-serif' }}>Productos Destacados</h2>
            <Link
              to="/catalog"
              className="text-slate-700 hover:text-slate-900 font-semibold flex items-center"
            >
              Ver todos
              <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Store Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 sm:p-12 text-white">
          <h2 className="text-5xl font-bold mb-4 tracking-[0.06em]" style={{ fontFamily: 'ModernTokyo, Manrope, sans-serif' }}>Necesitas ayuda?</h2>
          <p className="text-gray-300 mb-6 text-lg">
            Contactanos por WhatsApp para atencion personalizada
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
          >
            Contactar
          </Link>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { data: categories } = useCollection<Category>('categories');
  const category = categories.find(c => c.id === product.categoryId);

  return (
    <Link
      to={`/catalog?product=${product.id}`}
      className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="aspect-square bg-gray-200 overflow-hidden">
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
      </div>
      <div className="p-4 sm:p-6">
        {category && (
          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
            {category.name}
          </span>
        )}
        <h3 className="text-lg font-semibold text-gray-900 mt-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {product.description}
        </p>
        <p className="text-xl font-bold text-slate-900 mt-3">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
