import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

const TaskCard = ({ task, index, onClick }) => {
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          className="task-card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.8 : 1,
            transform: snapshot.isDragging ? `${provided.draggableProps.style.transform} scale(1.05)` : provided.draggableProps.style.transform,
          }}
          onClick={onClick}
        >
          <div className="task-card-title">{task.title}</div>
          {task.description && (
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {task.description}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
