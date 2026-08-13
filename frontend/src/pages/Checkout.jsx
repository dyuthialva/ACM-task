import { Link } from 'react-router-dom';
import { ArrowLeft, Hourglass, ShoppingCart } from 'lucide-react';

export default function Checkout() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 flex items-center justify-center p-6">
      <div className="flex flex-col items-center justify-center p-12 bg-slate-800/10 border border-slate-800/80 rounded-3xl text-center max-w-lg shadow-2xl backdrop-blur-sm">
        {/* Placeholder Icon */}
        <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl mb-6 animate-pulse">
          <Hourglass className="h-10 w-10" />
        </div>

        {/* Header */}
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-slate-50 to-indigo-200 bg-clip-text text-transparent mb-4">
          Checkout
        </h1>

        {/* Info Box */}
        <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 mb-8 max-w-sm">
          <p className="text-sm text-indigo-300 font-semibold mb-2">
            Notice: Sandbox Environment
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Order placement and checkout validation will be implemented in the next commit. Your cart items are safely preserved.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          <Link
            to="/cart"
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Cart</span>
          </Link>
          <Link
            to="/products"
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 active:scale-95"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Keep Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
