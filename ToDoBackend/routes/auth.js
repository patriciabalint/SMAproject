const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const db = new sqlite3.Database('./database.db');
const SECRET_KEY = 'your_secret_key'; // Schimbă cu o cheie secretă mai puternică

// POST /register - Creează un utilizator nou
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Hash parola
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    `INSERT INTO users (email, password) VALUES (?, ?)`,
    [email, hashedPassword],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to register user' });
      } else {
        res.status(201).json({ message: 'User registered successfully' });
      }
    }
  );
});

// POST /login - Autentificare utilizator
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to fetch user' });
    } else if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      // Compară parola hashată
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid credentials' });
      } else {
        // Generează un token JWT
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
          expiresIn: '1h',
        });
        res.json({ token });
      }
    }
  });
});

module.exports = router;
