const Ativo = require('../Model/AtivoTecnologico');
const Empresa = require('../Model/Empresa');

const controller = {};

controller.listByEmpresa = async (req, res) => {
    const { id_empresa } = req.params;
    try {
        const data = await Ativo.findAll({
            where: { id_empresa: id_empresa },
            include: [Empresa] 
        });
        res.json({ success: true, data: data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = controller;