import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Send, MessageSquare, Trash2, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { formatDate, getInitials } from '../utils/helpers';

export default function CommentSection({ postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    api.get(`/comments/${postId}`)
      .then(r => setComments(r.data))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true); setError('');
    try {
      const { data } = await api.post(`/comments/${postId}`, { body });
      setComments(prev => [data, ...prev]);
      setBody('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch {
      setError('Failed to delete comment.');
    }
  };

  return (
    <section className="comments">
      <div className="comments__header">
        <MessageSquare size={18} />
        <h3 className="comments__title">
          {comments.length} Comment{comments.length !== 1 ? 's' : ''}
        </h3>
      </div>

      {/* Compose */}
      {user ? (
        <form className="comments__compose" onSubmit={handleSubmit}>
          <span className="avatar avatar-sm" style={{ flexShrink: 0, alignSelf: 'flex-start', marginTop: '0.5rem' }}>
            {getInitials(user.name)}
          </span>
          <div className="comments__compose-right">
            <textarea
              ref={textareaRef}
              className="form-input comments__textarea"
              placeholder="Share your thoughts…"
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={3}
            />
            {error && <p className="form-error">{error}</p>}
            <div className="comments__compose-actions">
              <button className="btn btn-primary btn-sm" type="submit" disabled={loading || !body.trim()}>
                {loading ? <span className="spinner" style={{ width: 14, height: 14 }} /> : <Send size={13} />}
                Post
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="comments__cta">
          <Link to="/login" className="btn btn-primary btn-sm">Sign in to comment</Link>
        </div>
      )}

      {/* List */}
      {fetching ? (
        <div className="loading-container" style={{ padding: '2rem' }}>
          <div className="spinner spinner-lg" />
        </div>
      ) : (
        <div className="comments__list">
          {comments.map(c => (
            <div key={c._id} className="comment fade-in-up">
              <Link to={`/profile/${c.author?._id}`}>
                <span className="avatar avatar-sm">{getInitials(c.author?.name || '?')}</span>
              </Link>
              <div className="comment__body">
                <div className="comment__meta">
                  <Link to={`/profile/${c.author?._id}`} className="comment__author">{c.author?.name}</Link>
                  <span className="comment__date">{formatDate(c.createdAt)}</span>
                </div>
                <p className="comment__text">{c.body}</p>
              </div>
              {user && user.id === c.author?._id && (
                <button className="btn btn-ghost btn-icon btn-xs comment__delete" onClick={() => handleDelete(c._id)}>
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}

          {!fetching && comments.length === 0 && (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div className="empty-state-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageSquare size={32} /></div>
              <h3>No comments yet</h3>
              <p>Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      )}

      <style>{`
        .comments { margin-top: 2.5rem; }
        .comments__header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; color: var(--fg-base); }
        .comments__title { font-size: 1.0625rem; font-weight: 700; }

        .comments__compose { display: flex; gap: 0.75rem; margin-bottom: 2rem; }
        .comments__compose-right { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
        .comments__textarea { resize: none; min-height: 80px; }
        .comments__compose-actions { display: flex; justify-content: flex-end; }

        .comments__cta { margin-bottom: 1.5rem; }

        .comments__list { display: flex; flex-direction: column; gap: 1rem; }

        .comment {
          display: flex; gap: 0.75rem; align-items: flex-start;
          padding: 1rem;
          border-radius: var(--r-md);
          border: 1px solid var(--border);
          background: var(--surface-1);
          transition: border-color 0.15s;
        }
        .comment:hover { border-color: var(--border-hover); }
        .comment__body { flex: 1; min-width: 0; }
        .comment__meta { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.375rem; flex-wrap: wrap; }
        .comment__author { font-size: 0.875rem; font-weight: 600; color: var(--fg-base); text-decoration: none; }
        .comment__author:hover { color: var(--accent); }
        .comment__date { font-size: 0.75rem; color: var(--fg-subtle); }
        .comment__text { font-size: 0.9375rem; color: var(--fg-muted); line-height: 1.6; }
        .comment__delete { color: var(--fg-subtle) !important; opacity: 0; transition: opacity 0.15s, color 0.15s !important; }
        .comment:hover .comment__delete { opacity: 1; }
        .comment__delete:hover { color: var(--danger) !important; }
      `}</style>
    </section>
  );
}
