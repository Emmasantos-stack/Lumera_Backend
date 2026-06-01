const User = require('../Model/User');
const Ticket = require('../Model/Ticket');

const controller = {};

controller.listManagers = async (_req, res) => {
  try {
    const data = await User.findAll({
      where: { classe: 'manager' },
      order: [['id_user', 'DESC']],
    });

    return res.json({
      success: true,
      data: data.map((user) => ({
        id: user.id_user,
        name: user.nome,
        email: user.email,
        phone: user.telefone,
        department: user.departamento,
        team: user.team_size,
        incidentsResolved: 0,
        performance: 85,
        status: user.status,
        joinDate: 'Hoje',
        role: 'Gestor',
        username: user.username,
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

controller.createManager = async (req, res) => {
  try {
    const { nome, username, password, email, telefone, departamento, teamSize } = req.body;

    if (!nome || !username || !password) {
      return res.status(400).json({ success: false, message: 'nome, username e password sao obrigatorios' });
    }

    const data = await User.create({
      nome,
      username,
      password,
      classe: 'manager',
      email: email || null,
      telefone: telefone || null,
      departamento: departamento || null,
      team_size: Number(teamSize || 0),
      status: 'online',
    });

    return res.status(201).json({
      success: true,
      message: 'Gestor criado com sucesso',
      data: {
        id: data.id_user,
        name: data.nome,
        email: data.email,
        phone: data.telefone,
        department: data.departamento,
        team: data.team_size,
        incidentsResolved: 0,
        performance: 85,
        status: data.status,
        joinDate: 'Hoje',
        role: 'Gestor',
        username: data.username,
      },
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ success: false, message: 'username ou email ja existe' });
    }

    return res.status(500).json({ success: false, message: error.message });
  }
};

controller.listUsers = async (_req, res) => {
  try {
    const managerId = _req.query.managerId ? Number(_req.query.managerId) : null;
    const where = { classe: 'user' };

    if (managerId) {
      where.manager_id = managerId;
    }

    const data = await User.findAll({
      where,
      order: [['id_user', 'DESC']],
    });

    const formatted = await Promise.all(
      data.map(async (user) => {
        const ticketsOpen = await Ticket.count({
          where: { created_by: user.id_user, estado: 'Aberto' },
        });

        return {
          id: user.id_user,
          name: user.nome,
          email: user.email,
          phone: user.telefone,
          department: user.departamento,
          ticketsOpen,
          status: user.status,
          lastActive: 'Agora',
          role: 'Utilizador',
          username: user.username,
          managerId: user.manager_id,
        };
      })
    );

    return res.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

controller.createUser = async (req, res) => {
  try {
    const { nome, username, password, email, telefone, departamento, managerId } = req.body;

    if (!nome || !username || !password) {
      return res.status(400).json({ success: false, message: 'nome, username e password sao obrigatorios' });
    }

    const data = await User.create({
      nome,
      username,
      password,
      classe: 'user',
      email: email || null,
      telefone: telefone || null,
      departamento: departamento || null,
      manager_id: managerId ? Number(managerId) : null,
      status: 'online',
    });

    return res.status(201).json({
      success: true,
      message: 'Utilizador criado com sucesso',
      data: {
        id: data.id_user,
        name: data.nome,
        email: data.email,
        phone: data.telefone,
        department: data.departamento,
        ticketsOpen: 0,
        status: data.status,
        lastActive: 'Agora',
        role: 'Utilizador',
        username: data.username,
        managerId: data.manager_id,
      },
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ success: false, message: 'username ou email ja existe' });
    }

    return res.status(500).json({ success: false, message: error.message });
  }
};

controller.deleteManager = async (req, res) => {
  try {
    const manager = await User.findOne({
      where: { id_user: req.params.id, classe: 'manager' },
    });

    if (!manager) {
      return res.status(404).json({ success: false, message: 'Gestor nao encontrado' });
    }

    await manager.destroy();

    return res.json({ success: true, message: 'Gestor eliminado com sucesso' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

controller.deleteUser = async (req, res) => {
  try {
    const target = await User.findOne({
      where: { id_user: req.params.id, classe: 'user' },
    });

    if (!target) {
      return res.status(404).json({ success: false, message: 'Utilizador nao encontrado' });
    }

    await target.destroy();

    return res.json({ success: true, message: 'Utilizador eliminado com sucesso' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = controller;
