const { Pool } = require('pg');

// Create a new pool instance with your Neon database credentials
const pool = new Pool({
  user: process.env.PGUSER,        // your Neon DB username
  host: process.env.PGHOST,       // your Neon DB host
  database: process.env.PGDATABASE,    // your Neon DB name
  password: process.env.PGPASSWORD,    // your Neon DB password
  port: 5432,                   // your Neon DB port (default is 5432)
  ssl: {
    rejectUnauthorized: false   // If you're using SSL, you might need this option
  }
});

module.exports=pool