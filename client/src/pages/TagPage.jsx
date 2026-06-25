import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tag } from 'lucide-react';
import PostCard from '../components/PostCard';
import api from '../utils/api';

export default function TagPage() {
  const { tag } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true); else setLoadingMore(true);
      const { data } = await api.get(`/posts/tag/${tag}`, { params: { page: pageNum, limit: 9 } });
      setPosts(prev => append ? [...prev, ...data.posts] : data.posts);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch {}
    finally {
      setLoading(false); setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPosts([]); setPage(1); fetchPosts(1);
  }, [tag]);

  const handleLoadMore = () => {
    const next = page + 1; setPage(next); fetchPosts(next, true);
  };

  return (
    <main className="page-wrapper">
      <div className="container">
        <div className="page-header fade-in-up">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <span className="tag-badge" style={{ fontSize: '1.25rem', padding: '0.5rem 1.25rem' }}>#{tag}</span>
          </div>
          <h1>Posts tagged <span className="gradient-text">#{tag}</span></h1>
          {!loading && <p>{total} post{total !== 1 ? 's' : ''} found</p>}
        </div>

        {loading ? (
          <div className="loading-container"><div className="spinner spinner-lg" /></div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Tag size={32} /></div>
            <h3>No posts found</h3>
            <p>There are no posts with this tag yet.</p>
          </div>
        ) : (
          <>
            <div className="posts-grid fade-in-up">
              {posts.map(post => <PostCard key={post._id} post={post} />)}
            </div>
            {page < totalPages && (
              <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                <button className="btn btn-secondary btn-lg" onClick={handleLoadMore} disabled={loadingMore}>
                  {loadingMore ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Loading…</> : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
