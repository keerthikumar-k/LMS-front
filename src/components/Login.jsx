import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Spinner = () => (
  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

const InputField = ({ label, name, type = 'text', value, onChange, error, placeholder, rightEl }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${rightEl ? 'pr-11' : ''} ${error ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
      />
      {rightEl && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>
      )}
    </div>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

// ─── LOGIN FORM ───────────────────────────────────────────────
const LoginForm = ({ onSwitch }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'keerthikumar.doe@company.com', password: 'password123' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setApiError('');
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    setApiError('');
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setApiError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {apiError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          <span>❌</span> {apiError}
        </div>
      )}

      <InputField
        label="Email Address" name="email" type="email"
        value={form.email} onChange={handleChange}
        error={errors.email} placeholder="you@company.com"
      />

      <InputField
        label="Password" name="password"
        type={showPwd ? 'text' : 'password'}
        value={form.password} onChange={handleChange}
        error={errors.password} placeholder="••••••••"
        rightEl={
          <button type="button" onClick={() => setShowPwd(s => !s)} className="text-slate-400 hover:text-slate-600 text-lg">
            {showPwd ? '🙈' : '👁️'}
          </button>
        }
      />

      <button
        type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold shadow-md hover:shadow-indigo-200 hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? <><Spinner /> Signing in...</> : 'Sign In'}
      </button>



      <p className="text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-indigo-600 font-semibold hover:text-indigo-800">
          Register here
        </button>
      </p>
    </form>
  );
};

// ─── REGISTER FORM ────────────────────────────────────────────
const RegisterForm = ({ onSwitch }) => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', department: '', position: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required.';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    if (!form.department.trim()) e.department = 'Department is required.';
    if (!form.position.trim()) e.position = 'Position is required.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setApiError('');
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    setApiError('');
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        department: form.department,
        position: form.position,
        phone: form.phone,
      });
      navigate('/');
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {apiError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          <span>❌</span> {apiError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Full Name *"   name="name"       value={form.name}       onChange={handleChange} error={errors.name}       placeholder="John Doe" />
        <InputField label="Email Address *" name="email"    type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="you@company.com" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Password *" name="password"
          type={showPwd ? 'text' : 'password'}
          value={form.password} onChange={handleChange}
          error={errors.password} placeholder="Min 6 characters"
          rightEl={
            <button type="button" onClick={() => setShowPwd(s => !s)} className="text-slate-400 hover:text-slate-600 text-lg">
              {showPwd ? '🙈' : '👁️'}
            </button>
          }
        />
        <InputField
          label="Confirm Password *" name="confirmPassword"
          type={showConfirm ? 'text' : 'password'}
          value={form.confirmPassword} onChange={handleChange}
          error={errors.confirmPassword} placeholder="Repeat password"
          rightEl={
            <button type="button" onClick={() => setShowConfirm(s => !s)} className="text-slate-400 hover:text-slate-600 text-lg">
              {showConfirm ? '🙈' : '👁️'}
            </button>
          }
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Department *" name="department" value={form.department} onChange={handleChange} error={errors.department} placeholder="e.g. Engineering" />
        <InputField label="Position *"   name="position"   value={form.position}   onChange={handleChange} error={errors.position}   placeholder="e.g. Developer" />
      </div>

      <InputField label="Phone (optional)" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />

      <button
        type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold shadow-md hover:shadow-indigo-200 hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? <><Spinner /> Creating account...</> : 'Create Account'}
      </button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-indigo-600 font-semibold hover:text-indigo-800">
          Sign in
        </button>
      </p>
    </form>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────
const Login = () => {
  const [tab, setTab] = useState('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-8 fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg mb-4">
            <span className="text-3xl">🗓️</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">LeaveManager</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage your leave requests with ease</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden fade-in-1">

          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-4 text-sm font-semibold transition-all ${tab === 'login' ? 'text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 py-4 text-sm font-semibold transition-all ${tab === 'register' ? 'text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <div className="p-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-6">
              {tab === 'login' ? 'Welcome back 👋' : 'Create your account 🚀'}
            </h2>
            {tab === 'login'
              ? <LoginForm  onSwitch={() => setTab('register')} />
              : <RegisterForm onSwitch={() => setTab('login')} />
            }
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          © {new Date().getFullYear()} LeaveManager. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
