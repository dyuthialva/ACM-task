import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingBag, Plus, Minus, CreditCard, ChevronRight, AlertCircle } from 'lucide-react';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, totalItems, totalAmount } = useCart();
  const { isAuthenticated } = useAuth();

  const handleClearCart = () => {
    if (window.confirm('Remove all items from your cart? This cannot be undone.')) clearCart();
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 flex items-center justify-center p-6">
        <div className="flex flex-col items-center justify-center p-16 bg-slate-800/10 border border-slate-800/80 rounded-3xl text-center max-w-lg shadow-xl">
          <ShoppingBag className="h-16 w-16 text-slate-600 mb-6 animate-pulse" />
          <h3 className="text-2xl font-bold text-slate-200 mb-2">Your cart is empty</h3>
          <p className="text-slate-450 text-sm mb-8 leading-relaxed">
            Looks like you haven't added any premium gadgets to your cart yet. Explore our catalog to get started.
          </p>
          <Link
            to="/products"
            className="flex items-center gap-2 px-8 py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 hover:scale-105"
          >
            <span>Continue Shopping</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-slate-50 to-indigo-200 bg-clip-text text-transparent">
            Your Shopping Cart
          </h1>
          <p className="mt-2 text-sm text-slate-450">
            Review your selected gear before moving to checkout.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/15 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-sm">
              <div className="divide-y divide-slate-800/60">
                {cart.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 group">
                    {/* Item Image */}
                    <div className="h-24 w-24 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=200'}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=200';
                        }}
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-base font-bold text-slate-150 group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-slate-450 font-medium mt-1">
                        Unit Price: ₹{item.price.toFixed(2)}
                      </p>
                      
                      {/* Quantity Selector - Mobile only */}
                      <div className="flex sm:hidden items-center justify-center gap-4 mt-4">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-bold text-slate-100">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="p-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Quantity Selector - Desktop/Tablet only */}
                    <div className="hidden sm:flex items-center gap-3 bg-slate-900/60 border border-slate-800 p-1.5 rounded-xl">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center font-bold text-sm text-slate-100">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Item Subtotal */}
                    <div className="text-center sm:text-right flex-shrink-0">
                      <p className="text-base font-extrabold text-slate-100">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                      {item.quantity >= item.stock && (
                        <p className="text-[10px] text-amber-400 font-semibold mt-1">
                          Max stock reached
                        </p>
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2.5 rounded-xl bg-rose-500/10 text-rose-450 hover:bg-rose-500 hover:text-white border border-rose-500/20 hover:border-rose-500 transition-all duration-300 sm:flex-shrink-0"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Clear Cart Trigger */}
            <div className="flex justify-end">
              <button
                onClick={handleClearCart}
                className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-rose-400 hover:text-rose-350 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/15 rounded-2xl transition-all duration-300 shadow-md"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear Entire Cart</span>
              </button>
            </div>
          </div>

          {/* Cart Summary Column */}
          <div className="bg-slate-800/20 border border-slate-800 p-6 sm:p-8 rounded-3xl backdrop-blur-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800/80 pb-4">
              Cart Summary
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Total Items</span>
                <span className="font-semibold text-slate-200">{totalItems}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-400">Free</span>
              </div>
              <hr className="border-slate-800/80" />
              <div className="flex justify-between items-baseline pt-2">
                <span className="text-base font-bold text-slate-200">Total Price</span>
                <span className="text-2xl font-extrabold bg-gradient-to-r from-slate-50 to-slate-200 bg-clip-text text-transparent">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Not logged in warning */}
            {!isAuthenticated && (
              <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/15 rounded-2xl text-amber-400 text-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>
                  You must be{' '}
                  <Link to="/login" className="font-bold underline hover:text-amber-300">logged in</Link>
                  {' '}to place an order.
                </span>
              </div>
            )}

            <div className="pt-2">
              <Link
                to={isAuthenticated ? '/checkout' : '/login'}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:scale-[1.02] active:scale-95"
              >
                <CreditCard className="h-5 w-5" />
                <span>{isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
