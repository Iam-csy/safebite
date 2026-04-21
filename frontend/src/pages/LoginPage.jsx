import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertBanner from '../components/common/AlertBanner';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'owner') navigate('/owner');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gray-900 p-12 text-white">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-xl">🛡️</div>
          <span className="font-display font-bold text-xl">SafeBite <span className="text-primary-light">AI</span></span>
        </Link>
        <div>
          <p className="font-display text-5xl font-bold leading-tight mb-6">
            Monitor.<br />Verify.<br /><span className="text-primary-light">Eat Safe.</span>
          </p>
          <p className="text-gray-400 leading-relaxed">
            Join thousands of customers and restaurant owners building a safer food ecosystem across India.
          </p>
        </div>
        <div className="flex gap-6 text-sm text-gray-500">
          <span>🏅 500+ Verified Restaurants</span>
          <span>🤖 AI-Powered</span>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">🛡️</div>
            <span className="font-display font-bold text-lg">SafeBite AI</span>
          </Link>

          <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-8">Sign in to your SafeBite account</p>

          {error && <div className="mb-6"><AlertBanner type="error" message={error} onClose={() => setError('')} /></div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-xl text-base">
              {loading ? '⏳ Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
