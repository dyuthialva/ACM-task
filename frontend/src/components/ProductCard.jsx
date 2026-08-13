import { Link } from 'react-router-dom';
import { Eye, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function ProductCard({ product }) {
  const { id, name, price, category, image, stock } = product;

  // Render stock badge based on stock level
  const renderStockBadge = () => {
    if (stock > 5) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle className="h-3 w-3" />
          In Stock
        </span>
      );
    } else if (stock >= 1 && stock <= 5) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <AlertCircle className="h-3 w-3 animate-pulse" />
          Only {stock} left
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <XCircle className="h-3 w-3" />
          Out of Stock
        </span>
      );
    }
  };

  return (
    <div className="flex flex-col bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 rounded-2xl overflow-hidden group hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.15)] hover:bg-slate-800/80 transition-all duration-300 transform hover:-translate-y-1">
      {/* Product Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        <img
          src={image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=400'}
          alt={name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=400';
          }}
        />
        {/* Category Floating Badge */}
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-wider uppercase bg-slate-900/85 text-indigo-300 border border-indigo-500/20 backdrop-blur-sm">
          {category}
        </span>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 line-clamp-1 transition-colors duration-300">
          {name}
        </h3>

        {/* Pricing & Stock Status */}
        <div className="flex items-center justify-between mt-3 mb-5">
          <span className="text-xl font-extrabold bg-gradient-to-r from-slate-50 to-slate-200 bg-clip-text text-transparent">
            ₹{price.toFixed(2)}
          </span>
          {renderStockBadge()}
        </div>

        {/* View Details Action Button */}
        <div className="mt-auto">
          <Link
            to={`/products/${id}`}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all duration-300 shadow-md active:scale-95 group-hover:shadow-[0_0_15px_-3px_rgba(99,102,241,0.5)]"
          >
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
