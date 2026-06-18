const { Op } = require('sequelize');
const User = require('../Model/User');
const Ticket = require('../Model/Ticket');
const Log = require('../Model/Log');
const Empresa = require('../Model/Empresa');

const controller = {};

controller.status = async (_req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      utilizadoresOnline,
      utilizadoresTotal,
      gestoresOnline,
      gestoresTotal,
      ticketsAbertos,
      ticketsEmCurso,
      ticketsFechados,
      logEventosHoje,
      loginsFalhadosHoje,
      loginsSuccessHoje,
      empresasTotal,
      ultimosEventos,
    ] = await Promise.all([
      User.count({ where: { classe: 'user', status: 'online' } }),
      User.count({ where: { classe: 'user' } }),
      User.count({ where: { classe: 'manager', status: 'online' } }),
      User.count({ where: { classe: 'manager' } }),
      Ticket.count({ where: { estado: 'Aberto' } }),
      Ticket.count({ where: { estado: 'Em Curso' } }),
      Ticket.count({ where: { estado: 'Fechado' } }),
      Log.count({ where: { created_at: { [Op.gte]: today } } }),
      Log.count({ where: { tipo: 'login_failure', created_at: { [Op.gte]: today } } }),
      Log.count({ where: { tipo: 'login_success', created_at: { [Op.gte]: today } } }),
      Empresa.count(),
      Log.findAll({
        order: [['created_at', 'DESC']],
        limit: 8,
        attributes: ['id_log', 'tipo', 'origem', 'evento', 'nivel', 'actor_username', 'created_at'],
      }),
    ]);

    const totalTickets = ticketsAbertos + ticketsEmCurso + ticketsFechados;
    const taxaResolucao = totalTickets > 0
      ? Math.round((ticketsFechados / totalTickets) * 100)
      : 0;

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        utilizadores: {
          online: utilizadoresOnline,
          total: utilizadoresTotal,
          gestoresOnline,
          gestoresTotal,
        },
        tickets: {
          abertos: ticketsAbertos,
          emCurso: ticketsEmCurso,
          fechados: ticketsFechados,
          total: totalTickets,
          taxaResolucao,
        },
        logs: {
          eventosHoje: logEventosHoje,
          loginsFalhadosHoje,
          loginsSuccessHoje,
        },
        empresas: { total: empresasTotal },
        ultimosEventos,
        servicos: [
          { nome: 'API Backend', estado: 'online', descricao: 'Express.js — operacional' },
          { nome: 'Base de Dados', estado: 'online', descricao: 'PostgreSQL — operacional' },
          { nome: 'Sistema de Logs', estado: logEventosHoje >= 0 ? 'online' : 'degradado', descricao: 'Auditoria ativa' },
          { nome: 'Gestão de Tickets', estado: 'online', descricao: `${totalTickets} tickets no sistema` },
        ],
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = controller;
