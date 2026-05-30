import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';
import { ShoppingBag, ShoppingCart, Menu, X, User } from 'lucide-react';

export default function Header() {
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const storeName = import.meta.env.VITE_STORE_NAME || 'Mi Tienda';

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg sm:text-xl">
              {storeName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Inicio
            </Link>
            <Link to="/catalog" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Catálogo
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Contacto
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-slate-800 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            <div className="hidden md:block">
              <a
                href="/admin/login"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                <User className="w-5 h-5" />
                Admin
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 pb-4">
            <nav className="flex flex-col gap-3 pt-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Inicio
              </Link>
              <Link
                to="/catalog"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Catálogo
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Contacto
              </Link>
              <a
                href="/admin/login"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                <User className="w-5 h-5" />
                Admin
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
