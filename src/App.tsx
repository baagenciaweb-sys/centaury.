import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Categories from './pages/admin/Categories';
import logoCentaury from './assets/images/centaury.jpeg';

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function SplashScreen({ isExiting }: { isExiting: boolean }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black">
      
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-950" />

      <div
        className={`relative transition-opacity duration-300 ${
          isExiting ? "opacity-0" : "opacity-100"
        }`}
      >
        <div
          className="logo-intro"
          style={{
            willChange: "transform",
          }}
        >
          <img
  src={logoCentaury}
  alt="Centaury"
  className="h-44 w-auto rounded-3xl object-contain sm:h-56 lg:h-72"
/>
        </div>
      </div>

      <style>{`
        .logo-intro {
 animation: zoomIn 4.5s cubic-bezier(0.45, 0, 0.25, 1) forwards;
  transform-origin: center center;
  will-change: transform;
  backface-visibility: hidden;
}
@keyframes zoomIn {

  0% {
    transform: scale(0.08);
    opacity: 0;
  }

  25% {
    opacity: 1;
    transform: scale(0.18);
  }

  100% {
    transform: scale(8);
    opacity: 1;
  }

}
      `}</style>

    </div>
  );
}
function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
  const exitTimer = window.setTimeout(() => setIsExiting(true), 2900);
const hideTimer = window.setTimeout(() => setShowSplash(false), 3200);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (showSplash) {
    return <SplashScreen isExiting={isExiting} />;
  }

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/catalog" element={<Layout><Catalog /></Layout>} />
            <Route path="/cart" element={<Layout><Cart /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/categories" element={<Categories />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
