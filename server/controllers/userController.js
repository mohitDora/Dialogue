const query = require("../utils/query");

const createUser = async (req, res) => {
  try {
    const data = req.body;
    const result = await query('users', data, { type: 'INSERT' });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

const deleteUserById=async(req,res)=>{
    const { id } = req.body;
  try {
    const result = await query('users', {}, { type: 'DELETE', conditions: { id } });
    if (result.length === 0) {
      res.status(404).send('User not found');
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Error deleting user');
  }
}

module.exports = { createUser,deleteUserById };
