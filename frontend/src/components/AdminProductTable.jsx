import { useState } from 'react';
import { Pencil, Trash2, Loader2 } from 'lucide-react';

export default function AdminProductTable({ products, onEdit, onDeleteSuccess, onError }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?\n\nThis action cannot be undone.`)) return;

    setDeletingId(product.id);
    try {
      const res = await fetch(`http://localhost:5000/api/products/${product.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('nicemart_token')}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed.');
      onDeleteSuccess(`"${product.name}" deleted successfully.`);
    } catch (err) {
      onError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-slate-450 text-sm">
        No products found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
      {/* Desktop Table */}
      <table className="hidden md:table w-full text-sm">
        <thead>
          <tr className="bg-slate-800/40 text-slate-450 text-xs uppercase tracking-wider">
            <th className="px-4 py-3 text-left w-10">ID</th>
            <th className="px-4 py-3 text-left w-14">Image</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-right">Price</th>
            <th className="px-4 py-3 text-right">Stock</th>
            <th className="px-4 py-3 text-center w-24">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/40">
          {products.map(product => (
            <tr key={product.id} className="hover:bg-slate-800/20 transition-colors group">
              <td className="px-4 py-3 text-slate-500 font-mono text-xs">{product.id}</td>
              <td className="px-4 py-3">
                <div className="h-10 w-10 rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=80'}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=80'; }}
                  />
                </div>
              </td>
              <td className="px-4 py-3 font-semibold text-slate-200 max-w-[200px] truncate">{product.name}</td>
              <td className="px-4 py-3">
                <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-indigo-500/10 text-indigo-350 border border-indigo-500/10">
                  {product.category}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-semibold text-slate-200">₹{Number(product.price).toFixed(2)}</td>
              <td className="px-4 py-3 text-right">
                <span className={`font-bold ${product.stock === 0 ? 'text-rose-400' : product.stock <= 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {product.stock}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="p-1.5 rounded-lg text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors"
                    title="Edit product"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    disabled={deletingId === product.id}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors disabled:opacity-40"
                    title="Delete product"
                  >
                    {deletingId === product.id
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <Trash2 className="h-4 w-4" />
                    }
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-slate-800/40">
        {products.map(product => (
          <div key={product.id} className="p-4 flex gap-4">
            <div className="h-14 w-14 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex-shrink-0">
              <img
                src={product.image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=80'}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=80'; }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-200 text-sm truncate">{product.name}</p>
              <p className="text-xs text-slate-450 mt-0.5">
                <span className="text-indigo-350">{product.category}</span>
                {' · '}₹{Number(product.price).toFixed(2)}
                {' · '}Stock: <span className={product.stock === 0 ? 'text-rose-400' : product.stock <= 5 ? 'text-amber-400' : 'text-emerald-400'}>{product.stock}</span>
              </p>
              <div className="flex gap-3 mt-2">
                <button onClick={() => onEdit(product)} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product)}
                  disabled={deletingId === product.id}
                  className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors disabled:opacity-40"
                >
                  {deletingId === product.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
