import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminProductForm from '../components/AdminProductForm';
import AdminProductTable from '../components/AdminProductTable';
import AdminOrderTable from '../components/AdminOrderTable';
import {
  ShieldCheck, Package, ShoppingBag, LogOut,
  Store, Loader2, AlertTriangle, CheckCircle, RefreshCw
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('products');

  // ── Product state ──────────────────────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToast, setProductToast] = useState(null);

  // ── Order state ────────────────────────────────────────────────────────────
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState(null);
  const [orderToast, setOrderToast] = useState(null);

  // ── Toast auto-dismiss ─────────────────────────────────────────────────────
  const showProductToast = (msg, type = 'success') => {
    setProductToast({ msg, type });
    setTimeout(() => setProductToast(null), 3500);
  };
  const showOrderToast = (msg, type = 'success') => {
    setOrderToast({ msg, type });
    setTimeout(() => setOrderToast(null), 3500);
  };

  // ── Fetch products ─────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    setProductError(null);
    try {
      const res = await fetch('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${localStorage.getItem('nicemart_token')}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load products.');
      setProducts(data);
    } catch (err) {
      setProductError(err.message);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // ── Fetch orders ───────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    setOrderError(null);
    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('nicemart_token')}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load orders.');
      setOrders(data);
    } catch (err) {
      setOrderError(err.message);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // ── Product form handlers ──────────────────────────────────────────────────
  const handleProductSuccess = (message) => {
    showProductToast(message);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleDeleteSuccess = (message) => {
    showProductToast(message);
    fetchProducts();
  };

  const handleProductError = (message) => {
    showProductToast(message, 'error');
  };

  // ── Order status handler ───────────────────────────────────────────────────
  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showOrderToast(`Order #${orderId} status updated to "${newStatus}".`);
  };

  // ── Tab config ─────────────────────────────────────────────────────────────
  const tabs = [
    { id: 'products', label: 'Products', icon: Package, count: products.length },
    { id: 'orders',   label: 'Orders',   icon: ShoppingBag, count: orders.length },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100">
      {/* Admin Header Bar */}
      <div className="bg-slate-800/50 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-100">NICEMART Admin</h1>
              <p className="text-xs text-slate-450">Logged in as <span className="text-indigo-300 font-semibold">{user?.name}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/products"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
            >
              <Store className="h-4 w-4" />
              Back to Store
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/15 rounded-xl transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 p-1.5 bg-slate-800/30 border border-slate-800/60 rounded-2xl w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-slate-800 text-slate-450'
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* ═══════════════════ PRODUCTS TAB ═══════════════════ */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            {/* Product Toast */}
            {productToast && (
              <div className={`flex items-center gap-2 p-4 rounded-2xl border text-sm font-semibold ${
                productToast.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}>
                {productToast.type === 'success'
                  ? <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  : <AlertTriangle className="h-5 w-5 flex-shrink-0" />}
                <span>{productToast.msg}</span>
              </div>
            )}

            {/* Add / Edit Form */}
            <AdminProductForm
              editingProduct={editingProduct}
              onSuccess={handleProductSuccess}
              onCancel={() => setEditingProduct(null)}
            />

            {/* Products Table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-200">
                  All Products <span className="text-slate-500 text-sm font-normal ml-1">({products.length})</span>
                </h2>
                <button
                  onClick={fetchProducts}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Refresh
                </button>
              </div>

              {loadingProducts ? (
                <div className="flex items-center justify-center py-16 gap-3 text-slate-450">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                  <span className="text-sm">Loading products...</span>
                </div>
              ) : productError ? (
                <div className="flex items-center gap-3 p-5 bg-rose-500/5 border border-rose-500/15 rounded-2xl text-rose-400 text-sm">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                  <span>{productError}</span>
                  <button onClick={fetchProducts} className="ml-auto text-xs font-bold underline hover:no-underline">Retry</button>
                </div>
              ) : (
                <AdminProductTable
                  products={products}
                  onEdit={setEditingProduct}
                  onDeleteSuccess={handleDeleteSuccess}
                  onError={handleProductError}
                />
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════ ORDERS TAB ═══════════════════ */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Order Toast */}
            {orderToast && (
              <div className={`flex items-center gap-2 p-4 rounded-2xl border text-sm font-semibold ${
                orderToast.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}>
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <span>{orderToast.msg}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-200">
                All Orders <span className="text-slate-500 text-sm font-normal ml-1">({orders.length})</span>
              </h2>
              <button
                onClick={fetchOrders}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </button>
            </div>

            {loadingOrders ? (
              <div className="flex items-center justify-center py-16 gap-3 text-slate-450">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                <span className="text-sm">Loading orders...</span>
              </div>
            ) : orderError ? (
              <div className="flex items-center gap-3 p-5 bg-rose-500/5 border border-rose-500/15 rounded-2xl text-rose-400 text-sm">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <span>{orderError}</span>
                <button onClick={fetchOrders} className="ml-auto text-xs font-bold underline hover:no-underline">Retry</button>
              </div>
            ) : (
              <AdminOrderTable
                orders={orders}
                onStatusChange={handleOrderStatusChange}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
