import { Link } from 'react-router-dom';
import { PenSquare, Users, Globe, Zap } from 'lucide-react';

const TEAM = [
  { name: 'Alex Carter', role: 'Founder & Developer', initials: 'AC' },
  { name: 'Priya Mehta', role: 'Product Designer', initials: 'PM' },
  { name: 'Jordan Lee', role: 'Backend Engineer', initials: 'JL' },
];

const VALUES = [
  { icon: <PenSquare size={20} />, title: 'Open Writing', desc: 'We believe in the power of open expression. Anyone can publish their ideas.' },
  { icon: <Users size={20} />, title: 'Community First', desc: 'A supportive community of writers, readers, and thinkers from around the world.' },
  { icon: <Globe size={20} />, title: 'Global Reach', desc: 'Connect your ideas with readers globally, without barriers.' },
  { icon: <Zap size={20} />, title: 'Always Fast', desc: 'Optimized for speed and performance so your content loads instantly.' },
];

export default function About() {
  return (
    <main className="page-wrapper">
      {/* Hero */}
      <section className="about-hero">
        <div className="container-sm">
          <div className="fade-in-up">
            <p className="about-eyebrow">Our story</p>
            <h1 className="about-title">Built for writers <span className="gradient-text">who have something to say</span></h1>
            <p className="about-desc">
              BlogSpace was created with a simple idea: everyone has a story worth sharing. 
              We built a platform that combines the simplicity of a notebook with the power of the web.
            </p>
          </div>
        </div>
        <div className="about-hero__bg" />
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <h2 className="about-section-title fade-in-up">Our values</h2>
          <div className="about-values fade-in-up delay-100">
            {VALUES.map(v => (
              <div key={v.title} className="about-value-card">
                <div className="about-value-icon">{v.icon}</div>
                <h3 className="about-value-title">{v.title}</h3>
                <p className="about-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section" style={{ background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <h2 className="about-section-title fade-in-up">The team</h2>
          <div className="about-team fade-in-up delay-100">
            {TEAM.map(m => (
              <div key={m.name} className="about-team-card">
                <span className="avatar avatar-xl" style={{ margin: '0 auto 1rem', display: 'flex' }}>{m.initials}</span>
                <div className="about-team-name">{m.name}</div>
                <div className="about-team-role">{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container-xs">
          <div className="about-cta fade-in-up">
            <h2 className="about-cta-title">Ready to start writing?</h2>
            <p style={{ color: 'var(--fg-muted)', marginBottom: '2rem', fontSize: '1.0625rem' }}>Join thousands of writers sharing their ideas every day.</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <Link to="/register" className="btn btn-primary btn-lg">Create an account</Link>
              <Link to="/" className="btn btn-secondary btn-lg">Browse posts</Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .about-hero { position: relative; padding: calc(var(--s-20) + 1rem) 0 var(--s-16); text-align: center; overflow: hidden; }
        .about-hero__bg { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59,130,246,0.07), transparent 70%); pointer-events: none; }
        .about-eyebrow { font-size: 0.875rem; font-weight: 600; color: var(--accent); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 1rem; }
        .about-title { font-size: clamp(2rem, 4.5vw, 3rem); font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 1.5rem; }
        .about-desc { font-size: 1.125rem; color: var(--fg-muted); line-height: 1.7; max-width: 520px; margin: 0 auto; }

        .about-section-title { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 2rem; }

        .about-values { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; }
        .about-value-card { padding: 1.5rem; border: 1px solid var(--border); border-radius: var(--r-lg); background: var(--surface-1); transition: border-color 0.2s, box-shadow 0.2s; }
        .about-value-card:hover { border-color: var(--border-hover); box-shadow: var(--shadow-sm); }
        .about-value-icon { color: var(--accent); margin-bottom: 1rem; }
        .about-value-title { font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
        .about-value-desc { font-size: 0.875rem; color: var(--fg-muted); line-height: 1.6; }

        .about-team { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.5rem; }
        .about-team-card { text-align: center; padding: 2rem 1rem; }
        .about-team-name { font-weight: 700; margin-bottom: 0.25rem; }
        .about-team-role { font-size: 0.875rem; color: var(--fg-muted); }

        .about-cta { text-align: center; }
        .about-cta-title { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 1rem; }
      `}</style>
    </main>
  );
}
