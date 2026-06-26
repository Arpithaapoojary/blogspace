import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, FileText, UserCircle, Users, UserCheck, UserPlus } from 'lucide-react';
import PostCard from '../components/PostCard';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';

export default function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'followers', 'following'

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const [profileRes, postsRes] = await Promise.all([
          api.get(`/users/${id}`),
          api.get(`/posts/user/${id}`),
        ]);
        setProfile(profileRes.data);
        setPosts(postsRes.data);
        setFollowersCount(profileRes.data.followers?.length || 0);

        // Check if current user is following this profile
        if (currentUser) {
          const following = profileRes.data.followers?.some(
            f => (typeof f === 'string' ? f : f._id) === (currentUser.id || currentUser._id)
          );
          setIsFollowing(following);
        }
      } catch {
        setError('User not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, currentUser]);

  const handleFollow = async () => {
    if (!currentUser) return;
    setFollowLoading(true);
    try {
      const { data } = await api.post(`/users/${id}/follow`);
      setIsFollowing(data.isFollowing);
      setFollowersCount(data.followers.length);
    } catch (err) {
      console.error(err);
    } finally {
      setFollowLoading(false);
    }
  };

  const isOwnProfile = currentUser && (currentUser.id === id || currentUser._id === id);

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
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <h1 className="profile-hero__name">{profile.name}</h1>
                {!isOwnProfile && currentUser && (
                  <button
                    className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                    onClick={handleFollow}
                    disabled={followLoading}
                    style={{ minWidth: 110 }}
                  >
                    {followLoading ? (
                      <span className="spinner" style={{ width: 14, height: 14 }} />
                    ) : isFollowing ? (
                      <><UserCheck size={14} /> Following</>
                    ) : (
                      <><UserPlus size={14} /> Follow</>
                    )}
                  </button>
                )}
              </div>

              <div className="profile-hero__meta">
                <span><FileText size={13} /> {posts.length} posts</span>
                <span>·</span>
                <span><Users size={13} /> {followersCount} followers</span>
                <span>·</span>
                <span><UserCheck size={13} /> {profile.following?.length || 0} following</span>
                <span>·</span>
                <span><Calendar size={13} /> Joined {new Date(profile.createdAt).getFullYear()}</span>
              </div>
              {profile.bio && <p className="profile-hero__bio">{profile.bio}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container section">
        <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
          <button 
            onClick={() => setActiveTab('posts')} 
            style={{ padding: '0.75rem 0', background: 'none', border: 'none', borderBottom: activeTab === 'posts' ? '2px solid var(--accent)' : '2px solid transparent', color: activeTab === 'posts' ? 'var(--fg-base)' : 'var(--fg-muted)', fontWeight: activeTab === 'posts' ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}
          >
            Posts
          </button>
          <button 
            onClick={() => setActiveTab('followers')} 
            style={{ padding: '0.75rem 0', background: 'none', border: 'none', borderBottom: activeTab === 'followers' ? '2px solid var(--accent)' : '2px solid transparent', color: activeTab === 'followers' ? 'var(--fg-base)' : 'var(--fg-muted)', fontWeight: activeTab === 'followers' ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}
          >
            Followers
          </button>
          <button 
            onClick={() => setActiveTab('following')} 
            style={{ padding: '0.75rem 0', background: 'none', border: 'none', borderBottom: activeTab === 'following' ? '2px solid var(--accent)' : '2px solid transparent', color: activeTab === 'following' ? 'var(--fg-base)' : 'var(--fg-muted)', fontWeight: activeTab === 'following' ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}
          >
            Following
          </button>
        </div>

        {activeTab === 'posts' && (
          <>
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
          </>
        )}

        {activeTab === 'followers' && (
          <div className="users-list fade-in-up" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {profile.followers?.length === 0 ? (
              <p style={{ color: 'var(--fg-muted)' }}>No followers yet.</p>
            ) : (
              profile.followers?.map(f => (
                <div key={f._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', background: 'var(--bg-subtle)' }}>
                  <Link to={`/profile/${f._id}`}>
                    <span className="avatar avatar-md">{f.avatar ? <img src={f.avatar} alt={f.name} /> : getInitials(f.name)}</span>
                  </Link>
                  <div style={{ minWidth: 0 }}>
                    <Link to={`/profile/${f._id}`} style={{ fontWeight: 600, color: 'var(--fg-base)', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</Link>
                    {f.bio && <p style={{ fontSize: '0.875rem', color: 'var(--fg-muted)', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.bio}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'following' && (
          <div className="users-list fade-in-up" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {profile.following?.length === 0 ? (
              <p style={{ color: 'var(--fg-muted)' }}>Not following anyone yet.</p>
            ) : (
              profile.following?.map(f => (
                <div key={f._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', background: 'var(--bg-subtle)' }}>
                  <Link to={`/profile/${f._id}`}>
                    <span className="avatar avatar-md">{f.avatar ? <img src={f.avatar} alt={f.name} /> : getInitials(f.name)}</span>
                  </Link>
                  <div style={{ minWidth: 0 }}>
                    <Link to={`/profile/${f._id}`} style={{ fontWeight: 600, color: 'var(--fg-base)', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</Link>
                    {f.bio && <p style={{ fontSize: '0.875rem', color: 'var(--fg-muted)', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.bio}</p>}
                  </div>
                </div>
              ))
            )}
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
        .profile-hero__meta { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--fg-muted); margin-bottom: 0.75rem; flex-wrap: wrap; }
        .profile-hero__meta span { display: flex; align-items: center; gap: 0.3rem; }
        .profile-hero__bio { font-size: 1rem; color: var(--fg-muted); line-height: 1.6; max-width: 480px; }
        @media (max-width: 600px) { .profile-hero__inner { flex-direction: column; align-items: flex-start; gap: 1rem; } }
      `}</style>
    </main>
  );
}
