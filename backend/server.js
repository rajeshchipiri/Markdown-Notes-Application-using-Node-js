require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Make sure DB initializes, though we don't strictly need to await it here 
// for the server to start accepting connections (routes use pool.promise)
require('./db');

const notesRouter = require('./routes/notes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Routes
app.use('/api/notes', notesRouter);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
