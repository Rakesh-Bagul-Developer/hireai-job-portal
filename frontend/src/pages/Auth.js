import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form);
      toast.success(`Welcome back, ${data.user.first_name || data.user.username}!`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.non_field_errors?.[0] || 'Login failed.';
      toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
            <Briefcase size={22} /> HireAI
          </div>
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input name="username" placeholder="Enter your username" value={form.username} onChange={handle} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input name="password" type={showPwd ? 'text' : 'password'} placeholder="Enter your password"
                value={form.password} onChange={handle} required style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.875rem', color: 'var(--text3)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register</Link>
        </p>
      </div>
    </div>
  );
}

export function Register() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    username: '', email: '', first_name: '', last_name: '',
    password: '', password2: '', role: searchParams.get('role') || 'jobseeker', phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    if (form.password !== form.password2) { toast.error('Passwords do not match!'); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to HireAI.');
      navigate('/dashboard');
    } catch (err) {
      const errs = err.response?.data;
      if (errs) {
        Object.values(errs).flat().forEach(m => toast.error(m));
      } else { toast.error('Registration failed.'); }
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 500 }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
            <Briefcase size={22} /> HireAI
          </div>
          <h2 className="auth-title">Create account</h2>
          <p className="auth-subtitle">Join thousands of professionals</p>
        </div>

        {/* Role toggle */}
        <div style={{ display: 'flex', background: 'var(--surface2)', borderRadius: 10, padding: 4, marginBottom: '1.5rem' }}>
          {[{ value: 'jobseeker', label: '🔍 Job Seeker' }, { value: 'employer', label: '🏢 Employer' }].map(opt => (
            <button key={opt.value} type="button" onClick={() => setForm({ ...form, role: opt.value })}
              style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s',
                background: form.role === opt.value ? 'var(--primary)' : 'transparent',
                color: form.role === opt.value ? 'white' : 'var(--text2)' }}>
              {opt.label}
            </button>
          ))}
        </div>

        <form onSubmit={submit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input name="first_name" placeholder="John" value={form.first_name} onChange={handle} required />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input name="last_name" placeholder="Doe" value={form.last_name} onChange={handle} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input name="username" placeholder="johndoe" value={form.username} onChange={handle} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handle} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input name="phone" placeholder="+91 9876543210" value={form.phone} onChange={handle} />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input name="password" type={showPwd ? 'text' : 'password'} placeholder="Min 6 chars"
                  value={form.password} onChange={handle} required style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input name="password2" type="password" placeholder="Repeat password" value={form.password2} onChange={handle} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.875rem', color: 'var(--text3)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
