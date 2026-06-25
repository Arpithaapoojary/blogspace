import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="page-wrapper">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
        <div className="nf-content fade-in-up">
          <div className="nf-code">404</div>
          <h1 className="nf-title">Page not found</h1>
          <p className="nf-desc">Sorry, we couldn't find the page you're looking for. It may have been moved or deleted.</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-primary">
              <ArrowLeft size={15} /> Back to Home
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        .nf-content { text-align: center; max-width: 480px; }
        .nf-code { font-size: 8rem; font-weight: 900; letter-spacing: -0.05em; line-height: 1; color: var(--border); margin-bottom: 1rem; }
        .nf-title { font-size: 1.625rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 1rem; }
        .nf-desc { font-size: 1rem; color: var(--fg-muted); line-height: 1.7; margin-bottom: 2rem; }
      `}</style>
    </main>
  );
}
