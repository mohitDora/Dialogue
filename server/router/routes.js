const express = require('express');
const { getAllMessages } = require('../controllers/messageController');
const {createUser,deleteUserById}=require("../controllers/userController")
const {sendRequest,acceptRequest,rejectRequest,getFriends} =require("../controllers/friends")

const router = express.Router();

router.post('/messages', getAllMessages);

router.post('/createUser',createUser)
router.post('/deleteUser',deleteUserById)

router.post('/friend-request',sendRequest)
router.post('/friend-request/accept',acceptRequest)
router.post('/friend-request/reject',rejectRequest)
router.post('/friend-requests',getFriends)

module.exports = router;
