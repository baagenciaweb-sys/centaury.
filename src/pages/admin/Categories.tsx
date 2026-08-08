import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCollection } from '../../hooks/useFirestore';
import { Category, Product } from '../../types';
import { FolderPlus, Plus, Edit, Trash2, X, Package } from 'lucide-react';

export default function Categories() {
  const { data: categories, add, update, remove, loading } = useCollection<Category>('categories');
  const { data: products } = useCollection<Product>('products');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const categoryData = {
      name: formData.name,
      description: formData.description,
      createdAt: new Date()
    };

    if (editingCategory) {
      await update(editingCategory.id, categoryData);
    } else {
      await add(categoryData);
    }

    resetForm();
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (category: Category) => {
    const hasProducts = products.some(p => p.categoryId === category.id);
    if (hasProducts) {
      alert('No puedes eliminar esta categoria porque tiene productos asociados');
      return;
    }
    
    if (confirm('Estas seguro de eliminar esta categoria?')) {
      await remove(category.id);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
  };

  const getProductCount = (categoryId: string) => {
    return products.filter(p => p.categoryId === categoryId).length;
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin" className="text-slate-300 hover:text-white">
                Dashboard
              </Link>
              <span className="text-slate-600">/</span>
              <h1 className="text-xl font-bold text-white">Categorias</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-5 py-3.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-lg font-semibold sm:font-medium text-base sm:text-sm transition-colors shadow-[0_0_20px_rgba(190,40,40,0.3)]"
            >
              <Plus className="w-5 h-5" />
              Nueva Categoria
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="admin-neon-container text-center py-16">
            <div className="admin-neon-glow-top" />
            <FolderPlus className="relative w-20 h-20 mx-auto text-slate-600 mb-4" />
            <p className="relative text-slate-400 text-lg mb-4">No hay categorias</p>
            <button
              onClick={() => setShowForm(true)}
              className="relative text-rose-300 hover:text-rose-200 font-medium"
            >
              Agregar la primera categoria
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map(category => (
              <div
                key={category.id}
                className="admin-neon-container p-5 sm:p-6 transition-all duration-300 hover:border-rose-400/30 hover:shadow-[0_0_24px_rgba(190,40,40,0.14)]"
              >
                <div className="admin-neon-glow-top" />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-black/40 border border-rose-500/20 flex-shrink-0">
                      <FolderPlus className="w-6 h-6 text-rose-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-slate-400">{category.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-6 sm:justify-end">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Package className="w-4 h-4" />
                      <span>{getProductCount(category.id)} productos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-3 sm:p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="p-3 sm:p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="admin-neon-container max-w-md w-full">
            <div className="admin-neon-glow-top" />
            <div className="relative flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">
                {editingCategory ? 'Editar Categoria' : 'Nueva Categoria'}
              </h2>
              <button onClick={resetForm} className="p-2 hover:bg-white/10 rounded-lg text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="relative p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nombre de la categoria *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-400/50 focus:outline-none"
                  placeholder="Ej: Ropa, Electronica, Hogar..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Descripcion
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-400/50 focus:outline-none"
                  placeholder="Descripcion opcional de la categoria..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 border border-white/10 text-slate-300 rounded-lg font-medium hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-medium transition-colors shadow-[0_0_20px_rgba(190,40,40,0.3)]"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
