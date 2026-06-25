import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { Tag, ImageIcon, Type, Folder, Save, ArrowLeft } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function EditPost() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: '', content: '', coverImage: '', category: '', tagsInput: '', status: 'published' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/posts/${id}`)
      .then(({ data }) => {
        const authorId = data.author._id || data.author.id;
        const userId = user._id || user.id;
        if (authorId !== userId) { navigate('/dashboard'); return; }
        setForm({
          title: data.title,
          content: data.content,
          coverImage: data.coverImage || '',
          category: data.category || '',
          tagsInput: (data.tags || []).join(', '),
          status: data.status || 'published',
        });
      })
      .catch(() => setError('Post not found or access denied.'))
      .finally(() => setLoading(false));
  }, [id, user._id, user.id]);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Title is required.');
    if (!form.content.trim()) return setError('Content is required.');
    setSaving(true); setError('');
    try {
      await api.put(`/posts/${id}`, {
        title: form.title.trim(),
        content: form.content,
        coverImage: form.coverImage.trim(),
        category: form.category.trim(),
        tags: form.tagsInput.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
        status: form.status,
      });
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post.');
    } finally {
      setSaving(false);
    }
  };

  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length;

  if (loading) return <div className="loading-container" style={{ minHeight: '60vh' }}><div className="spinner spinner-lg" /><span>Loading post…</span></div>;

  return (
    <main className="page-wrapper">
      <div className="container-sm" style={{ maxWidth: 840 }}>
        <div className="editor-header fade-in-up">
          <div>
            <Link to={`/posts/${id}`} className="sp-back" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--fg-muted)', marginBottom: '0.5rem', textDecoration: 'none' }}>
              <ArrowLeft size={14} /> Back to post
            </Link>
            <h1 className="editor-title">Edit post</h1>
            <p style={{ color: 'var(--fg-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {wordCount} words · ~{Math.ceil(wordCount / 200) || 0} min read
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select name="status" value={form.status} onChange={handleChange} className="form-input" style={{ width: 'auto', height: 36, padding: '0 0.75rem', fontSize: '0.875rem' }}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <button className="btn btn-secondary" onClick={() => navigate(`/posts/${id}`)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
              {saving ? <span className="spinner" style={{ width: 15, height: 15 }} /> : <Save size={15} />}
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>

        {error && <div className="alert alert-error fade-in">{error}</div>}

        <form onSubmit={handleSubmit} className="editor-form fade-in-up delay-100">
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              <Type size={13} style={{ display: 'inline', marginRight: 4 }} /> Title
            </label>
            <input id="title" name="title" className="form-input editor-title-input" placeholder="Your post title…" value={form.title} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="coverImage">
              <ImageIcon size={13} style={{ display: 'inline', marginRight: 4 }} /> Cover image URL
            </label>
            <input id="coverImage" name="coverImage" type="url" className="form-input" placeholder="https://…" value={form.coverImage} onChange={handleChange} />
            {form.coverImage && (
              <div className="editor-cover-preview">
                <img src={form.coverImage} alt="Cover preview" onError={e => { e.target.style.display = 'none'; }} />
              </div>
            )}
          </div>

          <div className="editor-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" htmlFor="category">
                <Folder size={13} style={{ display: 'inline', marginRight: 4 }} /> Category
              </label>
              <input id="category" name="category" className="form-input" placeholder="e.g. Technology" value={form.category} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" htmlFor="tagsInput">
                <Tag size={13} style={{ display: 'inline', marginRight: 4 }} /> Tags (comma separated)
              </label>
              <input id="tagsInput" name="tagsInput" className="form-input" placeholder="react, javascript" value={form.tagsInput} onChange={handleChange} />
            </div>
          </div>

          {form.tagsInput && (
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginTop: '-0.75rem', marginBottom: '1rem' }}>
              {form.tagsInput.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                <span key={t} className="tag-badge">#{t}</span>
              ))}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Content (Markdown)</label>
            <div data-color-mode="auto">
              <MDEditor value={form.content} onChange={val => setForm(prev => ({ ...prev, content: val || '' }))} height={520} preview="live" />
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
        .editor-cover-preview { margin-top: 0.5rem; border-radius: var(--r-lg); overflow: hidden; max-height: 200px; border: 1px solid var(--border); }
        .editor-cover-preview img { width: 100%; height: 100%; object-fit: cover; }
      `}</style>
    </main>
  );
}
