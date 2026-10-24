import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Plus, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

const BoardPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for modals
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [activeColumnId, setActiveColumnId] = useState('');

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${projectId}`),
        api.get(`/tasks/project/${projectId}`)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Error fetching project data', error);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Deep copy columns
    const newColumns = JSON.parse(JSON.stringify(project.columns));
    
    const sourceColIndex = newColumns.findIndex(c => c.id === source.droppableId);
    const destColIndex = newColumns.findIndex(c => c.id === destination.droppableId);
    
    // Remove from source
    newColumns[sourceColIndex].taskIds.splice(source.index, 1);
    // Add to destination
    newColumns[destColIndex].taskIds.splice(destination.index, 0, draggableId);

    // Optimistic UI update
    setProject({ ...project, columns: newColumns });

    // Update task in state if column changed
    if (source.droppableId !== destination.droppableId) {
      setTasks(tasks.map(t => t._id === draggableId ? { ...t, columnId: destination.droppableId } : t));
      // Call API to update task column
      try {
        await api.put(`/tasks/${draggableId}`, { columnId: destination.droppableId });
      } catch (err) {
        console.error('Error moving task', err);
      }
    }

    // Call API to update project columns
    try {
      await api.put(`/projects/${projectId}`, { columns: newColumns });
    } catch (err) {
      console.error('Error saving columns', err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    try {
      const { data } = await api.post('/tasks', {
        title: newTaskTitle,
        projectId,
        columnId: activeColumnId
      });
      
      setTasks([...tasks, data]);
      
      // Update local project columns
      const newColumns = [...project.columns];
      const colIndex = newColumns.findIndex(c => c.id === activeColumnId);
      newColumns[colIndex].taskIds.push(data._id);
      setProject({ ...project, columns: newColumns });
      
      setIsCreatingTask(false);
      setNewTaskTitle('');
    } catch (error) {
      console.error('Error creating task', error);
    }
  };

  if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading board...</div>;
  if (!project) return <div className="container" style={{ padding: '2rem' }}>Project not found</div>;

  return (
    <div className="board-container">
      <div className="board-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')} style={{ padding: '0.5rem' }}>
            <ArrowLeft size={18} />
          </button>
          <h2 style={{ margin: 0 }}>{project.title}</h2>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="columns-container">
          {project.columns.map(column => {
            // Get tasks for this column in correct order
            const columnTasks = column.taskIds.map(taskId => tasks.find(t => t._id === taskId)).filter(Boolean);
            
            return (
              <div key={column.id} className="column glass-panel">
                <div className="column-header">
                  {column.title}
                  <span style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    padding: '0.1rem 0.5rem', 
                    borderRadius: '1rem',
                    fontSize: '0.875rem'
                  }}>
                    {columnTasks.length}
                  </span>
                </div>
                
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div 
                      className="task-list"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        background: snapshot.isDraggingOver ? 'rgba(255, 255, 255, 0.05)' : 'var(--bg-secondary)',
                      }}
                    >
                      {columnTasks.map((task, index) => (
                        <TaskCard 
                          key={task._id} 
                          task={task} 
                          index={index} 
                          onClick={() => setSelectedTask(task)} 
                        />
                      ))}
                      {provided.placeholder}
                      
                      {isCreatingTask && activeColumnId === column.id ? (
                        <form onSubmit={handleCreateTask} style={{ marginTop: '0.5rem' }}>
                          <input 
                            type="text" 
                            className="input-field" 
                            autoFocus
                            placeholder="What needs to be done?" 
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            onBlur={() => setIsCreatingTask(false)}
                          />
                        </form>
                      ) : (
                        <button 
                          className="btn btn-secondary" 
                          style={{ border: 'none', justifyContent: 'flex-start', color: 'var(--text-muted)' }}
                          onClick={() => {
                            setActiveColumnId(column.id);
                            setIsCreatingTask(true);
                          }}
                        >
                          <Plus size={16} /> Add a card
                        </button>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {selectedTask && (
        <TaskModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)}
          onUpdate={(updatedTask) => {
            setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
            setSelectedTask(updatedTask);
          }}
          onDelete={(taskId) => {
            setTasks(tasks.filter(t => t._id !== taskId));
            
            // Remove from column
            const newColumns = [...project.columns];
            const colIndex = newColumns.findIndex(c => c.id === selectedTask.columnId);
            newColumns[colIndex].taskIds = newColumns[colIndex].taskIds.filter(id => id !== taskId);
            setProject({ ...project, columns: newColumns });
            
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
};

export default BoardPage;
