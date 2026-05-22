import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiCpu } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return setError('Please provide your credentials');
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to authenticate. Try demo@smartstore.com / password123');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center bg-dark-900 overflow-hidden px-4">
      {/* Dynamic Background Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-primary-500/10 blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent-500/10 blur-[120px] animate-pulse [animation-delay:2s]"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md glass-card p-8 border border-white/10 z-10 animate-fadeInUp">
        {/* Branding header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl shadow-xl shadow-primary-500/20 mb-4 animate-bounce">
            <FiCpu />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Welcome to <span className="bg-gradient-to-r from-primary-400 to-accent-300 bg-clip-text text-transparent">SmartStore AI</span>
          </h2>
          <p className="text-xs font-semibold text-dark-300 uppercase tracking-widest mt-1.5">
            AI-Driven E-Commerce Console
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-danger-500/10 border border-danger-500/25 text-xs text-danger-400 font-semibold animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-dark-300">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-dark-300">
                <FiMail />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@smartstore.com"
                className="input-dark pl-11"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-dark-300">
                Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-dark-300">
                <FiLock />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
                className="input-dark pl-11"
                disabled={loading}
              />
            </div>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="btn-glow w-full py-3.5 tracking-wider uppercase font-bold text-xs mt-4 cursor-pointer"
            disabled={loading}
          >
            {loading ? 'Securing Connection...' : 'Establish Secure Link'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-dark-600/30 pt-6">
          <p className="text-xs text-dark-200">
            First time deploying?{' '}
            <Link
              to="/register"
              className="font-bold text-primary-400 hover:text-primary-300 transition-colors"
            >
              Sign Up For Free Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
