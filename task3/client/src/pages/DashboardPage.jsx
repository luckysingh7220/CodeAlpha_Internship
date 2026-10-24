import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Plus } from 'lucide-react';

const DashboardPage = () => {
  const [projects, setProjects] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects', error);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/projects', { title, description });
      setProjects([...projects, data]);
      setIsCreating(false);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error creating project', error);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Your Projects</h1>
        <button className="btn btn-primary" onClick={() => setIsCreating(true)}>
          <Plus size={18} /> New Project
        </button>
      </div>

      {isCreating && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h3>Create New Project</h3>
          <form onSubmit={handleCreateProject}>
            <div className="form-group">
              <label className="input-label">Project Title</label>
              <input 
                type="text" 
                className="input-field" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="input-label">Description</label>
              <textarea 
                className="input-field" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows="3"
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary">Create</button>
              <button type="button" className="btn btn-secondary" onClick={() => setIsCreating(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {projects.map(project => (
          <div 
            key={project._id} 
            className="glass-panel" 
            style={{ padding: '1.5rem', cursor: 'pointer', transition: 'var(--transition)' }}
            onClick={() => navigate(`/board/${project._id}`)}
          >
            <h3>{project.title}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{project.description || 'No description provided.'}</p>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Members: {project.members?.length || 1}
            </div>
          </div>
        ))}
        {projects.length === 0 && !isCreating && (
          <div style={{ color: 'var(--text-muted)' }}>You don't have any projects yet. Create one to get started!</div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
