const mysql = require('mysql2/promise');

// Create a connection pool configured per user's request
const pool = mysql.createPool({
  host: 'localhost',
  port: 3309,
  user: 'root',
  password: 'root',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const initializeDB = async () => {
  try {
    // 1. Ensure database exists
    await pool.query('CREATE DATABASE IF NOT EXISTS `notes_db`');
    
    // 2. Select the database
    await pool.query('USE `notes_db`');

    // 3. Create the notes table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await pool.query(createTableQuery);

    console.log('✅ Database and tables initialized successfully.');
  } catch (err) {
    console.error('❌ Error initializing database:', err.message);
  }
};

// Start initialization
initializeDB();

// A helper wrapper to ensure queries run against the right DB
const queryDB = async (sql, params) => {
    // We enforce USE notes_db here in case parallel queries fire immediately on startup 
    // before the global USE finishes, though connection pool generally handles it per connection.
    // For safer scoping, we just qualify the table name in our actual routes, e.g. notes_db.notes
    return pool.execute(sql, params);
};

module.exports = {
  pool,
  queryDB
};
