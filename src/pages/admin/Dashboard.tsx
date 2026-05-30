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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">{storeName}</h1>
                <p className="text-xs text-gray-500">Panel de Administración</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
              >
                Ver tienda
                <ExternalLink className="w-4 h-4" />
              </a>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700">{currentUser?.email}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <StatCard title="Productos" value={products.length} icon={<Package className="w-6 h-6" />} />
          <StatCard title="Categorías" value={categories.length} icon={<FolderPlus className="w-6 h-6" />} />
          <StatCard 
            title="Valor Total" 
            value={`$${products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}`} 
            icon={<ShoppingBag className="w-6 h-6" />} 
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ActionCard
            title="Gestionar Productos"
            description="Agrega, edita o elimina productos"
            icon={<Package className="w-8 h-8" />}
            link="/admin/products"
            count={products.length}
          />
          <ActionCard
            title="Gestionar Categorías"
            description="Organiza tus productos en categorías"
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
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-gray-500 text-sm">{title}</p>
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
    <Link to={link} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
              {count}
            </span>
          </div>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </Link>
  );
}
