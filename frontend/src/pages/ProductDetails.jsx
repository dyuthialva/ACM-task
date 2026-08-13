import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ShoppingCart, CheckCircle, AlertTriangle, AlertCircle, XCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { cart, addToCart } = useCart();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product details:', err);
        if (err.response && err.response.status === 404) {
          setError('Product not found.');
        } else {
          setError('Unable to load product details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const result = addToCart(product, 1);
    if (result.success) {
      setToast({ type: 'success', message: `${product.name} added to cart!` });
    } else {
      if (result.error === 'exceeds_stock') {
        setToast({
          type: 'error',
          message: `Cannot add more. Limit of ${result.maxStock} items reached (exceeds available stock).`
        });
      }
    }
  };

  const renderStockBadge = () => {
    const { stock } = product;
    if (stock > 5) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle className="h-3.5 w-3.5" />
          In Stock ({stock} available)
        </span>
      );
    } else if (stock >= 1 && stock <= 5) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <AlertCircle className="h-3.5 w-3.5 animate-pulse" />
          Only {stock} left in stock!
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <XCircle className="h-3.5 w-3.5" />
          Out of Stock
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          <div className="w-full aspect-square bg-slate-800 rounded-3xl"></div>
          <div className="flex flex-col justify-center space-y-6">
            <div className="h-4 bg-slate-800 rounded-md w-1/4"></div>
            <div className="h-10 bg-slate-800 rounded-md w-3/4"></div>
            <div className="h-8 bg-slate-800 rounded-md w-1/3"></div>
            <div className="h-4 bg-slate-800 rounded-md w-full"></div>
            <div className="h-4 bg-slate-800 rounded-md w-5/6"></div>
            <div className="h-14 bg-slate-800 rounded-2xl w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 flex items-center justify-center py-12 px-4">
        <div className="flex flex-col items-center justify-center p-10 bg-rose-500/5 border border-rose-500/15 rounded-3xl text-center max-w-lg">
          <AlertTriangle className="h-14 w-14 text-rose-400 mb-4" />
          <h3 className="text-xl font-bold text-rose-200">Unable to load details</h3>
          <p className="text-slate-400 mt-2 text-sm">{error}</p>
          <Link
            to="/products"
            className="mt-8 flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Products</span>
          </Link>
        </div>
      </div>
    );
  }

  const cartItem = cart.find((item) => item.id === product?.id);
  const currentInCart = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product?.stock === 0;
  const isLimitReached = currentInCart >= (product?.stock || 0);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 flex items-center gap-2 px-5 py-3.5 rounded-2xl border text-sm font-semibold shadow-2xl transition-all duration-300 ${
          toast.type === 'success'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span>{toast.message}</span>
        </div>
      )}
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 hover:translate-x-[-4px] transition-transform duration-300"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Link>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-800/15 border border-slate-800/80 rounded-3xl p-6 sm:p-10 backdrop-blur-sm">
          {/* Product Image */}
          <div className="w-full aspect-square overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
            <img
              src={product.image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600'}
              alt={product.name}
              className="h-full w-full object-cover object-center"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600';
              }}
            />
          </div>

          {/* Product Info Column */}
          <div className="flex flex-col justify-center">
            {/* Breadcrumb / Category */}
            <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-indigo-400">
              <span>NICEMART</span>
              <span className="text-slate-600">/</span>
              <span>{product.category}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-50 tracking-tight leading-tight mb-4">
              {product.name}
            </h1>

            {/* Pricing & Stock Status */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-3xl font-extrabold bg-gradient-to-r from-slate-50 to-slate-200 bg-clip-text text-transparent">
                ₹{product.price.toFixed(2)}
              </span>
              {renderStockBadge()}
            </div>

            {/* Description */}
            <div className="border-t border-b border-slate-800/80 py-6 mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
                Overview
              </h3>
              <p className="text-slate-300 text-base leading-relaxed">
                {product.description || 'No description available for this premium NICEMART item.'}
              </p>
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isLimitReached}
              className={`w-full flex items-center justify-center gap-3 px-8 py-4 text-base font-bold rounded-2xl transition-all duration-300 shadow-lg ${
                isOutOfStock || isLimitReached
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-850'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 hover:shadow-indigo-600/30 active:scale-95'
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>
                {isOutOfStock
                  ? 'Sold Out'
                  : isLimitReached
                  ? 'Limit Reached (All in Cart)'
                  : 'Add to Cart'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
