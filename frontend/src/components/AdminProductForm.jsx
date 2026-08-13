import { useState, useEffect } from 'react';
import { Loader2, X, Plus, Save } from 'lucide-react';

const EMPTY_FORM = {
  name: '',
  price: '',
  category: '',
  description: '',
  image: '',
  stock: ''
};

export default function AdminProductForm({ editingProduct, onSuccess, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const isEditing = Boolean(editingProduct);

  // Populate form when editing
  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name || '',
        price: String(editingProduct.price ?? ''),
        category: editingProduct.category || '',
        description: editingProduct.description || '',
        image: editingProduct.image || '',
        stock: String(editingProduct.stock ?? '')
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError(null);
    setFieldErrors({});
  }, [editingProduct]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Product name is required.';
    const price = parseFloat(form.price);
    if (!form.price || isNaN(price) || price <= 0) errs.price = 'Price must be a positive number.';
    if (!form.category.trim()) errs.category = 'Category is required.';
    if (!form.description.trim()) errs.description = 'Description is required.';
    if (!form.image.trim()) errs.image = 'Image URL is required.';
    const stock = parseInt(form.stock, 10);
    if (form.stock === '' || isNaN(stock) || stock < 0) errs.stock = 'Stock must be 0 or greater.';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setSubmitting(true);
    const payload = {
      name: form.name.trim(),
      price: parseFloat(form.price),
      category: form.category.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      stock: parseInt(form.stock, 10)
    };

    try {
      const url = isEditing
        ? `http://localhost:5000/api/products/${editingProduct.id}`
        : 'http://localhost:5000/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('nicemart_token')}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed.');

      onSuccess(isEditing ? 'Product updated successfully!' : 'Product added successfully!');
      if (!isEditing) setForm(EMPTY_FORM);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full bg-slate-900 border ${fieldErrors[field] ? 'border-rose-500/70' : 'border-slate-700/60'} focus:border-indigo-500 rounded-xl py-2.5 px-4 text-sm text-slate-200 placeholder-slate-500 outline-none transition-colors`;

  return (
    <div className="bg-slate-800/20 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-200">
          {isEditing ? `Editing: ${editingProduct.name}` : 'Add New Product'}
        </h2>
        {isEditing && (
          <button onClick={onCancel} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/15 rounded-xl text-rose-400 text-sm mb-5">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-450 mb-1.5">Product Name *</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Keychron K3 Pro" className={inputClass('name')} />
          {fieldErrors.name && <p className="text-xs text-rose-400 mt-1">{fieldErrors.name}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-450 mb-1.5">Price (₹) *</label>
          <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} placeholder="e.g. 4999" className={inputClass('price')} />
          {fieldErrors.price && <p className="text-xs text-rose-400 mt-1">{fieldErrors.price}</p>}
        </div>

        {/* Stock */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-450 mb-1.5">Stock *</label>
          <input name="stock" type="number" min="0" step="1" value={form.stock} onChange={handleChange} placeholder="e.g. 50" className={inputClass('stock')} />
          {fieldErrors.stock && <p className="text-xs text-rose-400 mt-1">{fieldErrors.stock}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-450 mb-1.5">Category *</label>
          <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Gaming" className={inputClass('category')} />
          {fieldErrors.category && <p className="text-xs text-rose-400 mt-1">{fieldErrors.category}</p>}
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-450 mb-1.5">Image URL *</label>
          <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." className={inputClass('image')} />
          {fieldErrors.image && <p className="text-xs text-rose-400 mt-1">{fieldErrors.image}</p>}
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-450 mb-1.5">Description *</label>
          <textarea name="description" rows={3} value={form.description} onChange={handleChange} placeholder="Product description..." className={`${inputClass('description')} resize-none`} />
          {fieldErrors.description && <p className="text-xs text-rose-400 mt-1">{fieldErrors.description}</p>}
        </div>

        {/* Actions */}
        <div className="sm:col-span-2 flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : isEditing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            <span>{submitting ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}</span>
          </button>
          {isEditing && (
            <button type="button" onClick={onCancel} className="px-6 py-2.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
