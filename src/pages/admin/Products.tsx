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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin" className="text-slate-600 hover:text-slate-900">
                Dashboard
              </Link>
              <span className="text-gray-400">/</span>
              <h1 className="text-xl font-bold text-gray-900">Productos</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-medium transition-colors"
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
            <div className="animate-spin w-8 h-8 border-4 border-slate-800 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <Package className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-4">No hay productos</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-slate-700 hover:text-slate-900 font-medium"
            >
              Agregar el primer producto
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Producto</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Categoria</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Talles</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Precio</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(product => {
                    const category = categories.find(c => c.id === product.categoryId);
                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-300" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
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
                                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                                      stock > 0
                                        ? 'bg-gray-100 text-gray-700'
                                        : 'bg-red-50 text-red-500'
                                    }`}
                                  >
                                    {size}: {stock}
                                  </span>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Sin talles</span>
                          )}
                        </td>
                        <td className="py-4 px-6 font-semibold text-gray-900">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(product)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
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
        )}
      </main>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del producto *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripcion *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                  >
                    <option value="">Seleccionar...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock por talle
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {AVAILABLE_SIZES.map(size => (
                    <div key={size} className="flex items-center gap-2">
                      <span className="w-10 shrink-0 text-sm font-semibold text-gray-700">
                        {size}
                      </span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={stockBySize[size] ?? ''}
                        onChange={(e) => setSizeStock(size, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Dejá en blanco o en 0 los talles que no tengas en stock. Si no cargás cantidad en ningun talle, el producto se vende sin opcion de talle.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen del producto
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
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
                      <div className="flex items-center justify-center gap-2 text-slate-700">
                        <ImageIcon className="w-5 h-5" />
                        <span>{imageFile.name}</span>
                      </div>
                    ) : formData.imageUrl ? (
                      <div className="flex items-center justify-center gap-2 text-slate-700">
                        <ImageIcon className="w-5 h-5" />
                        <span>Imagen actual</span>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <Upload className="w-8 h-8 mx-auto mb-2" />
                        <p>Click para subir imagen</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
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
