const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const db = new sqlite3.Database('./database.db');

// GET /tasks - Obține toate task-urile
router.get('/', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    } else {
      res.json(rows);
    }
  });
});

// POST /tasks - Adaugă un task nou
router.post('/', (req, res) => {
  const { title, startTime, endTime, category, completed } = req.body;
  db.run(
    `INSERT INTO tasks (title, startTime, endTime, category, completed) VALUES (?, ?, ?, ?, ?)`,
    [title, startTime, endTime, category, completed ? 1 : 0],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to create task' });
      } else {
        res.status(201).json({ id: this.lastID });
      }
    }
  );
});

// PUT /tasks/:id - Editează un task existent
router.put('/:id', (req, res) => {
  const { title, startTime, endTime, category, completed } = req.body;
  const { id } = req.params;

  db.run(
    `UPDATE tasks SET title = ?, startTime = ?, endTime = ?, category = ?, completed = ? WHERE id = ?`,
    [title, startTime, endTime, category, completed ? 1 : 0, id],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to update task' });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'Task not found' });
      } else {
        res.json({ message: 'Task updated successfully' });
      }
    }
  );
});

// DELETE /tasks/:id - Șterge un task
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM tasks WHERE id = ?`, [id], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to delete task' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      res.json({ message: 'Task deleted successfully' });
    }
  });
});

module.exports = router;
