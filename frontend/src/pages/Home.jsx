import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Headphones } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-between bg-slate-900 text-slate-100 overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-4 py-16 z-10">
        {/* Sparkle Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-8 animate-pulse">
          <Sparkles className="h-4 w-4" />
          <span>Commit 4: Frontend Live</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
          Elevate Your Workspace with{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Premium Gear
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Explore NICEMART's curated catalog of high-fidelity audio, professional accessories, high-performance electronics, and elite gaming peripherals.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/products"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <a
            href="https://github.com/dyuthialva/ACM-task"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-2xl transition-all duration-300"
          >
            Repository Info
          </a>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="w-full bg-slate-900/60 border-t border-slate-800/80 py-12 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-800/20 border border-slate-800/50">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100 mb-1">Express Delivery</h3>
                <p className="text-sm text-slate-400">Fast, secure shipping straight to your doorstep.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-800/20 border border-slate-800/50">
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100 mb-1">Authentic Guarantee</h3>
                <p className="text-sm text-slate-400">All products are 100% verified authentic NICEMART items.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-800/20 border border-slate-800/50">
              <div className="p-3 bg-pink-500/10 text-pink-400 rounded-xl">
                <Headphones className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100 mb-1">24/7 Expert Support</h3>
                <p className="text-sm text-slate-400">Have questions? Reach out to our workspace support team anytime.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
