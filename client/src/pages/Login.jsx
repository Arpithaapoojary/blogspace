import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError('Please fill in all fields.');
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

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
            <h2 className="auth-panel__tagline">Join a community of <span className="gradient-text">passionate writers</span></h2>
            <p className="auth-panel__desc">Discover thousands of stories, ideas, and expertise from writers on any topic.</p>
            <div className="auth-panel__dots">
              <div className="auth-dot" style={{ '--c': '#3b82f6' }} />
              <div className="auth-dot" style={{ '--c': '#a855f7' }} />
              <div className="auth-dot" style={{ '--c': '#f59e0b' }} />
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="auth-panel auth-panel--right">
          <div className="auth-form-wrap fade-in-up">
            <div className="auth-form-header">
              <h1 className="auth-form-title">Welcome back</h1>
              <p className="auth-form-sub">Enter your credentials to sign in</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email address</label>
                <div className="input-group">
                  <Mail size={15} className="input-icon" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    style={{ paddingLeft: '2.25rem' }}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" htmlFor="password">Password</label>
                </div>
                <div className="input-group">
                  <Lock size={15} className="input-icon" />
                  <input
                    id="password"
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Your password"
                    value={form.password}
                    onChange={handleChange}
                    style={{ paddingLeft: '2.25rem', paddingRight: '2.5rem' }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-subtle)' }}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading} style={{ marginTop: '0.5rem' }}>
                {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : <LogIn size={17} />}
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <p className="auth-form-footer">
              Don't have an account? <Link to="/register" className="auth-form-link">Create one →</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page { display: flex; padding-top: 0 !important; }
        .auth-split { display: flex; flex: 1; min-height: calc(100vh - 64px); }

        .auth-panel { display: flex; flex-direction: column; justify-content: center; padding: 3rem; }
        .auth-panel--left {
          flex: 1; background: var(--bg-subtle); border-right: 1px solid var(--border);
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
        .auth-panel__tagline { font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 1rem; color: var(--fg-base); }
        .auth-panel__desc { font-size: 1rem; color: var(--fg-muted); line-height: 1.7; max-width: 320px; }
        .auth-panel__dots { display: flex; gap: 0.5rem; margin-top: 2rem; }
        .auth-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--c); opacity: 0.7; }

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
