const User = require('../Model/User');
const Log = require('../Model/Log');

const controller = {};

const getIp = (req) =>
  (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();

controller.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'username e password sao obrigatorios' });
    }

    const user = await User.findOne({ where: { username, password } });

    if (!user) {
      await Log.create({
        tipo: 'login_failure',
        origem: 'AUTH',
        evento: `Tentativa de login falhada para o utilizador "${username}"`,
        nivel: 'Aviso',
        actor_username: username,
        ip_address: getIp(req),
      });
      return res.status(401).json({ success: false, message: 'credenciais invalidas' });
    }

    await Log.create({
      tipo: 'login_success',
      origem: 'AUTH',
      evento: `Login bem-sucedido: ${user.nome} (${user.classe})`,
      nivel: 'Info',
      actor_username: user.username,
      ip_address: getIp(req),
    });

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
        managerId: user.manager_id || null,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = controller;
