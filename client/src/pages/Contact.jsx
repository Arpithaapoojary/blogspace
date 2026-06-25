import { useState } from 'react';
import { Mail, MapPin, Clock, Send, Check } from 'lucide-react';

const CONTACT_INFO = [
  { icon: <Mail size={18} />, title: 'Email', value: 'hello@blogspace.io', href: 'mailto:hello@blogspace.io' },
  { icon: <MapPin size={18} />, title: 'Location', value: 'Remote — Worldwide', href: null },
  { icon: <Clock size={18} />, title: 'Response time', value: 'Within 24 hours', href: null },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200)); // Simulated
    setSent(true);
    setLoading(false);
  };

  return (
    <main className="page-wrapper">
      <section className="contact-hero">
        <div className="container-sm">
          <div className="fade-in-up" style={{ textAlign: 'center' }}>
            <p className="contact-eyebrow">Get in touch</p>
            <h1 className="contact-title">We'd love to <span className="gradient-text">hear from you</span></h1>
            <p className="contact-desc">Whether you have a question, feedback, or just want to say hello — our inbox is always open.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Info */}
            <div className="contact-info fade-in-up">
              <h2 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '1.25rem' }}>Contact information</h2>
              {CONTACT_INFO.map(item => (
                <div key={item.title} className="contact-info-item">
                  <div className="contact-info-icon">{item.icon}</div>
                  <div>
                    <div className="contact-info-label">{item.title}</div>
                    {item.href ? (
                      <a href={item.href} className="contact-info-value contact-link">{item.value}</a>
                    ) : (
                      <div className="contact-info-value">{item.value}</div>
                    )}
                  </div>
                </div>
              ))}

              <div className="contact-note">
                <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.5rem' }}>Feature requests?</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--fg-muted)', lineHeight: 1.6 }}>
                  We love to hear ideas from our community. Let us know what features would make BlogSpace better for you!
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="contact-form-card fade-in-up delay-100">
              {sent ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(23,201,100,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: 'var(--success)' }}>
                    <Check size={24} />
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.5rem' }}>Message sent!</h3>
                  <p style={{ color: 'var(--fg-muted)', fontSize: '0.9375rem' }}>Thanks for reaching out. We'll get back to you within 24 hours.</p>
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: '1.5rem' }} onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2 style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: '1.5rem' }}>Send a message</h2>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Name</label>
                      <input name="name" className="form-input" placeholder="Jane Doe" value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Email</label>
                      <input name="email" type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input name="subject" className="form-input" placeholder="What is this about?" value={form.subject} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea name="message" className="form-input" rows={5} placeholder="Your message…" value={form.message} onChange={handleChange} required />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                    {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : <Send size={15} />}
                    {loading ? 'Sending…' : 'Send message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .contact-hero { padding: calc(var(--s-20) + 1rem) 0 var(--s-12); }
        .contact-eyebrow { font-size: 0.875rem; font-weight: 600; color: var(--accent); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 1rem; }
        .contact-title { font-size: clamp(2rem, 4vw, 2.75rem); font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 1.25rem; }
        .contact-desc { font-size: 1.0625rem; color: var(--fg-muted); line-height: 1.7; max-width: 480px; margin: 0 auto; }

        .contact-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 2.5rem; }
        @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } }

        .contact-info { display: flex; flex-direction: column; gap: 1rem; }
        .contact-info-item { display: flex; align-items: flex-start; gap: 0.875rem; padding: 1rem; border-radius: var(--r-md); border: 1px solid var(--border); background: var(--surface-1); }
        .contact-info-icon { color: var(--accent); flex-shrink: 0; margin-top: 2px; }
        .contact-info-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; color: var(--fg-subtle); margin-bottom: 0.2rem; }
        .contact-info-value { font-size: 0.9375rem; font-weight: 500; color: var(--fg-base); }
        .contact-link { color: var(--accent); text-decoration: none; }
        .contact-link:hover { text-decoration: underline; }

        .contact-note { padding: 1rem; border-radius: var(--r-md); background: rgba(0,112,243,0.05); border: 1px solid rgba(0,112,243,0.12); margin-top: 0.5rem; }

        .contact-form-card { background: var(--surface-1); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 2rem; }
      `}</style>
    </main>
  );
}
