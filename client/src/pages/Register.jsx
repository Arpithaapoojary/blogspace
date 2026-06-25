import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return setError('Please fill in all fields.');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const perks = ['Share your ideas with the world', 'Markdown-powered editor', 'Connect with readers & writers', 'Free forever, no credit card'];

  return (
    <main className="page-wrapper auth-page">
      <div className="auth-split">
        {/* Left panel */}
        <div className="auth-panel auth-panel--left">
          <div className="auth-brand">
            <span className="auth-logo-mark">B</span>
            <span className="auth-logo-text">logSpace</span>
          </div>
          <div className="auth-panel__content">
            <h2 className="auth-panel__tagline">Your words <span className="gradient-text">deserve an audience</span></h2>
            <p className="auth-panel__desc">Start writing in minutes. Share your knowledge, stories, and expertise with thousands of readers.</p>
            <ul className="auth-perks">
              {perks.map(p => (
                <li key={p} className="auth-perk">
                  <span className="auth-perk-dot" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right panel */}
        <div className="auth-panel auth-panel--right">
          <div className="auth-form-wrap fade-in-up">
            <div className="auth-form-header">
              <h1 className="auth-form-title">Create your account</h1>
              <p className="auth-form-sub">Join thousands of writers today</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full name</label>
                <div className="input-group">
                  <User size={15} className="input-icon" />
                  <input id="name" name="name" type="text" className="form-input" placeholder="Jane Doe" value={form.name} onChange={handleChange} style={{ paddingLeft: '2.25rem' }} autoComplete="name" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email address</label>
                <div className="input-group">
                  <Mail size={15} className="input-icon" />
                  <input id="email" name="email" type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} style={{ paddingLeft: '2.25rem' }} autoComplete="email" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <div className="input-group">
                  <Lock size={15} className="input-icon" />
                  <input id="password" name="password" type={showPass ? 'text' : 'password'} className="form-input" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} style={{ paddingLeft: '2.25rem', paddingRight: '2.5rem' }} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-subtle)' }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
                <div className="input-group">
                  <Lock size={15} className="input-icon" />
                  <input id="confirmPassword" name="confirmPassword" type={showPass ? 'text' : 'password'} className="form-input" placeholder="Repeat your password" value={form.confirmPassword} onChange={handleChange} style={{ paddingLeft: '2.25rem' }} autoComplete="new-password" />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading} style={{ marginTop: '0.5rem' }}>
                {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : <UserPlus size={17} />}
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>

            <p className="auth-form-footer">
              Already have an account? <Link to="/login" className="auth-form-link">Sign in →</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page { display: flex; padding-top: 0 !important; }
        .auth-split { display: flex; flex: 1; min-height: calc(100vh - 64px); }
        .auth-panel { display: flex; flex-direction: column; justify-content: center; padding: 3rem; }
        .auth-panel--left {
          flex: 1; border-right: 1px solid var(--border);
          background: radial-gradient(ellipse at 30% 70%, rgba(59,130,246,0.06) 0%, transparent 60%),
                      radial-gradient(ellipse at 70% 30%, rgba(168,85,247,0.06) 0%, transparent 60%),
                      var(--bg-subtle);
        }
        .auth-panel--right { flex: 1; align-items: center; background: var(--bg-base); }
        .auth-form-wrap { width: 100%; max-width: 380px; }
        .auth-brand { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; margin-bottom: auto; padding-bottom: 3rem; }
        .auth-logo-mark { width: 32px; height: 32px; background: var(--fg-base); color: var(--bg-base); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; }
        .auth-logo-text { font-size: 1.0625rem; color: var(--fg-base); }
        .auth-panel__content { padding: 2rem 0; }
        .auth-panel__tagline { font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 1rem; }
        .auth-panel__desc { font-size: 1rem; color: var(--fg-muted); line-height: 1.7; max-width: 320px; margin-bottom: 1.5rem; }
        .auth-perks { list-style: none; display: flex; flex-direction: column; gap: 0.625rem; }
        .auth-perk { display: flex; align-items: center; gap: 0.625rem; font-size: 0.9375rem; color: var(--fg-muted); }
        .auth-perk-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
        .auth-form-header { margin-bottom: 1.75rem; }
        .auth-form-title { font-size: 1.625rem; font-weight: 800; letter-spacing: -0.02em; color: var(--fg-base); margin-bottom: 0.375rem; }
        .auth-form-sub { font-size: 0.9375rem; color: var(--fg-muted); }
        .auth-form-footer { text-align: center; margin-top: 1.5rem; font-size: 0.875rem; color: var(--fg-muted); }
        .auth-form-link { color: var(--accent); font-weight: 500; text-decoration: none; }
        .auth-form-link:hover { text-decoration: underline; }
        @media (max-width: 700px) {
          .auth-panel--left { display: none; }
          .auth-panel--right { padding: 2rem 1.5rem; align-items: stretch; }
          .auth-form-wrap { max-width: 100%; }
        }
      `}</style>
    </main>
  );
}
