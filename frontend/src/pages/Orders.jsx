import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Package, AlertTriangle, Loader2, ShoppingBag,
  ChevronRight, ChevronDown, Calendar, Hash
} from 'lucide-react';

const STATUS_STYLES = {
  Placed:     'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Processing: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  Shipped:    'bg-purple-500/15 text-purple-400 border-purple-500/20',
  Delivered:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Cancelled:  'bg-rose-500/15 text-rose-400 border-rose-500/20',
};

const ALL_STATUSES = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold border uppercase tracking-wider ${STATUS_STYLES[status] || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
      {status}
    </span>
  );
}

export default function Orders() {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-900 flex items-center justify-center gap-4 text-slate-100">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
        <span className="text-sm text-slate-400 font-semibold">Loading your orders...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 flex items-center justify-center p-6">
        <div className="flex flex-col items-center justify-center p-12 bg-rose-500/5 border border-rose-500/15 rounded-3xl text-center max-w-lg">
          <AlertTriangle className="h-12 w-12 text-rose-400 mb-4 animate-bounce" />
          <h3 className="text-lg font-bold text-rose-200 mb-2">Failed to Load Orders</h3>
          <p className="text-slate-400 text-sm mb-6">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-500 rounded-xl text-sm font-bold text-white transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 flex items-center justify-center p-6">
        <div className="flex flex-col items-center justify-center p-16 bg-slate-800/10 border border-slate-800/80 rounded-3xl text-center max-w-lg shadow-xl">
          <ShoppingBag className="h-16 w-16 text-slate-600 mb-6" />
          <h3 className="text-2xl font-bold text-slate-200 mb-2">No orders yet</h3>
          <p className="text-slate-450 text-sm mb-8">
            You haven't placed any orders. Start exploring our catalog!
          </p>
          <Link
            to="/products"
            className="flex items-center gap-2 px-8 py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-2xl transition-all duration-300 shadow-lg hover:scale-105"
          >
            <span>Browse Products</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-slate-50 to-indigo-200 bg-clip-text text-transparent">
            {isAdmin ? 'All Orders' : 'My Orders'}
          </h1>
          <p className="mt-2 text-sm text-slate-450">
            {isAdmin
              ? `Viewing all ${orders.length} order(s) in the system.`
              : `You have placed ${orders.length} order(s).`}
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-slate-800/15 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-sm"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-slate-800/60 bg-slate-800/10">
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-slate-450">
                    <Hash className="h-4 w-4" />
                    <span className="font-mono font-bold text-slate-200">Order #{order.id}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-450">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(order.created_at)}</span>
                  </div>
                  {isAdmin && (
                    <span className="text-xs text-indigo-350 font-semibold bg-indigo-500/10 border border-indigo-500/15 px-2 py-0.5 rounded-lg">
                      {order.user.name} ({order.user.email})
                    </span>
                  )}
                </div>

                {/* Status badge or admin dropdown */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {isAdmin ? (
                    <div className="relative">
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        disabled={updatingId === order.id}
                        className={`appearance-none pl-3 pr-8 py-1.5 text-xs font-bold rounded-lg border cursor-pointer outline-none transition-colors ${STATUS_STYLES[order.status] || 'bg-slate-800 text-slate-400 border-slate-700'} ${updatingId === order.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {ALL_STATUSES.map(s => (
                          <option key={s} value={s} className="bg-slate-900 text-slate-200">{s}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none" />
                    </div>
                  ) : (
                    <StatusBadge status={order.status} />
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4 space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0">
                      <img
                        src={item.productImage || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=100'}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=100'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-200 line-clamp-1">{item.productName}</p>
                      <p className="text-xs text-slate-450 mt-0.5">
                        ₹{item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-slate-200 flex-shrink-0">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Footer - Total */}
              <div className="flex justify-between items-center px-6 py-4 border-t border-slate-800/60 bg-slate-800/10">
                <span className="text-sm text-slate-450 font-semibold">
                  {order.items.reduce((s, i) => s + i.quantity, 0)} item(s)
                </span>
                <span className="text-base font-extrabold text-slate-100">
                  Total: ₹{Number(order.total_amount).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
