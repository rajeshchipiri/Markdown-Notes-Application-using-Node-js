# Markdown Notes Application

A full-stack, responsive Markdown Notes application built with React, Node.js (Express), and MySQL. 

**Features:**
- Real-time Split Screen Markdown Editor
- Debounced Auto-Save
- Dark Mode / Light Mode styling
- Search Functionality
- Full CRUD Operations with MySQL Database Persistence
- Clean, Premium UI with Glassmorphic Elements

## Prerequisites
- Node.js (v18+)
- MySQL Server

## Setup Instructions

### 1. Database Setup
Ensure you have MySQL running locally on port `3309`.
The application automatically creates the `notes_db` database and `notes` table on startup using the provided configuration. If you need to manually configure it:
```sql
CREATE DATABASE IF NOT EXISTS notes_db;
USE notes_db;
CREATE TABLE IF NOT EXISTS notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. Backend Setup
Navigate to the `backend` directory, install dependencies, and start the server:

```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5000
```

> The database connection is configured in `backend/db.js`. If your MySQL configuration differs from `root`/`root` on `localhost:3309`, please update the pool connection block in `db.js`.

### 3. Frontend Setup
In a new terminal window, navigate to the `frontend` directory, install dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev
# React app runs on http://localhost:5173
```

## Tech Stack
- **Frontend**: React (Vite), CSS Variables for Theming, Lucide-React (Icons), React-Markdown (Preview), React-Syntax-Highlighter
- **Backend**: Node.js, Express, MySQL2 (Connection Pooling)
- **Database**: MySQL

## Core Assignment Highlights
- **Engineering Fundamentals**: Proper Debouncing for save functions via `lodash.debounce`.
- **API Design**: Clean RESTful routes.
- **Bonus Features Delivered**: Search, Dark Mode, Responsive Layout, Debounced Auto-Save.
