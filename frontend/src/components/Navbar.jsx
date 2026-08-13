import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Store, LogOut, Shield, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

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
            {isAuthenticated && (
              <Link
                to="/orders"
                className={`text-sm font-semibold transition-all duration-300 hover:text-indigo-400 ${
                  isActive('/orders') ? 'text-indigo-400 border-b-2 border-indigo-400 pb-1' : 'text-slate-300'
                }`}
              >
                My Orders
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className={`text-sm font-semibold transition-all duration-300 hover:text-indigo-400 flex items-center gap-1 ${
                  isActive('/admin') ? 'text-indigo-400 border-b-2 border-indigo-400 pb-1' : 'text-slate-300'
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* User Icons / Cart / Profile - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Cart link */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-300 hover:text-indigo-400 hover:bg-slate-800/50 rounded-full transition-all duration-300"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white ring-2 ring-slate-900">
                {totalItems}
              </span>
            </Link>

            {/* Login / Profile Controls */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-300">
                  Hello, <span className="text-indigo-300">{user.name}</span>
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-rose-450 hover:text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/15 hover:border-rose-500/25 rounded-xl transition-all duration-300 shadow-md"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-700 rounded-xl transition-all duration-300 shadow-md"
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all duration-300 shadow-md"
                >
                  <span>Register</span>
                </Link>
              </div>
            )}
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
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-semibold hover:bg-slate-800 hover:text-indigo-400 transition-colors ${
                  isActive('/admin') ? 'text-indigo-400 bg-slate-800/40' : 'text-slate-300'
                }`}
              >
                Admin Dashboard
              </Link>
            )}
            <hr className="border-slate-800 my-2" />
            <Link
              to="/cart"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-slate-300 hover:bg-slate-800 hover:text-indigo-400 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Cart ({totalItems})</span>
            </Link>
            {isAuthenticated && (
              <Link
                to="/orders"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-slate-300 hover:bg-slate-800 hover:text-indigo-400 transition-colors"
              >
                <Package className="h-5 w-5" />
                <span>My Orders</span>
              </Link>
            )}
            
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 text-sm text-slate-450 border-t border-slate-800 mt-2">
                  Logged in as: <span className="font-semibold text-indigo-300">{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-rose-400 hover:bg-slate-800 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 p-2 border-t border-slate-800 mt-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-slate-850 hover:bg-slate-800 border border-slate-800"
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
                >
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
