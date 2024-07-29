const pool = require("../utils/db");
const query = require("../utils/query");

const getAllMessages = async (req, res) => {
  const { senderId, receiverId } = req.body;
  const query = `
    SELECT c.*, concat(u.given_name,' ',u.family_name) AS sender_name,
      concat(u2.given_name,' ',u2.family_name) AS receiver_name
      FROM chats c
      JOIN users u ON c.sender_id = u.id
      JOIN users u2 ON c.receiver_id = u2.id
    WHERE (c.sender_id = $1 AND c.receiver_id = $2) 
    OR (c.sender_id = $2 AND c.receiver_id = $1)
    ORDER BY c.created_at ASC;
  `;
  try {
    const result = await pool.query(query, [senderId, receiverId]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).send("Error fetching messages");
  }
};

module.exports = { getAllMessages };
