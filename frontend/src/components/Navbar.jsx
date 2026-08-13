import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Store } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleFeatureAlert = (feature) => {
    alert(`${feature} functionality is coming in the next commit!`);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800 text-slate-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-indigo-600 rounded-lg group-hover:bg-indigo-500 transition-colors duration-300">
                <Store className="h-6 w-6 text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-wider bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                NICEMART
              </span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-semibold transition-all duration-300 hover:text-indigo-400 ${
                isActive('/') ? 'text-indigo-400 border-b-2 border-indigo-400 pb-1' : 'text-slate-300'
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`text-sm font-semibold transition-all duration-300 hover:text-indigo-400 ${
                isActive('/products') ? 'text-indigo-400 border-b-2 border-indigo-400 pb-1' : 'text-slate-300'
              }`}
            >
              Products
            </Link>
          </div>

          {/* User Icons / Cart - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => handleFeatureAlert('Cart')}
              className="relative p-2 text-slate-300 hover:text-indigo-400 hover:bg-slate-800/50 rounded-full transition-all duration-300"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white ring-2 ring-slate-900">
                0
              </span>
            </button>
            <button
              onClick={() => handleFeatureAlert('Authentication')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-100 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl transition-all duration-300 shadow-md"
            >
              <User className="h-4 w-4" />
              <span>Login</span>
            </button>
          </div>

          {/* Hamburger button - Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 transition-all duration-300">
          <div className="px-2 pt-2 pb-4 space-y-2 sm:px-3">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-semibold hover:bg-slate-800 hover:text-indigo-400 transition-colors ${
                isActive('/') ? 'text-indigo-400 bg-slate-800/40' : 'text-slate-300'
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-semibold hover:bg-slate-800 hover:text-indigo-400 transition-colors ${
                isActive('/products') ? 'text-indigo-400 bg-slate-800/40' : 'text-slate-300'
              }`}
            >
              Products
            </Link>
            <hr className="border-slate-800 my-2" />
            <button
              onClick={() => {
                setIsOpen(false);
                handleFeatureAlert('Cart');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-slate-300 hover:bg-slate-800 hover:text-indigo-400 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Cart (0)</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                handleFeatureAlert('Authentication');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-slate-300 hover:bg-slate-800 hover:text-indigo-400 transition-colors"
            >
              <User className="h-5 w-5" />
              <span>Login / Account</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
