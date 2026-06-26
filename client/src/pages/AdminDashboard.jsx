import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Trash2, Users, FileText } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'users') {
          const { data } = await api.get('/users');
          setUsers(data);
        } else if (activeTab === 'posts') {
          const { data } = await api.get('/posts?limit=50&status=published'); // Can add query for all
          setPosts(data.posts);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter(p => p._id !== id));
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('WARNING: This will permanently delete the user and ALL of their posts, comments, and data. Proceed?')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <main className="page-wrapper">
      <div className="container-sm fade-in-up">
        <h1 className="page-title">Admin Dashboard</h1>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={16} /> Manage Users
          </button>
          <button 
            className={`btn ${activeTab === 'posts' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('posts')}
          >
            <FileText size={16} /> Manage Posts
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <span className="spinner" style={{ width: 30, height: 30, borderWidth: 3 }} />
          </div>
        ) : activeTab === 'posts' ? (
          <div className="card">
            <h3 style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>All Posts</h3>
            <div style={{ padding: '1rem 1.5rem' }}>
              {posts.map(post => (
                <div key={post._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <strong>{post.title}</strong>
                    <div style={{ fontSize: '0.875rem', color: 'var(--fg-muted)' }}>By {post.author?.name}</div>
                  </div>
                  <button onClick={() => handleDeletePost(post._id)} className="btn" style={{ color: 'var(--error)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card">
            <h3 style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>All Users</h3>
            <div style={{ padding: '1rem 1.5rem' }}>
              {users.map(u => (
                <div key={u._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=random`} alt={u.name} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                    <div>
                      <strong>{u.name}</strong>
                      <div style={{ fontSize: '0.875rem', color: 'var(--fg-muted)' }}>{u.email} &bull; {u.role}</div>
                    </div>
                  </div>
                  {u.role !== 'admin' && (
                    <button className="btn" style={{ color: 'var(--error)' }} onClick={() => handleDeleteUser(u._id)} title="Delete User">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
