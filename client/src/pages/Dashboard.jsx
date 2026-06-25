import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PenSquare, BarChart2, MessageCircle, Heart, Eye, Edit, Trash2, FileText, Clock, FileEdit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { formatDate, getReadingTime } from '../utils/helpers';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [tab, setTab] = useState('published');

  useEffect(() => {
    api.get(`/posts/user/${user._id || user.id}`)
      .then(({ data }) => setPosts(data))
      .catch(() => setError('Failed to load your posts.'))
      .finally(() => setLoading(false));
  }, [user._id, user.id]);

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post permanently?')) return;
    setDeletingId(postId);
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(prev => prev.filter(p => p._id !== postId));
    } catch {
      setError('Failed to delete post.');
    } finally {
      setDeletingId(null);
    }
  };

  const published = posts.filter(p => p.status !== 'draft');
  const drafts = posts.filter(p => p.status === 'draft');
  const displayPosts = tab === 'published' ? published : drafts;

  const totalLikes = posts.reduce((s, p) => s + (p.likes?.length || 0), 0);
  const totalViews = posts.reduce((s, p) => s + (p.views || 0), 0);
  const totalComments = posts.reduce((s, p) => s + (p.commentsCount || 0), 0);

  const stats = [
    { icon: <FileText size={18} />, label: 'Posts', value: posts.length, color: 'var(--accent)' },
    { icon: <Eye size={18} />, label: 'Views', value: totalViews, color: '#a855f7' },
    { icon: <Heart size={18} />, label: 'Likes', value: totalLikes, color: '#f31260' },
    { icon: <MessageCircle size={18} />, label: 'Comments', value: totalComments, color: '#17c964' },
  ];

  return (
    <main className="page-wrapper">
      <div className="container">
        <div className="db-header fade-in-up">
          <div>
            <h1 className="db-title">Dashboard</h1>
            <p style={{ color: 'var(--fg-muted)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
              Welcome back, <strong>{user.name?.split(' ')[0]}</strong>
            </p>
          </div>
          <Link to="/create" className="btn btn-primary">
            <PenSquare size={15} /> New post
          </Link>
        </div>

        {/* Stats cards */}
        <div className="db-stats fade-in-up delay-100">
          {stats.map(s => (
            <div key={s.label} className="db-stat-card">
              <div className="db-stat-icon" style={{ '--ic': s.color }}>{s.icon}</div>
              <div className="db-stat-val">{s.value}</div>
              <div className="db-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Tabs */}
        <div className="db-tabs fade-in-up delay-200">
          <button className={`db-tab${tab === 'published' ? ' active' : ''}`} onClick={() => setTab('published')}>
            Published <span className="db-tab-count">{published.length}</span>
          </button>
          <button className={`db-tab${tab === 'drafts' ? ' active' : ''}`} onClick={() => setTab('drafts')}>
            Drafts <span className="db-tab-count">{drafts.length}</span>
          </button>
        </div>

        {loading ? (
          <div className="loading-container"><div className="spinner spinner-lg" /><span>Loading posts…</span></div>
        ) : displayPosts.length === 0 ? (
          <div className="empty-state" style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)' }}>
            <div className="empty-state-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {tab === 'published' ? <FileText size={32} /> : <FileEdit size={32} />}
            </div>
            <h3>No {tab === 'published' ? 'published posts' : 'drafts'}</h3>
            <p>{tab === 'published' ? 'Start writing and share your ideas!' : 'Saved drafts will appear here.'}</p>
            <Link to="/create" className="btn btn-primary btn-sm">
              <PenSquare size={14} /> Write a post
            </Link>
          </div>
        ) : (
          <div className="db-table-wrap fade-in-up delay-300">
            <table className="db-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Read time</th>
                  <th>Likes</th>
                  <th>Views</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayPosts.map(post => (
                  <tr key={post._id}>
                    <td className="db-table__title-cell">
                      <Link to={`/posts/${post._id}`} className="db-table__title">{post.title}</Link>
                      {post.tags?.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                          {post.tags.slice(0, 2).map(t => (
                            <span key={t} className="tag-badge" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>#{t}</span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="db-table__meta">{formatDate(post.createdAt)}</td>
                    <td className="db-table__meta"><Clock size={12} /> {getReadingTime(post.content)}</td>
                    <td className="db-table__meta"><Heart size={12} /> {post.likes?.length || 0}</td>
                    <td className="db-table__meta"><Eye size={12} /> {post.views || 0}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.375rem' }}>
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => navigate(`/edit/${post._id}`)} title="Edit">
                          <Edit size={14} />
                        </button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(post._id)} disabled={deletingId === post._id} title="Delete">
                          {deletingId === post._id ? <span className="spinner" style={{ width: 12, height: 12 }} /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .db-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; padding: 2.5rem 0 2rem; flex-wrap: wrap; }
        .db-title { font-size: clamp(1.75rem, 3.5vw, 2.25rem); font-weight: 800; letter-spacing: -0.03em; }

        .db-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
        .db-stat-card { 
          background: var(--surface-1); border: 1px solid var(--border);
          border-radius: var(--r-lg); padding: 1.25rem;
          display: flex; flex-direction: column; gap: 0.5rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .db-stat-card:hover { border-color: var(--border-hover); box-shadow: var(--shadow-sm); }
        .db-stat-icon { color: var(--ic); width: 36px; height: 36px; border-radius: var(--r-md); display: flex; align-items: center; justify-content: center; background: color-mix(in srgb, var(--ic) 12%, transparent); }
        .db-stat-val { font-size: 1.75rem; font-weight: 800; letter-spacing: -0.03em; color: var(--fg-base); }
        .db-stat-label { font-size: 0.8125rem; color: var(--fg-muted); font-weight: 500; }

        .db-tabs { display: flex; gap: 0.25rem; background: var(--bg-subtle); border-radius: var(--r-md); padding: 0.25rem; border: 1px solid var(--border); width: fit-content; margin-bottom: 1.25rem; }
        .db-tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.4rem 1rem; border-radius: var(--r-sm); border: none; background: none; cursor: pointer; font-size: 0.875rem; font-weight: 500; color: var(--fg-muted); font-family: var(--font-sans); transition: background 0.15s, color 0.15s; }
        .db-tab.active { background: var(--bg-base); color: var(--fg-base); box-shadow: var(--shadow-xs); }
        .db-tab-count { background: var(--bg-muted); border-radius: var(--r-full); padding: 0 6px; font-size: 0.75rem; }

        .db-table-wrap { overflow-x: auto; border: 1px solid var(--border); border-radius: var(--r-lg); margin-bottom: 3rem; }
        .db-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        .db-table thead tr { background: var(--bg-subtle); border-bottom: 1px solid var(--border); }
        .db-table th { padding: 0.75rem 1rem; text-align: left; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--fg-subtle); white-space: nowrap; }
        .db-table td { padding: 0.875rem 1rem; border-bottom: 1px solid var(--border); vertical-align: middle; }
        .db-table tbody tr:last-child td { border-bottom: none; }
        .db-table tbody tr { transition: background 0.1s; }
        .db-table tbody tr:hover { background: var(--bg-subtle); }
        .db-table__title-cell { max-width: 320px; }
        .db-table__title { font-weight: 600; color: var(--fg-base); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; transition: color 0.15s; text-decoration: none; }
        .db-table__title:hover { color: var(--accent); }
        .db-table__meta { color: var(--fg-muted); white-space: nowrap; font-size: 0.8125rem; display: flex; align-items: center; gap: 0.25rem; }

        @media (max-width: 768px) { .db-stats { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { .db-stats { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}
