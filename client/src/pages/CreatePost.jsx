import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { Tag, ImageIcon, Type, Folder, PenSquare, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', coverImage: '', tags: '', category: '', status: 'published' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Title is required.');
    if (!form.content.trim()) return setError('Content is required.');
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/posts', {
        title: form.title.trim(),
        content: form.content,
        coverImage: form.coverImage.trim() || undefined,
        tags: form.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
        category: form.category.trim() || undefined,
        status: form.status,
      });
      navigate(`/posts/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <main className="page-wrapper">
      <div className="container-sm" style={{ maxWidth: 840 }}>
        <div className="editor-header fade-in-up">
          <div>
            <h1 className="editor-title">New post</h1>
            <p style={{ color: 'var(--fg-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {wordCount} words · ~{Math.ceil(wordCount / 200) || 0} min read
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="form-input"
              style={{ width: 'auto', height: 36, padding: '0 0.75rem', fontSize: '0.875rem' }}
            >
              <option value="published">Publish</option>
              <option value="draft">Save as draft</option>
            </select>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 15, height: 15 }} /> : <Save size={15} />}
              {form.status === 'draft' ? 'Save draft' : 'Publish'}
            </button>
          </div>
        </div>

        {error && <div className="alert alert-error fade-in">{error}</div>}

        <form onSubmit={handleSubmit} className="editor-form fade-in-up delay-100">
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              <Type size={13} style={{ display: 'inline', marginRight: 4 }} /> Title
            </label>
            <input
              id="title"
              name="title"
              className="form-input editor-title-input"
              placeholder="An interesting post title…"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          {/* Cover image */}
          <div className="form-group">
            <label className="form-label" htmlFor="coverImage">
              <ImageIcon size={13} style={{ display: 'inline', marginRight: 4 }} /> Cover image URL <span style={{ color: 'var(--fg-subtle)', fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              id="coverImage"
              name="coverImage"
              type="url"
              className="form-input"
              placeholder="https://images.unsplash.com/…"
              value={form.coverImage}
              onChange={handleChange}
            />
            {form.coverImage && (
              <div className="editor-cover-preview">
                <img src={form.coverImage} alt="Cover preview" onError={e => { e.target.style.display = 'none'; }} />
              </div>
            )}
          </div>

          {/* 2-col row: category + tags */}
          <div className="editor-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" htmlFor="category">
                <Folder size={13} style={{ display: 'inline', marginRight: 4 }} /> Category <span style={{ color: 'var(--fg-subtle)', fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                id="category"
                name="category"
                className="form-input"
                placeholder="e.g. Technology"
                value={form.category}
                onChange={handleChange}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" htmlFor="tags">
                <Tag size={13} style={{ display: 'inline', marginRight: 4 }} /> Tags <span style={{ color: 'var(--fg-subtle)', fontWeight: 400 }}>(comma separated)</span>
              </label>
              <input
                id="tags"
                name="tags"
                className="form-input"
                placeholder="react, javascript, webdev"
                value={form.tags}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Tag preview */}
          {form.tags && (
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginTop: '-0.75rem', marginBottom: '1rem' }}>
              {form.tags.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                <span key={t} className="tag-badge">#{t}</span>
              ))}
            </div>
          )}

          {/* Markdown editor */}
          <div className="form-group">
            <label className="form-label">
              <PenSquare size={13} style={{ display: 'inline', marginRight: 4 }} /> Content
            </label>
            <div data-color-mode="auto">
              <MDEditor
                value={form.content}
                onChange={v => setForm(f => ({ ...f, content: v || '' }))}
                height={520}
                preview="live"
              />
            </div>
          </div>
        </form>
      </div>

      <style>{`
        .editor-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; padding: 2.5rem 0 1.5rem; flex-wrap: wrap; }
        .editor-title { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em; }
        .editor-form { padding-bottom: 4rem; }
        .editor-title-input { font-size: 1.0625rem !important; font-weight: 600 !important; }
        .editor-row { display: flex; gap: 1rem; }
        @media (max-width: 600px) { .editor-row { flex-direction: column; } }
        .editor-cover-preview {
          margin-top: 0.5rem;
          border-radius: var(--r-lg);
          overflow: hidden;
          max-height: 200px;
          border: 1px solid var(--border);
        }
        .editor-cover-preview img { width: 100%; height: 100%; object-fit: cover; }
      `}</style>
    </main>
  );
}
