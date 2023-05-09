const express = require("express");
//const ChatMessage = require("../models/chatMessage");
const { postChat, getAllMessages, getLastMessage } = require("../controllers/chatController");
const authenticateUser = require("../middlewares/authenticateUser");

const router = express.Router();

router.post("/chat",authenticateUser,postChat );
router.get("/chat",authenticateUser,getAllMessages);
router.get("/lastmsg",authenticateUser,getLastMessage);
module.exports = router;
