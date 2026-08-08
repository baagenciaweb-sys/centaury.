import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

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

import IntroLoader from './components/IntroLoader';

/* =========================================================
   SCROLL SUAVE PARA EL FONDO
   ========================================================= */

function ScrollBackground() {
  useEffect(() => {
    let animationFrame = 0;

    const updateBackground = () => {
      const scrollY = window.scrollY;

      document.documentElement.style.setProperty(
        '--scroll-y',
        `${scrollY}px`
      );

      animationFrame = 0;
    };

    const handleScroll = () => {
      if (!animationFrame) {
        animationFrame = requestAnimationFrame(updateBackground);
      }
    };

    updateBackground();

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return null;
}

/* =========================================================
   VOLVER ARRIBA AL CAMBIAR DE PÁGINA
   ========================================================= */

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [location.pathname]);

  return null;
}

/* =========================================================
   LAYOUT
   ========================================================= */

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAdminPage) {
    return <>{children}</>;
  }

 return (
  <div
    className="min-h-screen flex flex-col"
    style={{ fontFamily: 'Manrope, sans-serif' }}
  >

    <Header />

    <main className="flex-1">
      {children}
    </main>

    <Footer />

  </div>
);
}

/* =========================================================
   APP
   ========================================================= */

function App() {
  return (
    <>
      <AuthProvider>
        <CartProvider>
          <Router>

            {/* Pantalla de pre-inicio (se muestra una vez por sesión) */}
            <IntroLoader />

            {/* Controla el movimiento del fondo con el scroll */}
            <ScrollBackground />

            {/* Mantiene el comportamiento actual de navegación */}
            <ScrollToTop />

            <Routes>

              {/* =========================
                  PÁGINAS PÚBLICAS
                  ========================= */}

              <Route
                path="/"
                element={
                  <Layout>
                    <Home />
                  </Layout>
                }
              />

              <Route
                path="/catalog"
                element={
                  <Layout>
                    <Catalog />
                  </Layout>
                }
              />

              <Route
                path="/cart"
                element={
                  <Layout>
                    <Cart />
                  </Layout>
                }
              />

              <Route
                path="/contact"
                element={
                  <Layout>
                    <Contact />
                  </Layout>
                }
              />

              {/* =========================
                  PANEL DE ADMINISTRACIÓN
                  ========================= */}

              <Route
                path="/admin/login"
                element={<Login />}
              />

              <Route
                path="/admin"
                element={<Dashboard />}
              />

              <Route
                path="/admin/products"
                element={<Products />}
              />

              <Route
                path="/admin/categories"
                element={<Categories />}
              />

            </Routes>

          </Router>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;
