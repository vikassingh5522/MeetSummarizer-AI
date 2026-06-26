import { useState, useEffect } from 'react';
import { Calendar, User, ClipboardList, Edit2, Check, RefreshCw, Plus, Trash2, X } from 'lucide-react';

export function ActionItemsSection({ items, onUpdate, onRegenerate, isRegenerating }) {
  const [isEditing, setIsEditing] = useState(false);
  const [localItems, setLocalItems] = useState(items || []);

  useEffect(() => {
    setLocalItems(items || []);
  }, [items]);

  const handleSave = () => {
    onUpdate(localItems.filter(item => item.task.trim()));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalItems(items || []);
    setIsEditing(false);
  };

  const handleItemChange = (index, field, value) => {
    const next = [...localItems];
    next[index] = {
      ...next[index],
      [field]: value === '' ? null : value
    };
    setLocalItems(next);
  };

  const handleAddItem = () => {
    setLocalItems([...localItems, { owner: null, task: '', due_date: null }]);
  };

  const handleRemoveItem = (index) => {
    setLocalItems(localItems.filter((_, i) => i !== index));
  };

  return (
    <div className="summary-card" aria-labelledby="actions-title">
      <div className="card-header">
        <div className="card-title-group">
          <ClipboardList className="card-icon icon-actions" aria-hidden="true" size={20} />
          <h3 id="actions-title">Action Items</h3>
        </div>
        <div className="card-actions">
          {isEditing ? (
            <>
              <button 
                className="action-button success-button" 
                onClick={handleSave} 
                title="Save changes"
              >
                <Check size={16} />
                <span>Save</span>
              </button>
              <button 
                className="action-button cancel-button" 
                onClick={handleCancel} 
                title="Cancel editing"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
            </>
          ) : (
            <>
              <button 
                className="action-button edit-button" 
                onClick={() => setIsEditing(true)} 
                title="Edit action items"
              >
                <Edit2 size={16} />
                <span>Edit</span>
              </button>
              <button 
                className="action-button regenerate-button" 
                onClick={onRegenerate} 
                disabled={isRegenerating}
                title="Regenerate action items"
              >
                <RefreshCw size={16} className={isRegenerating ? 'spin' : ''} />
                <span>{isRegenerating ? 'Regenerating...' : 'Regenerate'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="card-body">
        {isEditing ? (
          <div className="edit-list action-edit-list">
            {localItems.map((item, idx) => (
              <div key={idx} className="edit-action-row">
                <div className="action-row-fields">
                  <div className="field-group">
                    <User size={14} className="field-icon" />
                    <input
                      type="text"
                      value={item.owner || ''}
                      onChange={(e) => handleItemChange(idx, 'owner', e.target.value)}
                      placeholder="Assignee (e.g. John)"
                      className="edit-input action-owner-input"
                    />
                  </div>
                  <div className="field-group task-field">
                    <ClipboardList size={14} className="field-icon" />
                    <input
                      type="text"
                      value={item.task || ''}
                      onChange={(e) => handleItemChange(idx, 'task', e.target.value)}
                      placeholder="Task description"
                      className="edit-input action-task-input"
                    />
                  </div>
                  <div className="field-group">
                    <Calendar size={14} className="field-icon" />
                    <input
                      type="text"
                      value={item.due_date || ''}
                      onChange={(e) => handleItemChange(idx, 'due_date', e.target.value)}
                      placeholder="Due Date (e.g. Friday)"
                      className="edit-input action-due-input"
                    />
                  </div>
                </div>
                <button 
                  className="delete-item-button" 
                  onClick={() => handleRemoveItem(idx)}
                  title="Delete item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button className="add-item-button" onClick={handleAddItem}>
              <Plus size={16} />
              <span>Add Action Item</span>
            </button>
          </div>
        ) : (
          <div className="action-items-list">
            {items && items.length > 0 ? (
              items.map((item, idx) => (
                <div key={idx} className="action-item-card">
                  <div className="action-item-main">
                    <span className="action-check-bullet" />
                    <span className="action-task-text">
                      <span className="task-prefix">Task:</span> {item.task}
                    </span>
                  </div>
                  
                  <div className="action-item-meta">
                    <span className="action-owner" title="Assignee">
                      <User size={14} />
                      <span><strong>Owner:</strong> {item.owner || 'Not mentioned'}</span>
                    </span>
                    <span className="action-due" title="Due Date">
                      <Calendar size={14} />
                      <span><strong>Due:</strong> {item.due_date || 'Not mentioned'}</span>
                    </span>
                    <span className="action-status pending">
                      <span className="status-dot" />
                      <span>Pending</span>
                    </span>
                  </div>

                  {item.evidence && (
                    <div className="action-item-evidence" title="Verbatim line from transcript">
                      <span className="evidence-tag">Evidence:</span>
                      <span className="evidence-text">"{item.evidence}"</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="empty-section-text">No action items identified.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
