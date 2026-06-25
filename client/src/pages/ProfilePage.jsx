import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, FileText, UserCircle } from 'lucide-react';
import PostCard from '../components/PostCard';
import api from '../utils/api';
import { getInitials } from '../utils/helpers';

export default function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, postsRes] = await Promise.all([
          api.get(`/users/${id}`),
          api.get(`/posts/user/${id}`),
        ]);
        setProfile(profileRes.data);
        setPosts(postsRes.data);
      } catch {
        setError('User not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <div className="loading-container" style={{ minHeight: '60vh' }}><div className="spinner spinner-lg" /></div>;

  if (error) return (
    <div className="page-wrapper">
      <div className="container">
        <div className="empty-state" style={{ minHeight: '50vh' }}>
          <div className="empty-state-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><UserCircle size={32} /></div>
          <h3>{error}</h3>
          <Link to="/" className="btn btn-secondary btn-sm">Back to Home</Link>
        </div>
      </div>
    </div>
  );

  return (
    <main className="page-wrapper">
      {/* Profile header */}
      <div className="profile-hero">
        <div className="container">
          <div className="profile-hero__inner fade-in-up">
            <span className="avatar avatar-2xl">
              {profile.avatar ? <img src={profile.avatar} alt={profile.name} /> : getInitials(profile.name)}
            </span>
            <div className="profile-hero__info">
              <h1 className="profile-hero__name">{profile.name}</h1>
              <div className="profile-hero__meta">
                <span><FileText size={13} /> {posts.length} posts</span>
                <span>·</span>
                <span><Calendar size={13} /> Joined {new Date(profile.createdAt).getFullYear()}</span>
              </div>
              {profile.bio && <p className="profile-hero__bio">{profile.bio}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="container section">
        <h2 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '1.5rem' }}>
          Posts by {profile.name.split(' ')[0]}
        </h2>

        {posts.length === 0 ? (
          <div className="empty-state" style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', background: 'var(--bg-subtle)' }}>
            <div className="empty-state-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={32} /></div>
            <h3>No posts yet</h3>
            <p>This user hasn't published anything yet.</p>
          </div>
        ) : (
          <div className="posts-grid fade-in-up">
            {posts.map(post => <PostCard key={post._id} post={post} />)}
          </div>
        )}
      </div>

      <style>{`
        .profile-hero {
          padding: var(--s-12) 0 var(--s-10);
          border-bottom: 1px solid var(--border);
          background: var(--bg-subtle);
        }
        .profile-hero__inner { display: flex; align-items: center; gap: 2rem; }
        .profile-hero__info { min-width: 0; }
        .profile-hero__name { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.5rem; }
        .profile-hero__meta { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--fg-muted); margin-bottom: 0.75rem; }
        .profile-hero__meta span { display: flex; align-items: center; gap: 0.3rem; }
        .profile-hero__bio { font-size: 1rem; color: var(--fg-muted); line-height: 1.6; max-width: 480px; }
        @media (max-width: 600px) { .profile-hero__inner { flex-direction: column; align-items: flex-start; gap: 1rem; } }
      `}</style>
    </main>
  );
}
