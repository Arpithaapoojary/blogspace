import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  PenSquare, Sun, Moon, Menu, X, ChevronDown, Search,
  User, LayoutDashboard, Settings, LogOut, Home, Info, Mail, Bell, Shield
} from 'lucide-react';
import { getInitials } from '../utils/helpers';
import api from '../utils/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (user) {
      api.get('/notifications').then(res => {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }).catch(err => console.error(err));
    }
  }, [user]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {}
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {}
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
        <div className="navbar__inner container">
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-mark">B</span>
            <span className="navbar__logo-text">logSpace</span>
          </Link>

          {/* Desktop nav links */}
          <nav className="navbar__links">
            <NavLink to="/" className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`} end>Home</NavLink>
            <NavLink to="/about" className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}>About</NavLink>
            <NavLink to="/contact" className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}>Contact</NavLink>
          </nav>

          {/* Right side actions */}
          <div className="navbar__actions">
            {/* Search */}
            <div ref={searchRef} style={{ position: 'relative' }}>
              <button className="btn btn-ghost btn-icon btn-sm navbar__icon-btn" onClick={() => setSearchOpen(s => !s)} aria-label="Search">
                <Search size={16} />
              </button>
              {searchOpen && (
                <form className="navbar__search-popup fade-in" onSubmit={handleSearch}>
                  <div className="input-group">
                    <Search size={15} className="input-icon" />
                    <input
                      autoFocus
                      className="form-input"
                      placeholder="Search posts…"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      style={{ paddingLeft: '2.25rem' }}
                    />
                  </div>
                </form>
              )}
            </div>

            {/* Theme toggle */}
            <button className="btn btn-ghost btn-icon btn-sm navbar__icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {user ? (
              <>
                <Link to="/create" className="btn btn-secondary btn-sm">
                  <PenSquare size={14} />
                  <span className="navbar__write-text">Write</span>
                </Link>

                {/* Notifications dropdown */}
                <div ref={notifRef} style={{ position: 'relative' }}>
                  <button className="btn btn-ghost btn-icon btn-sm navbar__icon-btn" style={{ position: 'relative' }} onClick={() => setNotifOpen(o => !o)} aria-label="Notifications">
                    <Bell size={16} />
                    {unreadCount > 0 && <span className="navbar__notif-badge">{unreadCount}</span>}
                  </button>
                  {notifOpen && (
                    <div className="navbar__dropdown scale-in" style={{ width: 300 }}>
                      <div className="navbar__dropdown-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p className="navbar__dropdown-name">Notifications</p>
                        {unreadCount > 0 && (
                          <button onClick={handleMarkAllRead} className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '0.25rem' }}>Mark all read</button>
                        )}
                      </div>
                      <div className="navbar__dropdown-divider" />
                      <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                          <p style={{ padding: '1rem', textAlign: 'center', color: 'var(--fg-muted)', fontSize: '0.875rem' }}>No notifications yet.</p>
                        ) : (
                          notifications.map(n => (
                            <div key={n._id} onClick={() => !n.read && handleMarkAsRead(n._id)} style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)', background: n.read ? 'transparent' : 'var(--bg-subtle)', cursor: 'pointer' }}>
                              <p style={{ fontSize: '0.875rem', margin: 0 }}>
                                <strong>{n.sender.name}</strong> {n.type === 'follow' ? 'started following you.' : n.type === 'like' ? 'liked your post.' : 'commented on your post.'}
                              </p>
                              {n.post && <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', marginTop: '0.25rem' }}>{n.post.title}</p>}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User dropdown */}
                <div ref={dropdownRef} className="navbar__dropdown-wrap">
                  <button className="navbar__avatar-btn" onClick={() => setDropdownOpen(o => !o)}>
                    <span className="avatar avatar-sm">{getInitials(user.name)}</span>
                    <ChevronDown size={13} className={`navbar__chevron${dropdownOpen ? ' open' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="navbar__dropdown scale-in">
                      <div className="navbar__dropdown-header">
                        <p className="navbar__dropdown-name">{user.name}</p>
                        <p className="navbar__dropdown-email">{user.email}</p>
                      </div>
                      <div className="navbar__dropdown-divider" />
                      <Link to="/dashboard" className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>
                      <Link to="/settings" className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <Settings size={15} /> Settings
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
                          <Shield size={15} /> Admin Dashboard
                        </Link>
                      )}
                      <div className="navbar__dropdown-divider" />
                      <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={handleLogout}>
                        <LogOut size={15} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign up</Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button className="btn btn-ghost btn-icon btn-sm navbar__hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu fade-in" onClick={() => setMenuOpen(false)}>
          <div className="mobile-menu__inner" onClick={e => e.stopPropagation()}>
            <div className="mobile-menu__header">
              <span className="navbar__logo">
                <span className="navbar__logo-mark">B</span>
                <span className="navbar__logo-text">logSpace</span>
              </span>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setMenuOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <nav className="mobile-menu__nav">
              <Link to="/" className="mobile-menu__link" onClick={() => setMenuOpen(false)}><Home size={16} /> Home</Link>
              <Link to="/about" className="mobile-menu__link" onClick={() => setMenuOpen(false)}><Info size={16} /> About</Link>
              <Link to="/contact" className="mobile-menu__link" onClick={() => setMenuOpen(false)}><Mail size={16} /> Contact</Link>
              {user && <>
                <Link to="/dashboard" className="mobile-menu__link" onClick={() => setMenuOpen(false)}><LayoutDashboard size={16} /> Dashboard</Link>
                <Link to="/create" className="mobile-menu__link" onClick={() => setMenuOpen(false)}><PenSquare size={16} /> Write</Link>
                <Link to="/settings" className="mobile-menu__link" onClick={() => setMenuOpen(false)}><Settings size={16} /> Settings</Link>
              </>}
            </nav>
            <div className="mobile-menu__footer">
              {user ? (
                <button className="btn btn-secondary w-full" onClick={() => { handleLogout(); setMenuOpen(false); }}>
                  <LogOut size={15} /> Sign out
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link to="/login" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setMenuOpen(false)}>Log in</Link>
                  <Link to="/register" className="btn btn-primary" style={{ flex: 1 }} onClick={() => setMenuOpen(false)}>Sign up</Link>
                </div>
              )}
              <button className="btn btn-ghost btn-sm" onClick={toggleTheme} style={{ marginTop: '0.5rem', width: '100%' }}>
                {theme === 'dark' ? <><Sun size={15} /> Light mode</> : <><Moon size={15} /> Dark mode</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* ── NAVBAR ── */
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          height: 64px;
          background: var(--bg-overlay);
          backdrop-filter: saturate(180%) blur(16px);
          -webkit-backdrop-filter: saturate(180%) blur(16px);
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .navbar--scrolled { border-bottom-color: var(--border); box-shadow: var(--shadow-sm); }
        .navbar__inner { display: flex; align-items: center; gap: 1.5rem; height: 64px; }

        .navbar__logo {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          color: var(--fg-base);
          flex-shrink: 0;
        }
        .navbar__logo-mark {
          width: 28px; height: 28px;
          background: var(--fg-base);
          color: var(--bg-base);
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.875rem;
          font-weight: 800;
        }

        .navbar__links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-left: 0.5rem;
        }
        .navbar__link {
          padding: 0.375rem 0.75rem;
          border-radius: var(--r-md);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--fg-muted);
          transition: color 0.15s, background 0.15s;
          text-decoration: none;
        }
        .navbar__link:hover { color: var(--fg-base); background: var(--bg-subtle); }
        .navbar__link.active { color: var(--fg-base); }

        .navbar__actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-left: auto;
        }
        .navbar__icon-btn { color: var(--fg-muted) !important; }
        .navbar__icon-btn:hover { color: var(--fg-base) !important; }

        .navbar__notif-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background: var(--primary);
          color: white;
          font-size: 0.625rem;
          font-weight: 700;
          padding: 0 4px;
          border-radius: 10px;
          min-width: 14px;
          text-align: center;
        }

        /* Search popup */
        .navbar__search-popup {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 280px;
          background: var(--surface-1);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          padding: 0.75rem;
          box-shadow: var(--shadow-lg);
          z-index: 200;
        }

        /* Avatar dropdown */
        .navbar__avatar-btn {
          display: flex; align-items: center; gap: 0.375rem;
          background: none; border: none; cursor: pointer;
          padding: 0.25rem; border-radius: var(--r-full);
          transition: opacity 0.15s;
        }
        .navbar__avatar-btn:hover { opacity: 0.8; }
        .navbar__chevron { color: var(--fg-muted); transition: transform 0.2s; }
        .navbar__chevron.open { transform: rotate(180deg); }

        .navbar__dropdown-wrap { position: relative; }
        .navbar__dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 220px;
          background: var(--surface-1);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          padding: 0.375rem;
          box-shadow: var(--shadow-xl);
          z-index: 200;
        }
        .navbar__dropdown-header { padding: 0.625rem 0.75rem 0.5rem; }
        .navbar__dropdown-name { font-weight: 600; font-size: 0.875rem; }
        .navbar__dropdown-email { font-size: 0.75rem; color: var(--fg-subtle); margin-top: 0.125rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .navbar__dropdown-divider { height: 1px; background: var(--border); margin: 0.25rem 0; }
        .navbar__dropdown-item {
          display: flex; align-items: center; gap: 0.625rem;
          width: 100%; padding: 0.5rem 0.75rem; border-radius: var(--r-sm);
          font-size: 0.875rem; font-weight: 500; color: var(--fg-muted);
          background: none; border: none; cursor: pointer; text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .navbar__dropdown-item:hover { background: var(--bg-subtle); color: var(--fg-base); }
        .navbar__dropdown-item--danger:hover { background: rgba(243,18,96,0.08); color: var(--danger); }

        /* Write text hidden on small */
        @media (max-width: 900px) { .navbar__write-text { display: none; } }

        /* Mobile hamburger visible only on mobile */
        .navbar__hamburger { display: none; }
        @media (max-width: 700px) {
          .navbar__hamburger { display: flex; }
          .navbar__links { display: none; }
          .navbar__actions .btn-primary,
          .navbar__actions .btn-secondary:not(.navbar__hamburger),
          .navbar__actions .btn-ghost:not(.navbar__icon-btn) { display: none; }
        }

        /* ── MOBILE MENU ── */
        .mobile-menu {
          position: fixed;
          inset: 0; z-index: 99;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
        }
        .mobile-menu__inner {
          position: absolute;
          top: 0; right: 0; bottom: 0;
          width: min(320px, 90vw);
          background: var(--surface-1);
          border-left: 1px solid var(--border);
          display: flex; flex-direction: column;
          padding: 1rem;
        }
        .mobile-menu__header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        .mobile-menu__nav { display: flex; flex-direction: column; gap: 0.25rem; flex: 1; }
        .mobile-menu__link {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.75rem 1rem; border-radius: var(--r-md);
          font-size: 0.9375rem; font-weight: 500;
          color: var(--fg-muted); text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .mobile-menu__link:hover { background: var(--bg-subtle); color: var(--fg-base); }
        .mobile-menu__footer { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border); }
      `}</style>
    </>
  );
}
