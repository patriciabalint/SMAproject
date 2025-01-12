const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Failed to connect to database:', err.message);
    return;
  }
  console.log('Connected to SQLite database');
});

// Crearea tabelului pentru utilizatori
db.run(
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )`,
  (err) => {
    if (err) {
      console.error('Failed to create users table:', err.message);
    } else {
      console.log('Users table created or already exists');
    }
  }
);

// Crearea tabelului pentru task-uri
db.run(
  `CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    startTime TEXT,
    endTime TEXT,
    category TEXT,
    completed INTEGER DEFAULT 0
  )`,
  (err) => {
    if (err) {
      console.error('Failed to create tasks table:', err.message);
    } else {
      console.log('Tasks table created or already exists');
    }
  }
);

db.close();
