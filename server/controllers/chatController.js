const { DataTypes } = require("sequelize");


const { ChatMessage } = require("../models/chatModel");
const { User } = require("../models/users");

const postChat = async (req, res) => {
  try {
    const UserId = req.user.id;
    const user = req.user;
    const username=req.user.username;
    const { message } = req.body;
    const chatMessage = await ChatMessage.create({ username, message,UserId });
    res.status(201).json(chatMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const getAllMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // default to page 1 if no page query param is provided
    const limit = parseInt(req.query.limit) || 10; // default to 10 messages per page if no limit query param is provided
    // const offset = (page - 1) * limit;

    const messagesCount = await ChatMessage.count();
    let totalPages = Math.ceil(messagesCount / limit);
    let currentPage = page;
    if(page<=totalPages)
    currentPage=(totalPages-page)+1;
    else if(page>totalPages)
    currentPage=1;

    // if (currentPage === 1 ) {
    //   currentPage = totalPages;
    // } else if (page <= totalPages) {
    //   currentPage = totalPages - currentPage;
    // }else if(totalPages < currentPage)
    // currentPage=totalPages-1
    const offset = (currentPage - 1) * limit;
    const messages = await ChatMessage.findAll({
      order: [["createdAt", "ASC"]],
      offset,
      limit,
    });



    // res.status(200).json({
    //   messages,
    //   page,
    //   totalPages,
    // });
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// const getAllMessages = async (req, res) => {
//     try {
//       const messages = await ChatMessage.findAll({ order: [["createdAt", "ASC"]] });
//       res.status(200).json(messages);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   };
// const getAllMessages = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1; // default to page 1 if no page query param is provided
//     const limit = parseInt(req.query.limit) || 10; // default to 10 messages per page if no limit query param is provided
//     const offset = (page - 1) * limit;

//     const messagesCount = await ChatMessage.count();
//     const totalPages = Math.ceil(messagesCount / limit);

//     const messages = await ChatMessage.findAll({
//       order: [["createdAt", "ASC"]],
//       offset,
//       limit,
//     });

//     res.status(200).json({
//       messages,
//       currentPage: page,
//       totalPages,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

  

  const getLastMessage = async (req, res) => {
    try {
      const lastMessage = await ChatMessage.findOne({
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json(lastMessage);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  



module.exports = { postChat,getAllMessages,getLastMessage };
