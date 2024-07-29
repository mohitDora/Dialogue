const pool = require('../utils/db');
const query = require('../utils/query');

// Send a friend request
const sendRequest=async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    const result = await query('friend_requests', { sender_id: senderId, receiver_id: receiverId }, { type: 'INSERT' });
    res.json(result[0]);
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).send('Error sending friend request');
  }
};

// Accept a friend request
const acceptRequest=async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    const result = await query('friend_requests', { status: 'accepted' }, { type: 'UPDATE', conditions: { sender_id: senderId, receiver_id: receiverId } });
    res.json(result[0]);
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).send('Error accepting friend request');
  }
};

// Reject a friend request
const rejectRequest=async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    const result = await query('friend_requests', { status: 'rejected' }, { type: 'UPDATE', conditions: { sender_id: senderId, receiver_id: receiverId } });
    res.json(result[0]);
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    res.status(500).send('Error rejecting friend request');
  }
};

// View friend requests
const getFriends = async (req, res) => {
  const { userId } = req.body;
  try {
    // Fetch pending friend requests
    const pendingRequests = await query('friend_requests', {}, {
      type: 'SELECT',
      returning: '*',   
      complexConditions: 'receiver_id = $1 AND status = $2',
      conditions: { receiver_id:userId, status: 'pending' }
    });

    // Fetch accepted friends where the user is either the sender or receiver
    const query1 = `
      SELECT *
      FROM friend_requests
      WHERE (sender_id = $1 OR receiver_id = $1) AND status = 'accepted';
    `;
    const {rows} = await pool.query(query1, [userId]);

    res.json({ pendingRequests, rows });
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    res.status(500).send('Error fetching friend requests');
  }
};

module.exports = {sendRequest,acceptRequest,rejectRequest,getFriends};
