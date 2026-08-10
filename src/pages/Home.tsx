import { useCollection } from '../hooks/useFirestore';
import { Category, Product } from '../types';
import { Link } from 'react-router-dom';
import {
  Package,
  ChevronRight,
  ShoppingCart,
  MessageCircle,
} from 'lucide-react';

import logoCentaury from '../assets/images/centaury.jpeg';
import heroBanner from '../assets/images/FONDOBANNER.jpeg';

export default function Home() {
  const { data: categories } = useCollection('categories');
  const { data: products } = useCollection('products');

  const storeName =
    import.meta.env.VITE_STORE_NAME || 'centaury';

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="relative min-h-screen">

      {/* =====================================================
          HERO BANNER
          ===================================================== */}

      <section className="relative min-h-[620px] flex items-center overflow-hidden">

        {/* Imagen del banner con movimiento automático */}
        <div
          className="hero-banner-pan absolute inset-0 bg-center"
          style={{
            backgroundImage: `url(${heroBanner})`,
          }}
        />

        {/* Capa oscura del banner - suave para no ocultar la imagen */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-black/35" />

        {/* Capa roja muy sutil */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-red-950/25" />

        {/* Contenido */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">

          <div className="mb-3 flex items-center justify-start -mt-4">

          <img
              src={logoCentaury}
              alt={storeName}
              className="h-auto w-[70%] max-w-[380px] sm:h-32 sm:w-auto lg:h-64 rounded-3xl object-contain p-2 sm:p-4 shadow-2xl ring-1 ring-white/20"
              style={{
                filter:
                  'drop-shadow(0 0 20px rgba(0,0,0,0.45)) brightness(0.95) contrast(1.05)',
              }}
            />

          </div>

     <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mt-8 sm:mt-10 mb-12 max-w-3xl leading-tight">
            Diseños que definen tu identidad.
          </p>

          <p className="text-lg sm:text-xl text-gray-200 mt-4 mb-8 max-w-2xl leading-relaxed">
            Prendas premium con tecnologia DTF, colores intensos y detalles
         unicos.
          </p>

        </div>
      </section>


      {/* =====================================================
          QUICK NAVIGATION
          ===================================================== */}

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="grid gap-4 md:grid-cols-3">

          {/* Catalogo */}

          <Link
            to="/catalog"
            className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-black/45 hover:border-red-900/50 hover:shadow-red-950/30"
          >

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-white/10 p-3">
                <Package className="h-5 w-5 text-red-300" />
              </div>

              <div>

                <h3
                  className="font-semibold text-white"
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                  }}
                >
                  Ver catalogo
                </h3>

                <p className="text-sm text-gray-400">
                  Explora los productos destacados
                </p>

              </div>

            </div>

          </Link>


          {/* Carrito */}

          <Link
            to="/cart"
            className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-black/45 hover:border-red-900/50 hover:shadow-red-950/30"
          >

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-white/10 p-3">
                <ShoppingCart className="h-5 w-5 text-red-300" />
              </div>

              <div>

                <h3
                  className="font-semibold text-white"
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                  }}
                >
                  Tu carrito
                </h3>

                <p className="text-sm text-gray-400">
                  Revisa tus productos elegidos
                </p>

              </div>

            </div>

          </Link>


          {/* Contacto */}

          <Link
            to="/contact"
            className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-black/45 hover:border-red-900/50 hover:shadow-red-950/30"
          >

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-white/10 p-3">
                <MessageCircle className="h-5 w-5 text-red-300" />
              </div>

              <div>

                <h3
                  className="font-semibold text-white"
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                  }}
                >
                  Contactanos
                </h3>

                <p className="text-sm text-gray-400">
                  Habla con nosotros por WhatsApp
                </p>

              </div>

            </div>

          </Link>

        </div>

      </section>


      {/* =====================================================
          CATEGORIAS
          ===================================================== */}

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <h2
          className="text-4xl sm:text-5xl font-bold text-white mb-8 tracking-[0.06em]"
          style={{
            fontFamily: 'ModernTokyo, Manrope, sans-serif',
          }}
        >
          Categorias
        </h2>


        {categories.length === 0 ? (

          <div className="text-center py-12 bg-black/30 backdrop-blur-md border border-white/10 rounded-xl shadow-lg">

            <Package className="w-16 h-16 mx-auto text-gray-500 mb-4" />

            <p className="text-gray-400">
              No hay categorias disponibles
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">

            {categories.map((category: Category) => (

              <Link
                key={category.id}
                to={`/catalog?category=${category.id}`}
                className="group bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl hover:shadow-red-950/30 hover:border-red-900/50 hover:bg-black/45 transition-all duration-300 transform hover:-translate-y-1"
              >

                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-900/40 transition-all duration-300">

                  <Package className="w-6 h-6 sm:w-8 sm:h-8 text-red-300 group-hover:text-white transition-colors" />

                </div>

                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  {category.name}
                </h3>

                {category.description && (

                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                    {category.description}
                  </p>

                )}

              </Link>

            ))}

          </div>

        )}

      </section>


      {/* =====================================================
          PRODUCTOS DESTACADOS
          ===================================================== */}

      {featuredProducts.length > 0 && (

        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-transparent">

          <div className="flex items-center justify-between mb-8 gap-4">

            <h2
              className="text-4xl sm:text-5xl font-bold text-white tracking-[0.06em]"
              style={{
                fontFamily: 'ModernTokyo, Manrope, sans-serif',
              }}
            >
              Productos Destacados
            </h2>

            <Link
              to="/catalog"
              className="text-gray-300 hover:text-red-300 font-semibold flex items-center transition-colors whitespace-nowrap"
            >
              Ver todos

              <ChevronRight className="w-5 h-5 ml-1" />
            </Link>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {featuredProducts.map((product: Product) => (

              <ProductCard
                key={product.id}
                product={product}
              />

            ))}

          </div>

        </section>

      )}


      {/* =====================================================
          INFORMACION DE LA TIENDA
          ===================================================== */}

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="bg-gradient-to-br from-black/70 via-black/60 to-red-950/70 backdrop-blur-md border border-white/10 rounded-2xl p-8 sm:p-12 text-white shadow-2xl">

          <h2
            className="text-4xl sm:text-5xl font-bold mb-4 tracking-[0.06em]"
            style={{
              fontFamily: 'ModernTokyo, Manrope, sans-serif',
            }}
          >
            Necesitas ayuda?
          </h2>

          <p className="text-gray-300 mb-6 text-lg">
            Contactanos por WhatsApp para atencion personalizada
          </p>

          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Contactar
          </Link>

        </div>

      </section>

    </div>
  );
}


/* =========================================================
   TARJETA DE PRODUCTO
   ========================================================= */

function ProductCard({
  product,
}: {
  product: Product;
}) {

  const { data: categories } = useCollection('categories');

  const category = categories.find(
    (c: Category) => c.id === product.categoryId
  );

  return (

    <Link
      to={`/catalog?product=${product.id}`}
      className="group bg-black/35 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-red-950/30 hover:border-red-900/50 transition-all duration-300"
    >

      {/* Imagen */}

      <div className="relative aspect-square overflow-hidden bg-black/40">

        {product.imageUrl ? (

          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

        ) : (

          <div className="w-full h-full flex items-center justify-center">

            <Package className="w-16 h-16 text-gray-600" />

          </div>

        )}

        {/* Degradado inferior de la imagen */}

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

      </div>


      {/* Información */}

      <div className="p-5">

        {category && (

          <p className="text-xs uppercase tracking-wider text-red-300 mb-2">
            {category.name}
          </p>

        )}

        <h3 className="text-lg font-semibold text-white mb-2">
          {product.name}
        </h3>

        <p className="text-sm text-gray-400 line-clamp-2 mb-4">
          {product.description}
        </p>

        <div className="flex items-center justify-between">

          <span className="text-xl font-bold text-white">
            ${product.price.toFixed(2)}
          </span>

          <span className="text-sm text-red-300 group-hover:text-red-200 transition-colors">
            Ver producto
          </span>

        </div>

      </div>

    </Link>

  );
}
