const { Op } = require('sequelize');
const User = require('../Model/User');
const Ticket = require('../Model/Ticket');
const Log = require('../Model/Log');
const Empresa = require('../Model/Empresa');

const controller = {};

controller.summary = async (_req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalManagers,
      totalAdmins,
      totalEmpresas,
      ticketsAbertos,
      ticketsFechados,
      ticketsEmCurso,
      ticketsPrioridadeAlta,
      ticketsPrioridadeCritica,
      logsHoje,
      loginsFalhados,
      registosHoje,
    ] = await Promise.all([
      User.count({ where: { classe: 'user' } }),
      User.count({ where: { classe: 'manager' } }),
      User.count({ where: { classe: 'admin' } }),
      Empresa.count(),
      Ticket.count({ where: { estado: 'Aberto' } }),
      Ticket.count({ where: { estado: 'Fechado' } }),
      Ticket.count({ where: { estado: 'Em Curso' } }),
      Ticket.count({ where: { prioridade: 'Alta' } }),
      Ticket.count({ where: { prioridade: 'Crítica' } }),
      Log.count({ where: { created_at: { [Op.gte]: today } } }),
      Log.count({ where: { tipo: 'login_failure', created_at: { [Op.gte]: today } } }),
      Log.count({ where: { tipo: { [Op.in]: ['user_created', 'manager_created'] }, created_at: { [Op.gte]: today } } }),
    ]);

    const totalTickets = ticketsAbertos + ticketsFechados + ticketsEmCurso;
    const taxaResolucao = totalTickets > 0
      ? Math.round((ticketsFechados / totalTickets) * 100)
      : 0;

    return res.json({
      success: true,
      generatedAt: new Date().toISOString(),
      data: {
        utilizadores: { total: totalUsers, gestores: totalManagers, admins: totalAdmins },
        empresas: { total: totalEmpresas },
        tickets: {
          total: totalTickets,
          abertos: ticketsAbertos,
          emCurso: ticketsEmCurso,
          fechados: ticketsFechados,
          prioridadeAlta: ticketsPrioridadeAlta,
          prioridadeCritica: ticketsPrioridadeCritica,
          taxaResolucao,
        },
        logs: {
          totalHoje: logsHoje,
          loginsFalhadosHoje: loginsFalhados,
          registosHoje,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = controller;
