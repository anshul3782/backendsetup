const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// SQLite database connection
const dbPath = process.env.DB_PATH || path.join(__dirname, 'identifier.sqlite'); // Use relative path for Render
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database:', dbPath);
  }
});

// Initialize database table if it doesn't exist
const initDatabase = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS live_steps (
      phone_number TEXT PRIMARY KEY,
      steps INTEGER,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.run(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('live_steps table ready');
    }
  });
};

// Initialize the database
initDatabase();

// GET endpoint - Get all live_steps with optional phone_number filter
app.get('/api/live-steps', (req, res) => {
  const { phone_number } = req.query;
  
  if (phone_number) {
    // If phone_number is provided, return only the steps number
    const query = 'SELECT steps FROM live_steps WHERE phone_number = ?';
    const params = [phone_number];
    
    db.get(query, params, (err, row) => {
      if (err) {
        console.error('Error fetching data for', phone_number, ':', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      
      console.log(`📱 Live steps for ${phone_number}: ${row ? row.steps : 'No data'}`);
      
      res.send(row ? row.steps.toString() : '0');
    });
  } else {
    // If no phone_number filter, return all records
    const query = 'SELECT * FROM live_steps ORDER BY timestamp DESC';
    
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error('Error fetching data:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      
      console.log(`📊 Fetched ${rows.length} records from database`);
      
      res.json({
        success: true,
        data: rows,
        count: rows.length
      });
    });
  }
});

// POST endpoint - Insert new live_steps record
app.post('/api/live-steps', (req, res) => {
  const { phone_number, steps } = req.body;
  
  // Validate required fields
  if (!phone_number || steps === undefined) {
    return res.status(400).json({
      error: 'phone_number and steps are required fields'
    });
  }
  
  // Validate steps is a number
  if (typeof steps !== 'number' || steps < 0) {
    return res.status(400).json({
      error: 'steps must be a non-negative number'
    });
  }
  
  const upsertQuery = `
    INSERT OR REPLACE INTO live_steps (phone_number, steps, timestamp)
    VALUES (?, ?, CURRENT_TIMESTAMP)
  `;
  
  db.run(upsertQuery, [phone_number, steps], function(err) {
    if (err) {
      console.error('Error upserting data:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    console.log(`✅ Record updated successfully - Phone: ${phone_number}, Steps: ${steps}`);
    
    res.status(200).json({
      success: true,
      message: 'Record updated successfully',
      phone_number: phone_number,
      steps: steps
    });
  });
});

// Live steps endpoint for phone number 1111111111 only
app.get('/api/live-steps/1111111111', (req, res) => {
  const query = 'SELECT steps FROM live_steps WHERE phone_number = ?';
  const params = ['1111111111'];
  
  db.get(query, params, (err, row) => {
    if (err) {
      console.error('Error fetching data for 1111111111:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    console.log(`📱 Live steps for 1111111111: ${row ? row.steps : 'No data'}`);
    
    res.send(row ? row.steps.toString() : '0');
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  GET  /api/live-steps - Get all records (optional ?phone_number=filter)`);
  console.log(`  GET  /api/live-steps/1111111111 - Get live steps for 1111111111 only`);
  console.log(`  POST /api/live-steps - Create new record`);
  console.log(`  GET  /health - Health check`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
}); 