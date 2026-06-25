import { Link } from 'react-router-dom';
import { Globe, Code, Mail, Rss } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span className="footer__logo-mark">B</span>
              <span>logSpace</span>
            </Link>
            <p className="footer__tagline">
              A place to share ideas, stories, and knowledge with the world.
            </p>
            <div className="footer__social">
              <a href="#" className="footer__social-btn" aria-label="Website"><Globe size={17} /></a>
              <a href="#" className="footer__social-btn" aria-label="GitHub"><Code size={17} /></a>
              <a href="#" className="footer__social-btn" aria-label="Contact"><Mail size={17} /></a>
              <a href="#" className="footer__social-btn" aria-label="RSS"><Rss size={17} /></a>
            </div>
          </div>

          {/* Nav columns */}
          <div className="footer__col">
            <p className="footer__col-title">Platform</p>
            <Link to="/" className="footer__col-link">Home</Link>
            <Link to="/about" className="footer__col-link">About</Link>
            <Link to="/contact" className="footer__col-link">Contact</Link>
          </div>

          <div className="footer__col">
            <p className="footer__col-title">Account</p>
            <Link to="/login" className="footer__col-link">Sign in</Link>
            <Link to="/register" className="footer__col-link">Create account</Link>
            <Link to="/dashboard" className="footer__col-link">Dashboard</Link>
            <Link to="/settings" className="footer__col-link">Settings</Link>
          </div>

          <div className="footer__col">
            <p className="footer__col-title">Writing</p>
            <Link to="/create" className="footer__col-link">Write a post</Link>
            <Link to="/tag/javascript" className="footer__col-link">Explore JavaScript</Link>
            <Link to="/tag/react" className="footer__col-link">Explore React</Link>
            <Link to="/tag/webdev" className="footer__col-link">Explore Web Dev</Link>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">© {year} BlogSpace. All rights reserved.</p>
          <div className="footer__bottom-links">
            <a href="#" className="footer__col-link">Privacy</a>
            <a href="#" className="footer__col-link">Terms</a>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          border-top: 1px solid var(--border);
          background: var(--bg-subtle);
          padding: 3rem 0 1.5rem;
          margin-top: auto;
        }
        .footer__grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2.5rem;
        }
        .footer__logo {
          display: flex; align-items: center; gap: 0.375rem;
          font-weight: 700; font-size: 1rem;
          text-decoration: none; color: var(--fg-base);
          margin-bottom: 0.75rem;
        }
        .footer__logo-mark {
          width: 26px; height: 26px;
          background: var(--fg-base);
          color: var(--bg-base);
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8125rem; font-weight: 800;
        }
        .footer__tagline { font-size: 0.875rem; color: var(--fg-muted); line-height: 1.6; max-width: 220px; margin-bottom: 1rem; }
        .footer__social { display: flex; gap: 0.5rem; }
        .footer__social-btn {
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: var(--r-md);
          border: 1px solid var(--border);
          color: var(--fg-muted);
          transition: border-color 0.15s, color 0.15s, background 0.15s;
          text-decoration: none;
        }
        .footer__social-btn:hover { border-color: var(--border-hover); color: var(--fg-base); background: var(--bg-muted); }

        .footer__col { display: flex; flex-direction: column; gap: 0.5rem; }
        .footer__col-title { font-size: 0.75rem; font-weight: 600; color: var(--fg-base); letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 0.25rem; }
        .footer__col-link { font-size: 0.875rem; color: var(--fg-muted); text-decoration: none; transition: color 0.15s; }
        .footer__col-link:hover { color: var(--fg-base); }

        .footer__bottom {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 1.5rem; border-top: 1px solid var(--border);
          flex-wrap: wrap; gap: 0.75rem;
        }
        .footer__copy { font-size: 0.8125rem; color: var(--fg-subtle); }
        .footer__bottom-links { display: flex; gap: 1rem; }

        @media (max-width: 768px) {
          .footer__grid { grid-template-columns: 1fr 1fr; }
          .footer__brand { grid-column: 1 / -1; }
        }
        @media (max-width: 480px) {
          .footer__grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </footer>
  );
}
