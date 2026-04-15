import React from 'react';
import { Search, Plus, Moon, Sun, FileText } from 'lucide-react';

const Sidebar = ({ 
    notes, 
    activeNoteId, 
    onSelectNote, 
    onCreateNote, 
    searchQuery, 
    setSearchQuery,
    theme,
    toggleTheme
}) => {

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1><FileText className="sidebar-icon" size={20} /> Notes</h1>
        <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="search-container">
        <Search className="search-icon" size={16} />
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search notes..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <button className="new-note-btn" onClick={onCreateNote}>
        <Plus size={18} /> New Note
      </button>

      <div className="notes-list">
        {notes.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem 1rem', fontSize: '0.85rem' }}>
            {searchQuery ? "No matching notes found." : "Create your first note."}
          </div>
        ) : (
          notes.map(note => (
            <div 
              key={note.id} 
              className={`note-item ${activeNoteId === note.id ? 'active' : ''}`}
              onClick={() => onSelectNote(note.id)}
            >
              <div className="note-title">{note.title || 'Untitled Note'}</div>
              <div className="note-preview-text">
                {note.content ? note.content.substring(0, 50) + (note.content.length > 50 ? '...' : '') : 'No additional text'}
              </div>
              <div className="note-date">
                {formatDate(note.updated_at || note.updatedAt || new Date())}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
