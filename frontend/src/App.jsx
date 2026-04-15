import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

import Sidebar from './components/Sidebar';
import Editor from './components/Editor';

const API_URL = '/api/notes';

function App() {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Fetch Notes
  const fetchNotes = useCallback(async (query = '') => {
    try {
      const res = await axios.get(`${API_URL}${query ? `?search=${query}` : ''}`);
      setNotes(res.data);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    }
  }, []);

  // Debounce search so we don't spam API
  const debouncedSearch = useCallback(
    debounce((q) => fetchNotes(q), 300),
    [fetchNotes]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch]);

  const handleCreateNote = async () => {
    try {
      const res = await axios.post(API_URL, {
        title: 'New Note',
        content: ''
      });
      const newNote = {
        id: res.data.noteId,
        title: 'New Note',
        content: '',
        updated_at: new Date().toISOString()
      };
      setNotes([newNote, ...notes]);
      setActiveNoteId(newNote.id);
    } catch (err) {
      console.error("Failed to create note:", err);
    }
  };

  const handleUpdateNote = async (id, title, content) => {
    try {
      await axios.put(`${API_URL}/${id}`, { title, content });
      setNotes(notes.map(note => 
        note.id === id 
          ? { ...note, title, content, updated_at: new Date().toISOString() } 
          : note
      ).sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at))); // push to top
    } catch (err) {
      console.error("Failed to update note:", err);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        setNotes(notes.filter(note => note.id !== id));
        if (activeNoteId === id) {
            setActiveNoteId(null);
        }
    } catch (err) {
        console.error("Failed to delete note:", err);
    }
  };

  const activeNote = notes.find(n => n.id === activeNoteId);

  return (
    <div className="app-container">
      <Sidebar 
        notes={notes}
        activeNoteId={activeNoteId}
        onSelectNote={setActiveNoteId}
        onCreateNote={handleCreateNote}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <Editor
        activeNote={activeNote}
        onUpdateNote={handleUpdateNote}
        onDeleteNote={handleDeleteNote}
        theme={theme}
      />
    </div>
  );
}

export default App;
