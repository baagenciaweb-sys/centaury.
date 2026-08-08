import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCollection } from '../../hooks/useFirestore';
import { useStorage } from '../../hooks/useStorage';
import { Product, Category } from '../../types';
import { Package, Plus, Edit, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];

export default function Products() {
  const { data: products, add, update, remove, loading } = useCollection<Product>('products');
  const { data: categories } = useCollection<Category>('categories');
  const { uploadFile, uploading } = useStorage();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [stockBySize, setStockBySize] = useState<{ [size: string]: string }>({});

  const setSizeStock = (size: string, quantity: string) => {
    setStockBySize(prev => {
      const next = { ...prev };
      if (quantity === '') {
        delete next[size];
      } else {
        next[size] = quantity;
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = formData.imageUrl;
    if (imageFile) {
      imageUrl = await uploadFile(imageFile, 'products');
    }

    const stockEntries = Object.entries(stockBySize)
      .map(([size, qty]) => [size, parseInt(qty, 10) || 0] as [string, number])
      .filter(([, qty]) => qty > 0);

    const stockBySizeData = Object.fromEntries(stockEntries);
    const sizesData = stockEntries.map(([size]) => size);

    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      categoryId: formData.categoryId,
      imageUrl,
      sizes: sizesData,
      stockBySize: stockBySizeData,
      createdAt: new Date()
    };

    if (editingProduct) {
      await update(editingProduct.id, productData);
    } else {
      await add(productData);
    }

    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      categoryId: product.categoryId,
      imageUrl: product.imageUrl
    });
    const existingStock = product.stockBySize || {};
    const stockAsStrings: { [size: string]: string } = {};
    Object.entries(existingStock).forEach(([size, qty]) => {
      stockAsStrings[size] = String(qty);
    });
    setStockBySize(stockAsStrings);
    setShowForm(true);
  };

  const handleDelete = async (product: Product) => {
    if (confirm('Estas seguro de eliminar este producto?')) {
      await remove(product.id);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', categoryId: '', imageUrl: '' });
    setImageFile(null);
    setStockBySize({});
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
              <h1 className="text-xl font-bold text-white">Productos</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-5 py-3.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-lg font-semibold sm:font-medium text-base sm:text-sm transition-colors shadow-[0_0_20px_rgba(190,40,40,0.3)]"
            >
              <Plus className="w-5 h-5" />
              Nuevo Producto
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="admin-neon-container text-center py-16">
            <div className="admin-neon-glow-top" />
            <Package className="relative w-20 h-20 mx-auto text-slate-600 mb-4" />
            <p className="relative text-slate-400 text-lg mb-4">No hay productos</p>
            <button
              onClick={() => setShowForm(true)}
              className="relative text-rose-300 hover:text-rose-200 font-medium"
            >
              Agregar el primer producto
            </button>
          </div>
        ) : (
          <>
            {/* Vista de tarjetas para mobile */}
            <div className="grid gap-4 sm:hidden">
              {products.map(product => {
                const category = categories.find(c => c.id === product.categoryId);
                return (
                  <div key={product.id} className="admin-neon-container p-4">
                    <div className="admin-neon-glow-top" />
                    <div className="relative flex gap-4">
                      <div className="w-16 h-16 bg-black/40 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-slate-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white line-clamp-1">{product.name}</p>
                        <span className="inline-block mt-1 bg-rose-500/10 border border-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full text-xs font-medium">
                          {category?.name || 'Sin categoria'}
                        </span>
                        <p className="text-lg font-bold text-white mt-1">${product.price.toFixed(2)}</p>
                      </div>
                    </div>

                    {product.sizes && product.sizes.length > 0 && (
                      <div className="relative flex flex-wrap gap-1 mt-3">
                        {product.sizes.map(size => {
                          const stock = product.stockBySize?.[size] ?? 0;
                          return (
                            <span
                              key={size}
                              className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${
                                stock > 0
                                  ? 'bg-black/30 border-white/10 text-slate-300'
                                  : 'bg-red-500/10 border-red-500/20 text-red-400'
                              }`}
                            >
                              {size}: {stock}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    <div className="relative flex gap-2 mt-4">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-slate-200 rounded-xl font-medium transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-xl font-medium transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Vista de tabla para desktop */}
            <div className="admin-neon-container hidden sm:block overflow-hidden">
              <div className="admin-neon-glow-top" />
              <div className="relative overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-slate-300">Producto</th>
                      <th className="text-left py-4 px-6 font-semibold text-slate-300">Categoria</th>
                      <th className="text-left py-4 px-6 font-semibold text-slate-300">Talles</th>
                      <th className="text-left py-4 px-6 font-semibold text-slate-300">Precio</th>
                      <th className="text-right py-4 px-6 font-semibold text-slate-300">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.map(product => {
                      const category = categories.find(c => c.id === product.categoryId);
                      return (
                        <tr key={product.id} className="hover:bg-white/[0.03]">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-black/40 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                                {product.imageUrl ? (
                                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-6 h-6 text-slate-600" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-white">{product.name}</p>
                                <p className="text-sm text-slate-400 line-clamp-1">{product.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-block bg-rose-500/10 border border-rose-500/20 text-rose-300 px-3 py-1 rounded-full text-sm font-medium">
                              {category?.name || 'Sin categoria'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            {product.sizes && product.sizes.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {product.sizes.map(size => {
                                  const stock = product.stockBySize?.[size] ?? 0;
                                  return (
                                    <span
                                      key={size}
                                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${
                                        stock > 0
                                          ? 'bg-black/30 border-white/10 text-slate-300'
                                          : 'bg-red-500/10 border-red-500/20 text-red-400'
                                      }`}
                                    >
                                      {size}: {stock}
                                    </span>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-sm text-slate-500">Sin talles</span>
                            )}
                          </td>
                          <td className="py-4 px-6 font-semibold text-white">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(product)}
                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="admin-neon-container max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="admin-neon-glow-top" />
            <div className="relative flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button onClick={resetForm} className="p-2 hover:bg-white/10 rounded-lg text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="relative p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nombre del producto *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-400/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Descripcion *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-400/50 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Precio *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-400/50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Categoria *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-rose-500/50 focus:border-rose-400/50 focus:outline-none"
                  >
                    <option value="" className="bg-slate-900">Seleccionar...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id} className="bg-slate-900">{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Stock por talle
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {AVAILABLE_SIZES.map(size => (
                    <div key={size} className="flex items-center gap-2">
                      <span className="w-10 shrink-0 text-sm font-semibold text-slate-300">
                        {size}
                      </span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={stockBySize[size] ?? ''}
                        onChange={(e) => setSizeStock(size, e.target.value)}
                        className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-400/50 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Dejá en blanco o en 0 los talles que no tengas en stock. Si no cargás cantidad en ningun talle, el producto se vende sin opcion de talle.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Imagen del producto
                </label>
                <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center hover:border-rose-400/40 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setFormData({ ...formData, imageUrl: '' });
                      }
                    }}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {imageFile ? (
                      <div className="flex items-center justify-center gap-2 text-slate-200">
                        <ImageIcon className="w-5 h-5" />
                        <span>{imageFile.name}</span>
                      </div>
                    ) : formData.imageUrl ? (
                      <div className="flex items-center justify-center gap-2 text-slate-200">
                        <ImageIcon className="w-5 h-5" />
                        <span>Imagen actual</span>
                      </div>
                    ) : (
                      <div className="text-slate-400">
                        <Upload className="w-8 h-8 mx-auto mb-2" />
                        <p>Click para subir imagen</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  O pega una URL de imagen
                </label>
                <input
                  type="text"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, imageUrl: e.target.value });
                    setImageFile(null);
                  }}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-400/50 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-3.5 sm:py-3 border border-white/10 text-slate-300 rounded-xl sm:rounded-lg font-medium hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-3.5 sm:py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl sm:rounded-lg font-semibold sm:font-medium transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(190,40,40,0.3)]"
                >
                  {uploading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
