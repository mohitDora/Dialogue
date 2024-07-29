const pool = require('./db');

const query = async (table, data, options = {}) => {
  const { type = 'INSERT', returning = '*', conditions = {} } = options;
  
  let query = '';
  const values = [];
  
  if (type === 'INSERT') {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map((_, index) => `$${index + 1}`).join(', ');
    
    query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING ${returning}`;
    values.push(...Object.values(data));
  } else if (type === 'SELECT') {
    const whereClause = Object.keys(conditions)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(' AND ');
    
    query = `SELECT ${returning} FROM ${table}`;
    if (whereClause) {
      query += ` WHERE ${whereClause}`;
    }
    values.push(...Object.values(conditions));
  } else if (type === 'UPDATE') {
    const setClause = Object.keys(data)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');
    const whereClause = Object.keys(conditions)
      .map((key, index) => `${key} = $${index + 1 + Object.keys(data).length}`)
      .join(' AND ');

    query = `UPDATE ${table} SET ${setClause}`;
    if (whereClause) {
      query += ` WHERE ${whereClause}`;
    }
    query += ` RETURNING ${returning}`;
    values.push(...Object.values(data), ...Object.values(conditions));
  } else if (type === 'DELETE') {
    const whereClause = Object.keys(conditions)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(' AND ');

    query = `DELETE FROM ${table}`;
    if (whereClause) {
      query += ` WHERE ${whereClause}`;
    }
    query += ` RETURNING ${returning}`;
    values.push(...Object.values(conditions));
  }

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

module.exports = query;
