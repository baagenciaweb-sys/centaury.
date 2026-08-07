import { Link } from 'react-router-dom';
import { ShoppingBag, MessageCircle, MapPin, Phone } from 'lucide-react';
export default function Footer() {
  const storeName = import.meta.env.VITE_STORE_NAME || 'Centaury shop';
  const storeAddress = import.meta.env.VITE_STORE_ADDRESS || 'Direccion de la Tienda';
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '+5492284740199';
  const storePhone = import.meta.env.VITE_STORE_PHONE || whatsappNumber;
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-slate-900" />
              </div>
              <span className="font-bold text-xl tracking-[0.16em]" style={{ fontFamily: 'Manrope, sans-serif' }}>{storeName}</span>
            </div>
            <p className="text-gray-400">
              Tu tienda de confianza con los mejores productos.
            </p>
          </div>
          {/* Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 tracking-[0.12em]" style={{ fontFamily: 'Manrope, sans-serif' }}>Navegacion</h3>
            <nav className="space-y-3">
              <Link to="/" className="block text-gray-400 hover:text-white transition-colors">
                Inicio
              </Link>
              <Link to="/catalog" className="block text-gray-400 hover:text-white transition-colors">
                Catalogo
              </Link>
              <Link to="/contact" className="block text-gray-400 hover:text-white transition-colors">
                Contacto
              </Link>
              <Link to="/cart" className="block text-gray-400 hover:text-white transition-colors">
                Carrito
              </Link>
            </nav>
          </div>
          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4 tracking-[0.12em]" style={{ fontFamily: 'Manrope, sans-serif' }}>Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span>{storeAddress}</span>
              </div>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
              >
                <MessageCircle className="w-5 h-5 flex-shrink-0" />
                <span>WhatsApp</span>
              </a>
              <a
                href={`tel:${storePhone}`}
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>Llamar</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} {storeName}.tienda creada por Elquedigitaliza® Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
