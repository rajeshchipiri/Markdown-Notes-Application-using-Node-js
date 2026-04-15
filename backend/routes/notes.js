const express = require('express');
const router = express.Router();
const { queryDB } = require('../db');

// GET all notes (allows search query param)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let sql = 'SELECT * FROM notes';
    let params = [];

    if (search) {
      sql += ' WHERE title LIKE ? OR content LIKE ?';
      const searchTerm = `%${search}%`;
      params = [searchTerm, searchTerm];
    }
    
    sql += ' ORDER BY updated_at DESC';

    const [rows] = await queryDB(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// GET single note by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await queryDB('SELECT * FROM notes WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching note:', err);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// POST new note
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    const sql = 'INSERT INTO notes (title, content) VALUES (?, ?)';
    const [result] = await queryDB(sql, [title, content || '']);
    
    res.status(201).json({ 
        message: 'Note created successfully',
        noteId: result.insertId 
    });
  } catch (err) {
    console.error('Error creating note:', err);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// PUT update note
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    if (!title && content === undefined) {
        return res.status(400).json({ error: 'Nothing to update' });
    }

    const sql = 'UPDATE notes SET title = COALESCE(?, title), content = COALESCE(?, content) WHERE id = ?';
    const [result] = await queryDB(sql, [title, content, id]);
    
    if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Note not found or no changes made' });
    }
    
    res.json({ message: 'Note updated successfully' });
  } catch (err) {
    console.error('Error updating note:', err);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// DELETE note
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const sql = 'DELETE FROM notes WHERE id = ?';
    const [result] = await queryDB(sql, [id]);
    
    if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error('Error deleting note:', err);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

module.exports = router;
