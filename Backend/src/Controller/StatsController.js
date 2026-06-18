const { Op, fn, col } = require('sequelize');
const sequelize = require('../Config/database');
const User = require('../Model/User');
const Ticket = require('../Model/Ticket');
const Log = require('../Model/Log');

const controller = {};

controller.summary = async (_req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      ticketsPorEstado,
      ticketsPorPrioridade,
      utilizadoresPorClasse,
      utilizadoresPorDept,
      mttrResult,
      ticketsPorDia,
      logsPorDia,
      loginsFalhadosHoje,
      loginsSuccessHoje,
    ] = await Promise.all([
      Ticket.findAll({
        attributes: ['estado', [fn('COUNT', col('id_ticket')), 'count']],
        group: ['estado'],
        raw: true,
      }),
      Ticket.findAll({
        attributes: ['prioridade', [fn('COUNT', col('id_ticket')), 'count']],
        group: ['prioridade'],
        raw: true,
      }),
      User.findAll({
        attributes: ['classe', [fn('COUNT', col('id_user')), 'count']],
        group: ['classe'],
        raw: true,
      }),
      User.findAll({
        attributes: ['departamento', [fn('COUNT', col('id_user')), 'count']],
        where: { departamento: { [Op.not]: null } },
        group: ['departamento'],
        order: [[fn('COUNT', col('id_user')), 'DESC']],
        limit: 6,
        raw: true,
      }),
      sequelize.query(
        `SELECT ROUND(AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/60)::numeric, 0) AS avg_minutes
         FROM "TICKETS" WHERE estado = 'Fechado'`,
        { type: sequelize.QueryTypes.SELECT }
      ),
      sequelize.query(
        `SELECT TO_CHAR(DATE_TRUNC('day', created_at), 'DD/MM') AS dia,
                COUNT(*) AS total
         FROM "TICKETS"
         WHERE created_at >= :since
         GROUP BY DATE_TRUNC('day', created_at)
         ORDER BY DATE_TRUNC('day', created_at)`,
        { replacements: { since: sevenDaysAgo }, type: sequelize.QueryTypes.SELECT }
      ),
      sequelize.query(
        `SELECT TO_CHAR(DATE_TRUNC('day', created_at), 'DD/MM') AS dia,
                COUNT(*) AS total,
                COUNT(CASE WHEN tipo = 'login_success' THEN 1 END) AS logins_ok,
                COUNT(CASE WHEN tipo = 'login_failure' THEN 1 END) AS logins_fail
         FROM "LOGS"
         WHERE created_at >= :since
         GROUP BY DATE_TRUNC('day', created_at)
         ORDER BY DATE_TRUNC('day', created_at)`,
        { replacements: { since: sevenDaysAgo }, type: sequelize.QueryTypes.SELECT }
      ),
      Log.count({ where: { tipo: 'login_failure', created_at: { [Op.gte]: today } } }),
      Log.count({ where: { tipo: 'login_success', created_at: { [Op.gte]: today } } }),
    ]);

    const avgMinutes = Number(mttrResult[0]?.avg_minutes || 0);
    const mttrFormatado = avgMinutes < 60
      ? `${avgMinutes}m`
      : `${Math.floor(avgMinutes / 60)}h ${avgMinutes % 60}m`;

    const totalLogins = loginsSuccessHoje + loginsFalhadosHoje;
    const taxaFalhasLogin = totalLogins > 0
      ? Math.round((loginsFalhadosHoje / totalLogins) * 100)
      : 0;

    const totalTickets = ticketsPorEstado.reduce((s, r) => s + Number(r.count), 0);
    const fechados = Number(ticketsPorEstado.find((r) => r.estado === 'Fechado')?.count || 0);
    const taxaResolucao = totalTickets > 0 ? Math.round((fechados / totalTickets) * 100) : 0;

    const totalUsers = utilizadoresPorClasse.reduce((s, r) => s + Number(r.count), 0);

    return res.json({
      success: true,
      data: {
        kpis: {
          totalUsers,
          taxaResolucao,
          mttr: mttrFormatado,
          taxaFalhasLogin,
          loginsHoje: loginsSuccessHoje,
          loginsFalhadosHoje,
        },
        ticketsPorEstado: ticketsPorEstado.map((r) => ({ estado: r.estado, count: Number(r.count) })),
        ticketsPorPrioridade: ticketsPorPrioridade.map((r) => ({ prioridade: r.prioridade, count: Number(r.count) })),
        utilizadoresPorClasse: utilizadoresPorClasse.map((r) => ({ classe: r.classe, count: Number(r.count) })),
        utilizadoresPorDept: utilizadoresPorDept.map((r) => ({ departamento: r.departamento, count: Number(r.count) })),
        ticketsPorDia: ticketsPorDia.map((r) => ({ dia: r.dia, total: Number(r.total) })),
        logsPorDia: logsPorDia.map((r) => ({
          dia: r.dia,
          total: Number(r.total),
          loginsOk: Number(r.logins_ok),
          loginsFail: Number(r.logins_fail),
        })),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = controller;
