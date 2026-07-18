import { useState, useEffect } from 'react';
import { postAPI, userAPI } from '../services/api';
import PostCard from '../components/PostCard';
import UserCard from '../components/UserCard';

const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const { data } = await postAPI.getExplore(pageNum);

      if (append) {
        setPosts((prev) => [...prev, ...data.posts]);
      } else {
        setPosts(data.posts);
      }
      setTotalPages(data.pages);
      setPage(pageNum);
    } catch (err) {
      console.error('Explore error:', err);
    }
    setLoading(false);
    setLoadingMore(false);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Search with common letters to get a broad result
      const results = await Promise.all([
        userAPI.searchUsers('a'),
        userAPI.searchUsers('e'),
        userAPI.searchUsers('i'),
      ]);

      // Merge and deduplicate
      const allUsers = results.flatMap((r) => r.data);
      const uniqueUsers = Array.from(
        new Map(allUsers.map((u) => [u._id, u])).values()
      );
      setUsers(uniqueUsers);
    } catch (err) {
      console.error('Users fetch error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'posts') {
      fetchPosts();
    } else {
      fetchUsers();
    }
  }, [activeTab]);

  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  const handlePostDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      fetchPosts(page + 1, true);
    }
  };

  return (
    <div className="page-container">
      <div className="explore-header">
        <h1 className="explore-title">Explore 🧭</h1>
      </div>

      <div className="explore-tabs">
        <button
          className={`explore-tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          📝 Posts
        </button>
        <button
          className={`explore-tab ${activeTab === 'people' ? 'active' : ''}`}
          onClick={() => setActiveTab('people')}
        >
          👥 People
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : activeTab === 'posts' ? (
        <>
          {posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🌍</div>
              <h3 className="empty-state-title">No posts yet</h3>
              <p className="empty-state-text">Be the first to share something!</p>
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onPostUpdate={handlePostUpdate}
                  onPostDelete={handlePostDelete}
                />
              ))}

              {page < totalPages && (
                <button
                  className="btn btn-secondary load-more-btn"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </button>
              )}
            </>
          )}
        </>
      ) : (
        <>
          {users.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👤</div>
              <h3 className="empty-state-title">No users found</h3>
            </div>
          ) : (
            <div className="explore-users-grid">
              {users.map((u) => (
                <UserCard key={u._id} userData={u} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExplorePage;
