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

function App() {
  return (
    <>
      {/* NUEVO INTRO */}
      <IntroLoader />

      <AuthProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />

            <Routes>
              {/* Páginas públicas */}
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

              {/* Panel de administración */}
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