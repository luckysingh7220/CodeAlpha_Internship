import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../services/api';
import PostCard from '../components/PostCard';

const FeedPage = ({ onCreatePost }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchFeed = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const { data } = await postAPI.getFeed(pageNum);

      if (append) {
        setPosts((prev) => [...prev, ...data.posts]);
      } else {
        setPosts(data.posts);
      }
      setTotalPages(data.pages);
      setPage(pageNum);
    } catch (err) {
      console.error('Feed error:', err);
    }
    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchFeed();
  }, []);

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
      fetchFeed(page + 1, true);
    }
  };

  return (
    <div className="page-container">
      <div className="feed-header">
        <h1 className="feed-title">Your Feed ✨</h1>
        <p className="feed-subtitle">See what people you follow are sharing</p>
      </div>

      <div className="feed-create-prompt" onClick={onCreatePost}>
        <img src={user?.avatar} alt={user?.username} className="avatar avatar-md" />
        <span className="feed-create-placeholder">What's on your mind, {user?.username}?</span>
        <span className="btn btn-primary btn-sm">Post</span>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3 className="empty-state-title">Your feed is empty</h3>
          <p className="empty-state-text">
            Follow some people to see their posts here, or explore what's trending!
          </p>
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
    </div>
  );
};

export default FeedPage;
