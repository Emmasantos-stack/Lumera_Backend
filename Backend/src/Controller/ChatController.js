const ChatMessage = require('../Model/ChatMessage');

const controller = {};

controller.listMessages = async (req, res) => {
  try {
    const room = req.query.room || 'global';
    const data = await ChatMessage.findAll({
      where: { room },
      order: [['id_message', 'ASC']],
      limit: 100,
    });

    return res.json({
      success: true,
      data: data.map((item) => ({
        id: item.id_message,
        author: item.sender_name,
        role: item.sender_role,
        text: item.message,
        createdAt: item.created_at,
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

controller.createMessage = async (req, res) => {
  try {
    const { senderId, senderName, senderRole, message, room } = req.body;

    if (!senderId || !senderName || !senderRole || !message) {
      return res.status(400).json({ success: false, message: 'senderId, senderName, senderRole e message sao obrigatorios' });
    }

    const data = await ChatMessage.create({
      sender_id: Number(senderId),
      sender_name: senderName,
      sender_role: senderRole,
      room: room || 'global',
      message,
    });

    return res.status(201).json({
      success: true,
      data: {
        id: data.id_message,
        author: data.sender_name,
        role: data.sender_role,
        text: data.message,
        createdAt: data.created_at,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = controller;
