const User = require('../Model/User');

const controller = {};

controller.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'username e password sao obrigatorios' });
    }

    const user = await User.findOne({ where: { username, password } });

    if (!user) {
      return res.status(401).json({ success: false, message: 'credenciais invalidas' });
    }

    return res.json({
      success: true,
      user: {
        id: user.id_user,
        nome: user.nome,
        perfil: user.classe,
        username: user.username,
        email: user.email,
        telefone: user.telefone,
        departamento: user.departamento,
        teamSize: user.team_size,
        status: user.status,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = controller;
