import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../services/api';

const CommentSection = ({ post, onCommentUpdate }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submitting) return;

    setSubmitting(true);
    try {
      const { data } = await postAPI.addComment(post._id, { text: commentText });
      onCommentUpdate?.(data);
      setCommentText('');
    } catch (err) {
      console.error('Comment error:', err);
    }
    setSubmitting(false);
  };

  const handleDelete = async (commentId) => {
    try {
      const { data } = await postAPI.deleteComment(post._id, commentId);
      onCommentUpdate?.(data);
    } catch (err) {
      console.error('Delete comment error:', err);
    }
  };

  return (
    <div className="comments-section">
      {post.comments && post.comments.length > 0 && (
        <div className="comments-list">
          {post.comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <img
                src={comment.user?.avatar}
                alt={comment.user?.username}
                className="avatar avatar-xs"
              />
              <div className="comment-body">
                <Link to={`/profile/${comment.user?._id}`} className="comment-author">
                  {comment.user?.username}
                </Link>
                <p className="comment-text">{comment.text}</p>
                <div className="comment-meta">
                  <span className="comment-time">{formatTime(comment.createdAt)}</span>
                  {(user?._id === comment.user?._id ||
                    user?._id === (post.author?._id || post.author)) && (
                    <button
                      className="comment-delete-btn"
                      onClick={() => handleDelete(comment._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {user && (
        <form className="comment-form" onSubmit={handleSubmit}>
          <img src={user.avatar} alt={user.username} className="avatar avatar-xs" />
          <input
            type="text"
            className="comment-input"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            maxLength={500}
          />
          <button
            type="submit"
            className="comment-submit-btn"
            disabled={!commentText.trim() || submitting}
          >
            {submitting ? '...' : 'Post'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CommentSection;
