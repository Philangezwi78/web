const express = require('express');
const mysql = require('mysql2');
const multer = require('multer'); // Import multer
const path = require('path');
const app = express();
const port = 3000;

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'ewsc_user',
  password: '$1T$3l3k1l3@2022', 
  database: 'ewsc_visitor_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL Database.');
});

// Middleware - Serve static files from the 'public' directory
app.use(express.static('public'));

// Configure multer for memory storage (keeps file in RAM, not disk)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Check-in endpoint - Use multer to handle the 'signature' file upload
app.post('/api/visitors/check-in', upload.single('signature'), (req, res) => {

  const { name, organization, vehicle_reg, passengers, reason, other_reason } = req.body;
  const signatureBuffer = req.file ? req.file.buffer : null; // This is the image data

  // Basic validation
  if (!name) {
    return res.status(400).json({ error: 'Visitor name is required' });
  }

  const sql = `INSERT INTO visitors (name, organization, vehicle_reg, passengers, reason, other_reason, signature_image) 
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  
  db.execute(sql, [name, organization, vehicle_reg, passengers, reason, other_reason, signatureBuffer], 
    (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to save visitor data.' });
      }
      res.json({ 
        message: 'Visitor checked in successfully', 
        id: result.insertId
      });
  });
});

app.listen(port, () => {
  console.log(`EWSC Visitor app backend listening at http://localhost:${port}`);
});