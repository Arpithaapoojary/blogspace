import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Heart, Bookmark, Share2, Edit, Trash2, Clock, Calendar, Eye, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import TagBadge from '../components/TagBadge';
import CommentSection from '../components/CommentSection';
import { formatDate, getReadingTime, getInitials } from '../utils/helpers';

export default function SinglePost() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get(`/posts/${id}`)
      .then(({ data }) => {
        setPost(data);
        setLikeCount(data.likes?.length || 0);
        if (user) setLiked(data.likes?.includes(user.id));
      })
      .catch(() => setError('Post not found.'))
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this post permanently?')) return;
    setDeleting(true);
    try {
      await api.delete(`/posts/${id}`);
      navigate('/dashboard');
    } catch {
      setError('Failed to delete post.');
      setDeleting(false);
    }
  };

  const handleLike = async () => {
    if (!user) return navigate('/login');
    try {
      const { data } = await api.post(`/posts/${id}/like`);
      setLiked(data.isLiked);
      setLikeCount(data.likes.length);
    } catch {}
  };

  const handleBookmark = async () => {
    if (!user) return navigate('/login');
    try {
      const { data } = await api.post(`/posts/${id}/bookmark`);
      setBookmarked(data.isBookmarked);
    } catch {}
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="loading-container" style={{ minHeight: '60vh' }}><div className="spinner spinner-lg" /><span>Loading post…</span></div>;

  if (error) return (
    <div className="page-wrapper">
      <div className="container">
        <div className="empty-state" style={{ minHeight: '60vh' }}>
          <div className="empty-state-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AlertCircle size={32} /></div>
          <h3>Post not found</h3>
          <p>{error}</p>
          <Link to="/" className="btn btn-primary btn-sm">Back to Home</Link>
        </div>
      </div>
    </div>
  );

  const isAuthor = user && (user.id === post.author?._id || user._id === post.author?._id);

  return (
    <main className="page-wrapper">
      {/* Cover */}
      {post.coverImage && (
        <div className="sp-cover">
          <img src={post.coverImage} alt={post.title} />
          <div className="sp-cover__fade" />
        </div>
      )}

      <div className="container">
        <div className="sp-layout">
          {/* ── Article ── */}
          <article className="sp-article fade-in-up">
            {/* Back link */}
            <Link to="/" className="sp-back">
              <ArrowLeft size={15} /> All posts
            </Link>

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="sp-tags">
                {post.tags.map(t => <TagBadge key={t} tag={t} />)}
              </div>
            )}

            {/* Title */}
            <h1 className="sp-title">{post.title}</h1>

            {/* Author + meta row */}
            <div className="sp-meta">
              <Link to={`/profile/${post.author?._id}`} className="sp-author">
                <span className="avatar avatar-md">
                  {post.author?.avatar ? <img src={post.author.avatar} alt={post.author.name} /> : getInitials(post.author?.name)}
                </span>
                <div>
                  <div className="sp-author-name">{post.author?.name}</div>
                  <div className="sp-author-sub">
                    <span><Calendar size={11} /> {formatDate(post.createdAt)}</span>
                    <span>·</span>
                    <span><Clock size={11} /> {getReadingTime(post.content)}</span>
                    {post.views > 0 && <><span>·</span><span><Eye size={11} /> {post.views} views</span></>}
                  </div>
                </div>
              </Link>

              {isAuthor && (
                <div className="sp-author-actions">
                  <Link to={`/edit/${post._id}`} className="btn btn-secondary btn-sm">
                    <Edit size={13} /> Edit
                  </Link>
                  <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}>
                    {deleting ? <span className="spinner" style={{ width: 13, height: 13 }} /> : <Trash2 size={13} />}
                    Delete
                  </button>
                </div>
              )}
            </div>

            <div className="divider" style={{ margin: '1.5rem 0' }} />

            {/* Content */}
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </div>

            {/* Actions bar */}
            <div className="sp-actions-bar">
              <button className={`sp-action-btn${liked ? ' active-like' : ''}`} onClick={handleLike}>
                <Heart size={17} fill={liked ? 'currentColor' : 'none'} />
                <span>{likeCount}</span>
              </button>
              <button className={`sp-action-btn${bookmarked ? ' active-bookmark' : ''}`} onClick={handleBookmark}>
                <Bookmark size={17} fill={bookmarked ? 'currentColor' : 'none'} />
              </button>
              <button className="sp-action-btn" onClick={handleShare} title="Copy link">
                <Share2 size={17} />
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>
            </div>

            <div className="divider" style={{ margin: '1.5rem 0' }} />

            {/* Author card */}
            <div className="sp-author-card">
              <Link to={`/profile/${post.author?._id}`}>
                <span className="avatar avatar-lg">
                  {post.author?.avatar ? <img src={post.author.avatar} alt={post.author.name} /> : getInitials(post.author?.name)}
                </span>
              </Link>
              <div className="sp-author-card-body">
                <p className="sp-author-card-label">Written by</p>
                <Link to={`/profile/${post.author?._id}`} className="sp-author-card-name">
                  {post.author?.name}
                </Link>
                {post.author?.bio && <p className="sp-author-card-bio">{post.author.bio}</p>}
              </div>
            </div>

            {/* Comments */}
            <CommentSection postId={id} />
          </article>
        </div>
      </div>

      <style>{`
        .sp-cover {
          position: relative;
          height: clamp(220px, 36vw, 440px);
          overflow: hidden;
        }
        .sp-cover img { width: 100%; height: 100%; object-fit: cover; }
        .sp-cover__fade {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, transparent 30%, var(--bg-base));
        }

        .sp-layout { display: flex; gap: 2.5rem; }

        .sp-article {
          max-width: 720px;
          margin: 0 auto;
          padding: 2.5rem 0 5rem;
          min-width: 0;
          flex: 1;
        }

        .sp-back {
          display: inline-flex; align-items: center; gap: 0.375rem;
          font-size: 0.875rem; color: var(--fg-muted); text-decoration: none;
          margin-bottom: 1.5rem;
          transition: color 0.15s;
        }
        .sp-back:hover { color: var(--fg-base); }

        .sp-tags { display: flex; flex-wrap: wrap; gap: 0.375rem; margin-bottom: 1.25rem; }

        .sp-title {
          font-size: clamp(1.75rem, 4vw, 2.625rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.15;
          margin-bottom: 1.5rem;
          color: var(--fg-base);
        }

        .sp-meta { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
        .sp-author { display: flex; align-items: center; gap: 0.75rem; text-decoration: none; }
        .sp-author-name { font-size: 0.9375rem; font-weight: 600; color: var(--fg-base); transition: color 0.15s; }
        .sp-author:hover .sp-author-name { color: var(--accent); }
        .sp-author-sub { display: flex; align-items: center; gap: 0.375rem; font-size: 0.75rem; color: var(--fg-subtle); margin-top: 0.25rem; flex-wrap: wrap; }
        .sp-author-sub span { display: flex; align-items: center; gap: 0.2rem; }
        .sp-author-actions { display: flex; gap: 0.5rem; }

        .sp-actions-bar {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 1rem 0;
        }
        .sp-action-btn {
          display: inline-flex; align-items: center; gap: 0.375rem;
          padding: 0.5rem 0.875rem;
          border: 1px solid var(--border); border-radius: var(--r-md);
          background: none; cursor: pointer; color: var(--fg-muted);
          font-size: 0.875rem; font-weight: 500; font-family: var(--font-sans);
          transition: all 0.15s;
        }
        .sp-action-btn:hover { border-color: var(--border-hover); color: var(--fg-base); background: var(--bg-subtle); }
        .sp-action-btn.active-like { color: #f31260; border-color: rgba(243,18,96,0.3); background: rgba(243,18,96,0.06); }
        .sp-action-btn.active-bookmark { color: var(--accent); border-color: rgba(0,112,243,0.3); background: rgba(0,112,243,0.06); }

        .sp-author-card {
          display: flex; align-items: flex-start; gap: 1rem;
          padding: 1.25rem; border: 1px solid var(--border);
          border-radius: var(--r-lg); background: var(--bg-subtle);
          margin: 0.5rem 0 2rem;
        }
        .sp-author-card-body { min-width: 0; }
        .sp-author-card-label { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--fg-subtle); font-weight: 600; margin-bottom: 0.25rem; }
        .sp-author-card-name { font-size: 1rem; font-weight: 700; color: var(--fg-base); text-decoration: none; display: block; transition: color 0.15s; }
        .sp-author-card-name:hover { color: var(--accent); }
        .sp-author-card-bio { font-size: 0.875rem; color: var(--fg-muted); margin-top: 0.375rem; line-height: 1.6; }
      `}</style>
    </main>
  );
}
