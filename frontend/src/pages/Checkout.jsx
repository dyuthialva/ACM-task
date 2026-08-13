import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag, ChevronRight, CreditCard, CheckCircle,
  AlertCircle, Loader2, Package
} from 'lucide-react';

export default function Checkout() {
  const { cart, clearCart, totalAmount, totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Empty cart state
  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 flex items-center justify-center p-6">
        <div className="flex flex-col items-center justify-center p-16 bg-slate-800/10 border border-slate-800/80 rounded-3xl text-center max-w-lg shadow-xl">
          <ShoppingBag className="h-16 w-16 text-slate-600 mb-6 animate-pulse" />
          <h3 className="text-2xl font-bold text-slate-200 mb-2">Your cart is empty</h3>
          <p className="text-slate-450 text-sm mb-8 leading-relaxed">
            Add some products to your cart before checking out.
          </p>
          <Link
            to="/products"
            className="flex items-center gap-2 px-8 py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-600/25 hover:scale-105"
          >
            <span>Continue Shopping</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  // Order confirmed state
  if (confirmedOrder) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 flex items-center justify-center p-6">
        <div className="flex flex-col items-center justify-center p-12 bg-slate-800/10 border border-slate-800/80 rounded-3xl text-center max-w-lg shadow-2xl backdrop-blur-sm">
          <div className="p-4 bg-emerald-500/10 rounded-full mb-6 animate-bounce">
            <CheckCircle className="h-12 w-12 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-slate-50 to-emerald-200 bg-clip-text text-transparent mb-3">
            Order Placed!
          </h2>
          <p className="text-slate-350 text-sm mb-2">Your order has been confirmed.</p>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 border border-slate-700/60 rounded-xl mb-8">
            <Package className="h-4 w-4 text-indigo-400" />
            <span className="text-sm font-mono text-slate-300">Order ID: <span className="font-bold text-indigo-300">#{confirmedOrder.id}</span></span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link
              to="/orders"
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all duration-300 shadow-lg active:scale-95"
            >
              <span>View My Orders</span>
            </Link>
            <Link
              to="/products"
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all duration-300"
            >
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setError(null);
    setSubmitting(true);

    // Only send productId + quantity — total is trusted from backend
    const orderPayload = {
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };

    try {
      const response = await axios.post('http://localhost:5000/api/orders', orderPayload);
      clearCart();
      setConfirmedOrder(response.data);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to place order. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-slate-50 to-indigo-200 bg-clip-text text-transparent">
            Checkout
          </h1>
          <p className="mt-2 text-sm text-slate-450">
            Review your items and confirm your order.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/15 rounded-2xl text-rose-400 text-sm mb-8">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Order Items List */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/15 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-sm">
              <div className="px-6 py-4 border-b border-slate-800/60">
                <h2 className="text-base font-bold text-slate-200">
                  Order Summary ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                </h2>
              </div>
              <div className="divide-y divide-slate-800/40">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-5">
                    {/* Thumbnail */}
                    <div className="h-16 w-16 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=200'}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=200'; }}
                      />
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-200 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-slate-450 mt-1">
                        ₹{item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    {/* Subtotal */}
                    <p className="text-sm font-extrabold text-slate-100 flex-shrink-0">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Not logged in warning */}
            {!isAuthenticated && (
              <div className="mt-4 flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/15 rounded-2xl text-amber-400 text-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>
                  You must be{' '}
                  <Link to="/login" className="font-bold underline hover:text-amber-300">logged in</Link>
                  {' '}to place an order.
                </span>
              </div>
            )}
          </div>

          {/* Order Total Summary */}
          <div className="bg-slate-800/20 border border-slate-800 p-6 sm:p-8 rounded-3xl backdrop-blur-sm space-y-5">
            <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800/80 pb-4">
              Payment Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-semibold text-slate-200">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-400">Free</span>
              </div>
              <hr className="border-slate-800/80" />
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-base font-bold text-slate-200">Total</span>
                <span className="text-2xl font-extrabold bg-gradient-to-r from-slate-50 to-slate-200 bg-clip-text text-transparent">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Placing Order...</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  <span>Place Order</span>
                </>
              )}
            </button>

            <Link
              to="/cart"
              className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              ← Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
