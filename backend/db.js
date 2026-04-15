const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3309,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const initializeDB = async () => {
  try {
    // Note: Connection pool already selects the correct database based on DB_NAME.
    // In production managed databases (like Aiven/AWS), you cannot 'CREATE DATABASE' due to restricted permissions.
    // If you are locally developing without a DB provisioned, this assumes you created it manually using the CLI first.
    
    // Create the notes table
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
