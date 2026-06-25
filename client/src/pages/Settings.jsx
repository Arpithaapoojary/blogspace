import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, FileText, Image, Save, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { getInitials } from '../utils/helpers';

export default function Settings() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '', bio: user?.bio || '', avatar: user?.avatar || '' });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  const [passMsg, setPassMsg] = useState(null);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setProfileMsg(null);
    try {
      const { data } = await api.put('/users/profile', {
        name: profile.name,
        bio: profile.bio,
        avatar: profile.avatar,
      });
      if (setUser) setUser(prev => ({ ...prev, name: data.name, avatar: data.avatar, bio: data.bio }));
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handlePassSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) return setPassMsg({ type: 'error', text: 'New passwords do not match.' });
    if (passwords.newPass.length < 6) return setPassMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
    setChangingPass(true); setPassMsg(null);
    try {
      await api.put('/users/password', { currentPassword: passwords.current, newPassword: passwords.newPass });
      setPasswords({ current: '', newPass: '', confirm: '' });
      setPassMsg({ type: 'success', text: 'Password changed successfully!' });
    } catch (err) {
      setPassMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <main className="page-wrapper">
      <div className="container-sm">
        <div style={{ padding: '2.5rem 0 1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Settings</h1>
          <p style={{ color: 'var(--fg-muted)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>Manage your account preferences</p>
        </div>

        {/* Profile card */}
        <div className="settings-card fade-in-up">
          <div className="settings-card__header">
            <div>
              <h2 className="settings-card__title">Profile</h2>
              <p className="settings-card__sub">Update your public profile information</p>
            </div>
            <span className="avatar avatar-lg">{profile.avatar ? <img src={profile.avatar} alt={user?.name} /> : getInitials(profile.name)}</span>
          </div>

          {profileMsg && <div className={`alert alert-${profileMsg.type}`}>{profileMsg.text}</div>}

          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label className="form-label"><User size={13} style={{ display: 'inline', marginRight: 4 }} /> Display name</label>
              <input className="form-input" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} placeholder="Jane Doe" />
            </div>
            <div className="form-group">
              <label className="form-label"><Mail size={13} style={{ display: 'inline', marginRight: 4 }} /> Email address</label>
              <input className="form-input" value={profile.email} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
              <p className="form-hint">Email cannot be changed for security reasons.</p>
            </div>
            <div className="form-group">
              <label className="form-label"><FileText size={13} style={{ display: 'inline', marginRight: 4 }} /> Bio</label>
              <textarea className="form-input" rows={3} value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} placeholder="Tell us about yourself…" />
            </div>
            <div className="form-group">
              <label className="form-label"><Image size={13} style={{ display: 'inline', marginRight: 4 }} /> Avatar URL</label>
              <input type="url" className="form-input" value={profile.avatar} onChange={e => setProfile(p => ({ ...p, avatar: e.target.value }))} placeholder="https://…" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <span className="spinner" style={{ width: 15, height: 15 }} /> : <Save size={15} />}
                {saving ? 'Saving…' : 'Save profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Password card */}
        <div className="settings-card fade-in-up delay-100">
          <div className="settings-card__header" style={{ marginBottom: '1.25rem' }}>
            <div>
              <h2 className="settings-card__title">Password</h2>
              <p className="settings-card__sub">Change your account password</p>
            </div>
            <Lock size={20} style={{ color: 'var(--fg-subtle)' }} />
          </div>

          {passMsg && <div className={`alert alert-${passMsg.type}`}>{passMsg.text}</div>}

          <form onSubmit={handlePassSubmit}>
            <div className="form-group">
              <label className="form-label">Current password</label>
              <div className="input-group">
                <Lock size={15} className="input-icon" />
                <input type={showCurrent ? 'text' : 'password'} className="form-input" placeholder="Current password" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} style={{ paddingLeft: '2.25rem', paddingRight: '2.5rem' }} />
                <button type="button" onClick={() => setShowCurrent(s => !s)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-subtle)' }}>
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">New password</label>
              <div className="input-group">
                <Lock size={15} className="input-icon" />
                <input type={showNew ? 'text' : 'password'} className="form-input" placeholder="Min. 6 characters" value={passwords.newPass} onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))} style={{ paddingLeft: '2.25rem', paddingRight: '2.5rem' }} />
                <button type="button" onClick={() => setShowNew(s => !s)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-subtle)' }}>
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm new password</label>
              <div className="input-group">
                <Lock size={15} className="input-icon" />
                <input type="password" className="form-input" placeholder="Repeat new password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} style={{ paddingLeft: '2.25rem' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={changingPass}>
                {changingPass ? <span className="spinner" style={{ width: 15, height: 15 }} /> : <Lock size={15} />}
                {changingPass ? 'Changing…' : 'Change password'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .settings-card { background: var(--surface-1); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 1.75rem; margin-bottom: 1.5rem; }
        .settings-card__header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; }
        .settings-card__title { font-size: 1.0625rem; font-weight: 700; color: var(--fg-base); margin-bottom: 0.25rem; }
        .settings-card__sub { font-size: 0.875rem; color: var(--fg-muted); }
      `}</style>
    </main>
  );
}
