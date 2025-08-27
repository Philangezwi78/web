// test-db.js
const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'ewsc_user',
  password: '$1T$3l3k1l3@2022', 
  database: 'ewsc_visitor_db'
});


connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Successfully connected to the database as id', connection.threadId);
  
 
  connection.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) console.error(err);
    console.log('The solution is: ', results[0].solution);
    connection.end(); 
  });
});