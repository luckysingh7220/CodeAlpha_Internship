import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postAPI } from '../services/api';
import PostCard from '../components/PostCard';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const { data } = await postAPI.getPost(id);
        setPost(data);
      } catch (err) {
        console.error('Post fetch error:', err);
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  const handlePostUpdate = (updatedPost) => {
    setPost(updatedPost);
  };

  const handlePostDelete = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">😢</div>
        <h3 className="empty-state-title">Post not found</h3>
        <p className="empty-state-text">This post may have been deleted.</p>
      </div>
    );
  }

  return (
    <div className="post-detail-page">
      <button className="post-detail-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <PostCard
        post={post}
        onPostUpdate={handlePostUpdate}
        onPostDelete={handlePostDelete}
      />
    </div>
  );
};

export default PostDetailPage;
