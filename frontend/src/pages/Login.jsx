import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!EMAIL_RE.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!password) errs.password = 'Password is required.';
    return errs;
  };

  const handleChange = (setter, field) => (e) => {
    setter(e.target.value);
    if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setSubmitting(true);
    const result = await login(email.trim(), password);
    setSubmitting(false);

    if (result.success) {
      navigate('/products');
    } else {
      // Show a consistent, safe message — no leaking of which field was wrong
      setError('Invalid email or password. Please try again.');
    }
  };

  const inputClass = (field) =>
    `w-full bg-slate-900 border ${fieldErrors[field] ? 'border-rose-500/70' : 'border-slate-700/60'} focus:border-indigo-500 rounded-xl py-3 pl-12 pr-12 text-sm text-slate-200 placeholder-slate-500 outline-none transition-colors`;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-800/10 border border-slate-800/80 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-slate-50 to-indigo-200 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-slate-450">
            Sign in to access your NICEMART account.
          </p>
        </div>

        {/* API Error */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/15 rounded-2xl text-rose-400 text-sm mb-6">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-slate-500 pointer-events-none" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={handleChange(setEmail, 'email')}
                className={inputClass('email').replace('pr-12', 'pr-4')}
                autoComplete="email"
              />
            </div>
            {fieldErrors.email && <p className="text-xs text-rose-400 mt-1.5">{fieldErrors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-slate-500 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={handleChange(setPassword, 'password')}
                className={inputClass('password')}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {fieldErrors.password && <p className="text-xs text-rose-400 mt-1.5">{fieldErrors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 mt-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-450">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
