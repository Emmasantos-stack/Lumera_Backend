const Empresa = require('../Model/Empresa');

const controller = {};

controller.list = async (_req, res) => {
  try {
    const data = await Empresa.findAll({ order: [['id_empresa', 'DESC']] });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

controller.create = async (req, res) => {
  try {
    const { nome, nif } = req.body;

    if (!nome || !nif) {
      return res.status(400).json({ success: false, message: 'nome e nif sao obrigatorios' });
    }

    const data = await Empresa.create({ nome, nif });
    return res.status(201).json({ success: true, data, message: 'Empresa criada!' });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ success: false, message: 'NIF ja existe' });
    }

    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = controller;