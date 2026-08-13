import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, RotateCcw, AlertTriangle, Inbox, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and Sorting state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('');

  // Fetch unique categories once from the full catalog initially
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        const uniqueCategories = [...new Set(response.data.map((p) => p.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching initial category list:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products based on search, filter, and sorting selections
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search.trim() !== '') params.search = search;
      if (selectedCategory !== '') params.category = selectedCategory;
      if (selectedSort !== '') params.sort = selectedSort;

      const response = await axios.get('http://localhost:5000/api/products', { params });
      setProducts(response.data);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Unable to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Run fetch on filter/sort adjustments
  useEffect(() => {
    // Add debounce to search to prevent slamming API on every keystroke
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, selectedCategory, selectedSort]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedSort('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-slate-100 to-indigo-200 bg-clip-text text-transparent">
            Browse Products
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Discover cutting-edge gadgets and premium productivity enhancers.
          </p>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center justify-between bg-slate-800/25 border border-slate-800 p-5 rounded-2xl mb-10">
          {/* Search Input */}
          <div className="relative col-span-1 lg:col-span-2">
            <Search className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search products by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/60 focus:border-indigo-500 rounded-xl py-3 pl-12 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative col-span-1">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/60 focus:border-indigo-500 rounded-xl py-3 px-4 text-sm text-slate-300 outline-none transition-colors appearance-none cursor-pointer"
            >
              <option value="">Default Sorting</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
          </div>

          {/* Reset Action */}
          <div className="col-span-1">
            <button
              onClick={handleResetFilters}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl text-sm font-semibold transition-all duration-300 text-slate-300 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Dynamic Category Filter Pills */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 items-center justify-center md:justify-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
              Categories:
            </span>
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-300 ${
                selectedCategory === ''
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/10'
                  : 'bg-slate-800 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-700'
              }`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/10'
                    : 'bg-slate-800 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Catalog Content Area */}
        {loading ? (
          /* Pulsing Skeletons */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col bg-slate-800/25 border border-slate-800 rounded-2xl overflow-hidden p-5 animate-pulse"
              >
                <div className="w-full aspect-video bg-slate-800 rounded-xl mb-4"></div>
                <div className="h-5 bg-slate-800 rounded-md w-3/4 mb-3"></div>
                <div className="flex items-center justify-between mb-5">
                  <div className="h-6 bg-slate-800 rounded-md w-1/4"></div>
                  <div className="h-6 bg-slate-800 rounded-md w-1/3"></div>
                </div>
                <div className="h-10 bg-slate-800 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error Box */
          <div className="flex flex-col items-center justify-center p-12 bg-rose-500/5 border border-rose-500/15 rounded-2xl text-center max-w-lg mx-auto">
            <AlertTriangle className="h-12 w-12 text-rose-400 mb-4 animate-bounce" />
            <h3 className="text-lg font-bold text-rose-200">Request Failed</h3>
            <p className="text-slate-400 mt-2 text-sm">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-6 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 rounded-xl text-xs font-bold text-white transition-colors"
            >
              Retry Connection
            </button>
          </div>
        ) : products.length === 0 ? (
          /* Empty Box */
          <div className="flex flex-col items-center justify-center p-16 bg-slate-800/10 border border-slate-800/80 rounded-3xl text-center max-w-lg mx-auto">
            <Inbox className="h-12 w-12 text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-300">No products found.</h3>
            <p className="text-slate-500 mt-2 text-sm">
              Adjust your search text, category filter, or sorting method.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 px-5 py-2.5 bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/20 text-indigo-400 rounded-xl text-xs font-bold transition-colors"
            >
              Reset Search Filter
            </button>
          </div>
        ) : (
          /* Product Catalog Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
