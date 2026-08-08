import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCollection } from '../../hooks/useFirestore';
import { Category, Product } from '../../types';
import { Package, FolderPlus, ShoppingBag, LogOut, ExternalLink } from 'lucide-react';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const { data: products } = useCollection<Product>('products');
  const { data: categories } = useCollection<Category>('categories');
  const storeName = import.meta.env.VITE_STORE_NAME || 'Mi Tienda';

  async function handleLogout() {
    try {
      await logout();
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 sm:h-16 sm:py-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/40 border border-rose-500/30 shadow-[0_0_18px_rgba(190,40,40,0.35)]">
                <ShoppingBag className="w-5 h-5 text-rose-300" />
              </div>
              <div>
                <h1 className="font-bold text-white">{storeName}</h1>
                <p className="text-xs text-slate-400">Panel de Administracion</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
              >
                Ver tienda
                <ExternalLink className="w-4 h-4" />
              </a>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-sm text-slate-400">{currentUser?.email}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-rose-400 hover:text-rose-300 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Salir
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <StatCard title="Productos" value={products.length} icon={<Package className="w-6 h-6" />} />
          <StatCard title="Categorias" value={categories.length} icon={<FolderPlus className="w-6 h-6" />} />
          <StatCard 
            title="Valor Total" 
            value={`$${products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}`} 
            icon={<ShoppingBag className="w-6 h-6" />} 
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          <ActionCard
            title="Gestionar Productos"
            description="Agrega, edita o elimina productos"
            icon={<Package className="w-8 h-8" />}
            link="/admin/products"
            count={products.length}
          />
          <ActionCard
            title="Gestionar Categorias"
            description="Organiza tus productos en categorias"
            icon={<FolderPlus className="w-8 h-8" />}
            link="/admin/categories"
            count={categories.length}
          />
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="admin-neon-container p-6">
      <div className="admin-neon-glow-top" />
      <div className="relative flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-black/40 border border-rose-500/20 text-rose-300">
          {icon}
        </div>
      </div>
      <h3 className="relative text-2xl font-bold text-white">{value}</h3>
      <p className="relative text-slate-400 text-sm">{title}</p>
    </div>
  );
}

function ActionCard({ title, description, icon, link, count }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  count: number;
}) {
  return (
    <Link
      to={link}
      className="admin-neon-container group flex items-center gap-4 p-6 sm:p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-400/40 hover:shadow-[0_0_30px_rgba(190,40,40,0.18)] active:scale-[0.98]"
    >
      <div className="admin-neon-glow-top" />
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center bg-black/40 border border-rose-500/20 text-rose-300 flex-shrink-0 shadow-[0_0_18px_rgba(190,40,40,0.15)] group-hover:shadow-[0_0_26px_rgba(190,40,40,0.3)] transition-shadow">
        {icon}
      </div>
      <div className="relative flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-lg text-white">{title}</h3>
          <span className="text-xs font-medium text-rose-300 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
            {count}
          </span>
        </div>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </Link>
  );
}
