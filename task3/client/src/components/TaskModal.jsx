import React, { useState, useEffect } from 'react';
import { X, Send, Trash2 } from 'lucide-react';
import api from '../services/api';

const TaskModal = ({ task, onClose, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchComments();
  }, [task._id]);

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/comments/task/${task._id}`);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const { data } = await api.put(`/tasks/${task._id}`, { title, description });
      onUpdate(data);
    } catch (error) {
      console.error('Error updating task', error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${task._id}`);
      onDelete(task._id);
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const { data } = await api.post('/comments', { text: newComment, taskId: task._id });
      setComments([data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment', error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleUpdate}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-primary)',
              fontSize: '1.5rem',
              fontWeight: '600',
              outline: 'none',
              width: '80%'
            }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="modal-close" onClick={handleDelete} title="Delete Task">
              <Trash2 size={20} color="var(--danger)" />
            </button>
            <button className="modal-close" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Description</h4>
          <textarea 
            className="input-field" 
            rows="4" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleUpdate}
            placeholder="Add a more detailed description..."
          />
        </div>

        <div>
          <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Activity</h4>
          
          <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Write a comment..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              <Send size={18} />
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {comments.map(comment => (
              <div key={comment._id} style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  {comment.author?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem' }}>
                    <span style={{ fontWeight: '600', marginRight: '0.5rem' }}>{comment.author?.username}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{new Date(comment.createdAt).toLocaleString()}</span>
                  </div>
                  <div style={{ marginTop: '0.25rem' }}>{comment.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
