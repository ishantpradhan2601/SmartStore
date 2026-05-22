import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiUser, FiActivity, FiCpu } from 'react-icons/fi';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [storeName, setStoreName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !storeName) {
      return setError('Please fill in all mandatory fields');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await register(name, email, password, storeName);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Registration failed. Try again with a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center bg-dark-900 overflow-hidden px-4 py-8">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-primary-500/10 blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent-500/10 blur-[120px] animate-pulse [animation-delay:2s]"></div>

      {/* Registration Card */}
      <div className="relative w-full max-w-md glass-card p-8 border border-white/10 z-10 animate-fadeInUp">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl shadow-xl shadow-primary-500/20 mb-4 animate-bounce">
            <FiCpu />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Register Account
          </h2>
          <p className="text-xs font-semibold text-dark-300 uppercase tracking-widest mt-1.5">
            Spin Up a New E-Commerce Node
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-danger-500/10 border border-danger-500/25 text-xs text-danger-400 font-semibold animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Full Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-dark-300">
              Administrator Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-dark-300">
                <FiUser />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="input-dark pl-11 py-2.5"
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-dark-300">
              E-Mail Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-dark-300">
                <FiMail />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@example.com"
                className="input-dark pl-11 py-2.5"
                disabled={loading}
              />
            </div>
          </div>

          {/* Store Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-dark-300">
              E-Commerce Store Title
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-dark-300">
                <FiActivity />
              </span>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g. TechnoGlow Store"
                className="input-dark pl-11 py-2.5"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-dark-300">
              Account Password (Min 6 Characters)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-dark-300">
                <FiLock />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-dark pl-11 py-2.5"
                disabled={loading}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-dark-300">
              Confirm Account Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-dark-300">
                <FiLock />
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="input-dark pl-11 py-2.5"
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-glow w-full py-3.5 tracking-wider uppercase font-bold text-xs mt-4 cursor-pointer"
            disabled={loading}
          >
            {loading ? 'Registering Store Node...' : 'Generate New Account Node'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-dark-600/30 pt-4">
          <p className="text-xs text-dark-200">
            Already configured a node?{' '}
            <Link
              to="/login"
              className="font-bold text-primary-400 hover:text-primary-300 transition-colors"
            >
              Sign In to Connection
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
