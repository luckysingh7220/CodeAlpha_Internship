import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { postAPI } from '../services/api';
import CommentSection from './CommentSection';

const PostCard = ({ post, onPostUpdate, onPostDelete }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [liked, setLiked] = useState(post.likes?.some((l) => (l._id || l) === user?._id));
  const [likeCount, setLikeCount] = useState(post.likeCount || post.likes?.length || 0);
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [currentPost, setCurrentPost] = useState(post);
  const [isLiking, setIsLiking] = useState(false);
  const [showHeartPop, setShowHeartPop] = useState(false);

  const isAuthor = user?._id === (post.author?._id || post.author);

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleLike = async (e) => {
    if (e) e.stopPropagation();
    if (isLiking || !user) return;
    setIsLiking(true);
    try {
      const { data } = await postAPI.likePost(post._id);
      setLiked(data.isLiked);
      setLikeCount(data.likeCount);
      setCurrentPost(prev => ({ ...prev, likes: data.likes }));
      onPostUpdate?.(data);
      if (data.isLiked) {
        addToast('Liked post!', 'success');
      }
    } catch (err) {
      console.error('Like error:', err);
      addToast('Failed to like post', 'error');
    }
    setIsLiking(false);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (!liked) {
      handleLike(e);
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 1000);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await postAPI.deletePost(post._id);
      onPostDelete?.(post._id);
    } catch (err) {
      console.error('Delete error:', err);
    }
    setShowMenu(false);
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    try {
      const { data } = await postAPI.updatePost(post._id, { content: editContent });
      setCurrentPost(data);
      setIsEditing(false);
      onPostUpdate?.(data);
    } catch (err) {
      console.error('Edit error:', err);
    }
  };

  const handleCommentUpdate = (updatedPost) => {
    setCurrentPost(updatedPost);
    onPostUpdate?.(updatedPost);
  };

  return (
    <article className="post-card">
      <div className="post-header">
        <Link to={`/profile/${post.author?._id}`} className="post-author">
          <img
            src={post.author?.avatar}
            alt={post.author?.username}
            className="avatar avatar-md"
          />
          <div className="post-author-info">
            <span className="post-author-name">{post.author?.username}</span>
            <span className="post-timestamp">{formatTime(post.createdAt)}</span>
          </div>
        </Link>

        {isAuthor && (
          <div style={{ position: 'relative' }}>
            <button
              className="post-menu-btn"
              onClick={() => setShowMenu(!showMenu)}
            >
              ⋯
            </button>
            {showMenu && (
              <div className="post-menu-dropdown">
                <button
                  className="post-menu-item"
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                >
                  ✏️ Edit
                </button>
                <button className="post-menu-item danger" onClick={handleDelete}>
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <textarea
            className="form-input form-textarea"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            style={{ width: '100%', marginBottom: 'var(--space-sm)' }}
          />
          <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleEdit}>
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="post-content">{currentPost.content}</p>
      )}

      {currentPost.image && (
        <div className="post-image-container" onDoubleClick={handleDoubleClick}>
          <img src={currentPost.image} alt="Post content" className="post-image" />
          {showHeartPop && (
            <div className="heart-pop-animation">
              ❤️
            </div>
          )}
        </div>
      )}

      <div className="post-actions">
        <button
          className={`post-action-btn ${liked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <span className="post-action-icon">{liked ? '❤️' : '🤍'}</span>
          <span className="post-action-count">{likeCount}</span>
        </button>

        <button
          className="post-action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <span className="post-action-icon">💬</span>
          <span className="post-action-count">
            {currentPost.commentCount || currentPost.comments?.length || 0}
          </span>
        </button>

        <Link to={`/post/${post._id}`} className="post-action-btn">
          <span className="post-action-icon">🔗</span>
          <span className="post-action-count">View</span>
        </Link>
      </div>

      {showComments && (
        <CommentSection
          post={currentPost}
          onCommentUpdate={handleCommentUpdate}
        />
      )}
    </article>
  );
};

export default PostCard;
