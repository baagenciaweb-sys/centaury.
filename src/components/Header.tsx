tsx
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';
import { ShoppingBag, ShoppingCart, Menu, X, User, Sparkles } from 'lucide-react';

export default function Header() {
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const storeName = import.meta.env.VITE_STORE_NAME || 'Centaury Shop';

  const navItems = [
    { label: 'Inicio', to: '/' },
    { label: 'Catalogo', to: '/catalog' },
    { label: 'Contacto', to: '/contact' },
    { label: 'Carrito', to: '/cart' },
  ];

  // Mensajes que aparecerán en el banner (se duplican internamente para el bucle infinito)
  const bannerMessages = [
    '🚀 ENVÍOS A TODO EL PAÍS',
  
  ];

  return (
    <div className="w-full">
      {/* Estilos CSS inyectados para la animación en bucle continuo */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* BANNER SCROLL EN BUCLE */}
      <div className="relative z-50 w-full overflow-hidden border-b border-rose-500/20 bg-black/80 py-2.5 backdrop-blur-md">
        <div className="animate-marquee flex items-center gap-12 text-xs font-semibold uppercase tracking-widest text-slate-300">
          {/* Primer grupo de mensajes */}
          <div className="flex items-center gap-12">
            {bannerMessages.map((msg, index) => (
              <span key={`b1-${index}`} className="flex items-center gap-3 whitespace-nowrap">
                <Sparkles className="h-3.5 w-3.5 text-rose-400" />
                <span>{msg}</span>
              </span>
            ))}
          </div>

          {/* Segundo grupo duplicado (indispensable para el bucle perfecto) */}
          <div className="flex items-center gap-12">
            {bannerMessages.map((msg, index) => (
              <span key={`b2-${index}`} className="flex items-center gap-3 whitespace-nowrap">
                <Sparkles className="h-3.5 w-3.5 text-rose-400" />
                <span>{msg}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* HEADER DE LA PÁGINA */}
      <header className="sticky top-4 z-40 px-3 pt-3 sm:px-4 lg:px-6">
        <div className="relative mx-auto flex max-w-7xl items-center justify-between rounded-[30px] border border-white/10 px-3 py-2.5 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_70px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl sm:px-4 lg:px-5">
          <div className="absolute inset-0 overflow-hidden rounded-[30px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(185,90,80,0.22),transparent_36%),linear-gradient(135deg,rgba(0,0,0,0.96),rgba(18,8,10,0.92)_48%,rgba(6,6,6,0.98))]" />
            <div className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-rose-500/60 to-transparent" />
            <div className="absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          <Link to="/" className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-[0_0_18px_rgba(170,80,80,0.18)] backdrop-blur-sm sm:h-12 sm:w-12">
              <ShoppingBag className="h-5 w-5 text-white sm:h-6 sm:w-6" />
            </div>
            <span
              className="font-brand text-[1.45rem] font-extrabold leading-none tracking-[0.16em] text-white sm:text-[1.8rem]"
              style={{ fontFamily: 'ModernTokyo, Manrope, sans-serif', fontWeight: 800 }}
            >
              {storeName}
            </span>
          </Link>

          <nav className="relative hidden items-center gap-2 md:flex xl:gap-3">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group relative overflow-hidden rounded-full border border-white/10 bg-black/30 px-3.5 py-2 text-sm font-medium text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-500 hover:-translate-y-0.5 hover:border-rose-400/50 hover:text-white hover:shadow-[0_0_20px_rgba(170,40,40,0.16),inset_0_0_18px_rgba(180,60,60,0.08)] active:scale-[0.97]"
              >
                <span className="absolute inset-0 scale-0 rounded-full bg-[radial-gradient(circle,rgba(190,60,60,0.35),rgba(190,60,60,0.05)_55%,transparent_80%)] transition-transform duration-500 group-hover:scale-150" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="relative flex items-center gap-2 sm:gap-3">
            <Link
              to="/cart"
              className="group relative overflow-hidden rounded-full border border-white/10 bg-black/30 p-2.5 text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-500 hover:-translate-y-0.5 hover:border-rose-400/50 hover:text-white hover:shadow-[0_0_20px_rgba(170,40,40,0.16),inset_0_0_18px_rgba(180,60,60,0.08)] active:scale-[0.97]"
            >
              <span className="absolute inset-0 scale-0 rounded-full bg-[radial-gradient(circle,rgba(190,60,60,0.35),rgba(190,60,60,0.05)_55%,transparent_80%)] transition-transform duration-500 group-hover:scale-150" />
              <ShoppingCart className="relative z-10 h-5 w-5 sm:h-6 sm:w-6" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/90 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            
              <a href="/admin/login"
              className="group hidden items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-black/30 px-3.5 py-2 text-sm font-medium text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-500 hover:-translate-y-0.5 hover:border-rose-400/50 hover:text-white hover:shadow-[0_0_20px_rgba(170,40,40,0.16),inset_0_0_18px_rgba(180,60,60,0.08)] active:scale-[0.97] md:flex"
            >
              <span className="absolute inset-0 scale-0 rounded-full bg-[radial-gradient(circle,rgba(190,60,60,0.35),rgba(190,60,60,0.05)_55%,transparent_80%)] transition-transform duration-500 group-hover:scale-150" />
              <User className="relative z-10 h-4 w-4" />
              <span className="relative z-10">Admin</span>
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="group rounded-full border border-white/10 bg-black/30 p-2.5 text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-500 hover:-translate-y-0.5 hover:border-rose-400/50 hover:text-white hover:shadow-[0_0_20px_rgba(170,40,40,0.16),inset_0_0_18px_rgba(180,60,60,0.08)] active:scale-[0.97] md:hidden"
            >
              <span className="absolute inset-0 scale-0 rounded-full bg-[radial-gradient(circle,rgba(190,60,60,0.35),rgba(190,60,60,0.05)_55%,transparent_80%)] transition-transform duration-500 group-hover:scale-150" />
              {mobileMenuOpen ? <X className="relative z-10 h-5 w-5" /> : <Menu className="relative z-10 h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mx-auto mt-3 max-w-7xl rounded-[24px] border border-white/10 bg-black/70 px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl md:hidden">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-slate-200 transition-all duration-300 hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              
                <a href="/admin/login"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-slate-200 transition-all duration-300 hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-white"
              >
                <User className="h-4 w-4" />
                Admin
              </a>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}
