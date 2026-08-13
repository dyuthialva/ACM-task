import { useState } from 'react';
import { ChevronDown, Loader2, Calendar, Hash } from 'lucide-react';

const STATUS_STYLES = {
  Placed:     'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Processing: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  Shipped:    'bg-purple-500/15 text-purple-400 border-purple-500/20',
  Delivered:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Cancelled:  'bg-rose-500/15 text-rose-400 border-rose-500/20',
};

const ALL_STATUSES = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

export default function AdminOrderTable({ orders, onStatusChange }) {
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('nicemart_token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed.');
      onStatusChange(orderId, newStatus);
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-slate-450 text-sm">
        No orders in the system yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <div key={order.id} className="bg-slate-800/15 border border-slate-800/80 rounded-2xl overflow-hidden">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 bg-slate-800/20 border-b border-slate-800/50">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-slate-350 font-mono font-bold">
                <Hash className="h-3.5 w-3.5 text-slate-500" />
                Order #{order.id}
              </div>
              <div className="flex items-center gap-1.5 text-slate-450">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(order.created_at)}
              </div>
              <div className="text-xs px-2 py-0.5 bg-indigo-500/10 text-indigo-350 border border-indigo-500/15 rounded-md font-semibold">
                {order.user.name} — {order.user.email}
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="relative flex-shrink-0">
              {updatingId === order.id ? (
                <div className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-400">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Updating...</span>
                </div>
              ) : (
                <>
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order.id, e.target.value)}
                    className={`appearance-none pl-3 pr-8 py-1.5 text-xs font-bold rounded-lg border cursor-pointer outline-none transition-colors ${STATUS_STYLES[order.status] || 'bg-slate-800 text-slate-400 border-slate-700'}`}
                  >
                    {ALL_STATUSES.map(s => (
                      <option key={s} value={s} className="bg-slate-900 text-slate-200">{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none" />
                </>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="px-5 py-3 space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0">
                  <img
                    src={item.productImage || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=80'}
                    alt={item.productName}
                    className="h-full w-full object-cover"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=80'; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-250 truncate">{item.productName}</p>
                  <p className="text-xs text-slate-500">₹{item.price.toFixed(2)} × {item.quantity}</p>
                </div>
                <p className="text-xs font-bold text-slate-300 flex-shrink-0">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Order Footer */}
          <div className="flex justify-between items-center px-5 py-3 border-t border-slate-800/50 bg-slate-800/10">
            <span className="text-xs text-slate-450">
              {order.items.reduce((s, i) => s + i.quantity, 0)} item(s)
            </span>
            <span className="text-sm font-extrabold text-slate-100">
              ₹{Number(order.total_amount).toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
