import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, AlertCircle, Loader2, CheckCircle } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    const result = await register(name, email, password);
    setSubmitting(false);

    if (result.success) {
      setSuccess('Account created successfully! Redirecting to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-800/10 border border-slate-800/80 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-slate-50 to-indigo-200 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-slate-450">
            Join NICEMART to buy workspace hardware.
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/15 rounded-2xl text-rose-400 text-sm mb-6">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert Box */}
        {success && (
          <div className="flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-500/15 rounded-2xl text-emerald-400 text-sm mb-6">
            <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/60 focus:border-indigo-500 rounded-xl py-3 pl-12 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/60 focus:border-indigo-500 rounded-xl py-3 pl-12 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/60 focus:border-indigo-500 rounded-xl py-3 pl-12 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Registering...</span>
              </>
            ) : (
              <span>Register</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-8 text-center text-sm text-slate-450">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-350 transition-colors">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
