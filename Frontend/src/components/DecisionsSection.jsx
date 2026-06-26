import { useState, useEffect } from 'react';
import { Gavel, Edit2, Check, RefreshCw, Plus, Trash2, X } from 'lucide-react';

export function DecisionsSection({ items, onUpdate, onRegenerate, isRegenerating }) {
  const [isEditing, setIsEditing] = useState(false);
  const [localItems, setLocalItems] = useState(items || []);

  useEffect(() => {
    setLocalItems(items || []);
  }, [items]);

  const handleSave = () => {
    onUpdate(localItems.filter(item => item.trim()));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalItems(items || []);
    setIsEditing(false);
  };

  const handleItemChange = (index, value) => {
    const next = [...localItems];
    next[index] = value;
    setLocalItems(next);
  };

  const handleAddItem = () => {
    setLocalItems([...localItems, '']);
  };

  const handleRemoveItem = (index) => {
    setLocalItems(localItems.filter((_, i) => i !== index));
  };

  return (
    <div className="summary-card" aria-labelledby="decisions-title">
      <div className="card-header">
        <div className="card-title-group">
          <Gavel className="card-icon icon-decisions" aria-hidden="true" size={20} />
          <h3 id="decisions-title">Key Decisions</h3>
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
                title="Edit decisions"
              >
                <Edit2 size={16} />
                <span>Edit</span>
              </button>
              <button 
                className="action-button regenerate-button" 
                onClick={onRegenerate} 
                disabled={isRegenerating}
                title="Regenerate decisions"
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
          <div className="edit-list">
            {localItems.map((item, idx) => (
              <div key={idx} className="edit-item-row">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleItemChange(idx, e.target.value)}
                  placeholder="Enter key decision..."
                  className="edit-input"
                />
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
              <span>Add Key Decision</span>
            </button>
          </div>
        ) : (
          <ul className="decisions-list">
            {items && items.length > 0 ? (
              items.map((item, idx) => (
                <li key={idx} className="decision-item">
                  <span className="bullet-gavel" />
                  <span className="item-text">{item}</span>
                </li>
              ))
            ) : (
              <p className="empty-section-text">No key decisions identified.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
