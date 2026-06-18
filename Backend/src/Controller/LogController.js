const { Op } = require('sequelize');
const Log = require('../Model/Log');

const controller = {};

controller.list = async (req, res) => {
  try {
    const { tipo, limit = 200 } = req.query;
    const where = {};

    if (tipo && tipo !== 'todos') {
      where.tipo = { [Op.like]: `${tipo}%` };
    }

    const data = await Log.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: Math.min(Number(limit), 500),
    });

    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = controller;
