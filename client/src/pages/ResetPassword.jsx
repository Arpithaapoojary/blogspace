import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth(); // or just navigate to login

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const { data } = await api.put(`/auth/resetpassword/${token}`, { password });
      setMessage('Password reset successful. Redirecting...');
      setTimeout(() => {
        // Automatically log them in since the backend returns the user with token
        login(data);
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-wrapper center-content">
      <div className="auth-card fade-in-up">
        <h1 className="auth-title">Reset password</h1>
        <p className="auth-subtitle">Enter your new password below</p>

        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="password">New Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Reset Password'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </main>
  );
}
