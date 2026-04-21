import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertBanner from '../components/common/AlertBanner';

export default function RegisterPage() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    role: params.get('role') === 'owner' ? 'owner' : 'customer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const user = await register(form);
      if (user.role === 'owner') navigate('/owner');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white text-xl">🛡️</div>
          <span className="font-display font-bold text-xl text-gray-900">SafeBite <span className="text-primary">AI</span></span>
        </Link>

        <div className="card">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-1">Create Account</h2>
          <p className="text-gray-500 text-sm mb-6">Join SafeBite AI today — it's free</p>

          {/* Role toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {['customer', 'owner'].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setForm(p => ({ ...p, role: r }))}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                  form.role === r ? 'bg-white text-primary shadow-sm' : 'text-gray-500'
                }`}
              >
                {r === 'customer' ? '👤 Customer' : '🏪 Restaurant Owner'}
              </button>
            ))}
          </div>

          {error && <div className="mb-5"><AlertBanner type="error" message={error} onClose={() => setError('')} /></div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input className="input-field" placeholder="Ravi Kumar" value={form.name} onChange={set('name')} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" className="input-field" placeholder="ravi@example.com" value={form.email} onChange={set('email')} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone (optional)</label>
              <input className="input-field" placeholder="+91 9876543210" value={form.phone} onChange={set('phone')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" className="input-field" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-xl text-base mt-2">
              {loading ? '⏳ Creating account...' : `Create ${form.role === 'owner' ? 'Business' : ''} Account →`}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
