import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, TrendingUp, Sparkles, PenSquare, ArrowRight, X, SearchX } from 'lucide-react';
import PostCard from '../components/PostCard';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const POPULAR_TAGS = ['javascript', 'react', 'webdev', 'python', 'css', 'nodejs', 'typescript', 'ai'];

export default function Home() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('latest');

  const fetchPosts = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const params = { page: pageNum, limit: 9, sort };
      if (search.trim()) params.search = search.trim();

      const { data } = await api.get('/posts', { params });
      setPosts(prev => append ? [...prev, ...data.posts] : data.posts);
      setTotal(data.total);
      setTotalPages(data.pages);
    } catch {
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [search, sort]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchPosts(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search, sort]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchPosts(next, true);
  };

  const clearSearch = () => {
    setSearch('');
    setSearchParams({});
  };

  return (
    <main className="page-wrapper">
      {/* ── HERO ── */}
      {!search && (
        <section className="home-hero">
          <div className="container">
            <div className="home-hero__inner fade-in-up">
              <div className="home-hero__badge">
                <Sparkles size={13} />
                <span>Where ideas come to life</span>
              </div>
              <h1 className="home-hero__title">
                Read, Write &amp;<br />
                <span className="gradient-text">Share Knowledge</span>
              </h1>
              <p className="home-hero__desc">
                Discover in-depth articles, tutorials, and stories from a community of passionate writers. 
                Join us and share your expertise with the world.
              </p>
              <div className="home-hero__actions">
                {user ? (
                  <Link to="/create" className="btn btn-primary btn-lg">
                    <PenSquare size={17} /> Write a post
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-primary btn-lg">
                      Start writing <ArrowRight size={17} />
                    </Link>
                    <Link to="/login" className="btn btn-secondary btn-lg">Sign in</Link>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="home-hero__gradient" />
        </section>
      )}

      {/* ── FEED ── */}
      <section className="section">
        <div className="container">
          {/* Search & Controls */}
          <div className="home-controls fade-in-up">
            <div className="home-search-wrap">
              <Search size={15} className="home-search-icon" />
              <input
                className="home-search"
                placeholder="Search posts…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="home-search-clear" onClick={clearSearch}><X size={14} /></button>
              )}
            </div>
            <div className="home-tabs">
              {['latest', 'likes', 'views'].map(s => (
                <button
                  key={s}
                  className={`home-tab${sort === s ? ' active' : ''}`}
                  onClick={() => setSort(s)}
                >
                  {s === 'latest' ? 'Latest' : s === 'likes' ? 'Top liked' : 'Most viewed'}
                </button>
              ))}
            </div>
          </div>

          {/* Tags row */}
          {!search && (
            <div className="home-tags fade-in-up delay-100">
              <TrendingUp size={14} className="text-muted" />
              <span className="text-sm text-muted" style={{ flexShrink: 0 }}>Trending:</span>
              {POPULAR_TAGS.map(tag => (
                <Link key={tag} to={`/tag/${tag}`} className="tag-badge">#{tag}</Link>
              ))}
            </div>
          )}

          {/* Results count when searching */}
          {search && !loading && (
            <div className="home-search-result fade-in-up">
              <span>{total} result{total !== 1 ? 's' : ''} for <strong>"{search}"</strong></span>
              <button className="btn btn-ghost btn-xs" onClick={clearSearch}>Clear</button>
            </div>
          )}

          {/* Posts Grid */}
          {loading ? (
            <div className="loading-container"><div className="spinner spinner-lg" /><span>Loading posts…</span></div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><SearchX size={32} /></div>
              <h3>{search ? 'No results found' : 'No posts yet'}</h3>
              <p>{search ? `Try a different search term.` : 'Be the first to publish something!'}</p>
              {user && <Link to="/create" className="btn btn-primary btn-sm"><PenSquare size={14} /> Write the first post</Link>}
            </div>
          ) : (
            <>
              <div className="posts-grid fade-in-up delay-200">
                {posts.map(post => <PostCard key={post._id} post={post} />)}
              </div>
              {page < totalPages && (
                <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                  <button className="btn btn-secondary btn-lg" onClick={handleLoadMore} disabled={loadingMore}>
                    {loadingMore ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Loading…</> : 'Load more posts'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <style>{`
        /* Hero */
        .home-hero {
          position: relative;
          padding: calc(var(--s-20) + 1rem) 0 var(--s-16);
          overflow: hidden;
          border-bottom: 1px solid var(--border);
        }
        .home-hero__gradient {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(59,130,246,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .home-hero__inner { position: relative; text-align: center; max-width: 640px; margin: 0 auto; }
        .home-hero__badge {
          display: inline-flex; align-items: center; gap: 0.375rem;
          padding: 0.25rem 0.75rem; border-radius: var(--r-full);
          border: 1px solid var(--border);
          font-size: 0.75rem; font-weight: 500; color: var(--fg-muted);
          margin-bottom: 1.5rem; background: var(--bg-subtle);
        }
        .home-hero__title {
          font-size: clamp(2.25rem, 5vw, 3.5rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.05;
          margin-bottom: 1.25rem;
          color: var(--fg-base);
        }
        .home-hero__desc {
          font-size: 1.0625rem;
          color: var(--fg-muted);
          line-height: 1.7;
          margin-bottom: 2rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }
        .home-hero__actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }

        /* Controls */
        .home-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }
        .home-search-wrap {
          position: relative;
          flex: 1;
          min-width: 200px;
          max-width: 360px;
        }
        .home-search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%; transform: translateY(-50%);
          color: var(--fg-subtle);
          pointer-events: none;
        }
        .home-search {
          width: 100%;
          background: var(--bg-base);
          border: 1px solid var(--border);
          border-radius: var(--r-md);
          padding: 0.5rem 2.25rem 0.5rem 2.25rem;
          color: var(--fg-base);
          font-size: 0.875rem;
          font-family: var(--font-sans);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .home-search:focus { border-color: var(--border-focus); box-shadow: var(--shadow-focus); }
        .home-search::placeholder { color: var(--fg-subtle); }
        .home-search-clear {
          position: absolute; right: 0.625rem; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: var(--fg-subtle);
          padding: 0.25rem; display: flex;
        }
        .home-search-clear:hover { color: var(--fg-base); }

        .home-tabs { display: flex; gap: 0.25rem; background: var(--bg-subtle); border-radius: var(--r-md); padding: 0.25rem; border: 1px solid var(--border); }
        .home-tab {
          padding: 0.35rem 0.75rem; border-radius: var(--r-sm);
          border: none; background: none; cursor: pointer;
          font-size: 0.8125rem; font-weight: 500;
          color: var(--fg-muted); font-family: var(--font-sans);
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .home-tab.active { background: var(--bg-base); color: var(--fg-base); box-shadow: var(--shadow-xs); }
        .home-tab:hover:not(.active) { color: var(--fg-base); }

        /* Tags */
        .home-tags { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; }

        /* Search result info */
        .home-search-result {
          display: flex; align-items: center; gap: 0.75rem;
          font-size: 0.9375rem; color: var(--fg-muted);
          margin-bottom: 1.5rem;
        }
      `}</style>
    </main>
  );
}
