import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { postAPI } from '../services/api';

const CreatePostModal = ({ onClose, onPostCreated }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError('Post content cannot be empty');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const { data } = await postAPI.createPost({
        content: content.trim(),
        image: image.trim(),
      });
      onPostCreated?.(data);
      addToast('Post created successfully!', 'success');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    }
    setSubmitting(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop create-post-modal" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div style={{ padding: 'var(--space-xl)' }}>
          <div className="create-post-header">
            <h2 className="create-post-title">Create Post</h2>
            <button className="create-post-close" onClick={onClose}>✕</button>
          </div>

          <div className="create-post-user">
            <img src={user?.avatar} alt={user?.username} className="avatar avatar-md" />
            <span className="create-post-user-name">{user?.username}</span>
          </div>

          {error && <div className="auth-error" style={{ marginBottom: 'var(--space-md)' }}>{error}</div>}

          <textarea
            className="create-post-textarea"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={2000}
            autoFocus
          />

          {image && (
            <img
              src={image}
              alt="Preview"
              className="create-post-image-preview"
              onError={(e) => (e.target.style.display = 'none')}
            />
          )}

          <div className="create-post-image-input">
            <span>🖼️</span>
            <input
              type="text"
              placeholder="Image URL (optional)"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          <div className="create-post-footer">
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!content.trim() || submitting}
            >
              {submitting ? 'Posting...' : '🚀 Publish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
