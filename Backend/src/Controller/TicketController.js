const Ticket = require('../Model/Ticket');
const User = require('../Model/User');

const controller = {};

const formatTicket = (ticket) => ({
  id: ticket.id_ticket,
  title: ticket.titulo,
  description: ticket.descricao,
  priority: ticket.prioridade,
  status: ticket.estado,
  created: ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('pt-PT') : '',
  updated: ticket.updated_at ? new Date(ticket.updated_at).toLocaleDateString('pt-PT') : '',
  assignee: ticket.assignee?.nome || 'Não atribuído',
  requester: ticket.creator?.nome || '',
  requesterId: ticket.created_by,
});

controller.listTickets = async (req, res) => {
  try {
    const { perfil, userId } = req.query;
    const where = {};

    if (perfil === 'user' && userId) {
      where.created_by = Number(userId);
    }

    const data = await Ticket.findAll({
      where,
      include: [
        { model: User, as: 'creator', attributes: ['id_user', 'nome'] },
        { model: User, as: 'assignee', attributes: ['id_user', 'nome'], required: false },
      ],
      order: [['id_ticket', 'DESC']],
    });

    return res.json({
      success: true,
      data: data.map(formatTicket),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

controller.createTicket = async (req, res) => {
  try {
    const { titulo, descricao, prioridade, createdBy, assignedTo } = req.body;

    if (!titulo || !createdBy) {
      return res.status(400).json({ success: false, message: 'titulo e createdBy sao obrigatorios' });
    }

    const data = await Ticket.create({
      titulo,
      descricao: descricao || null,
      prioridade: prioridade || 'Baixa',
      estado: 'Aberto',
      created_by: Number(createdBy),
      assigned_to: assignedTo ? Number(assignedTo) : null,
    });

    const createdTicket = await Ticket.findByPk(data.id_ticket, {
      include: [
        { model: User, as: 'creator', attributes: ['id_user', 'nome'] },
        { model: User, as: 'assignee', attributes: ['id_user', 'nome'], required: false },
      ],
    });

    return res.status(201).json({
      success: true,
      message: 'Ticket criado com sucesso',
      data: formatTicket(createdTicket),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

controller.updateStatus = async (req, res) => {
  try {
    const { estado, assignedTo } = req.body;
    const ticket = await Ticket.findByPk(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket nao encontrado' });
    }

    if (estado) {
      ticket.estado = estado;
    }

    if (assignedTo !== undefined) {
      ticket.assigned_to = assignedTo ? Number(assignedTo) : null;
    }

    await ticket.save();

    const updatedTicket = await Ticket.findByPk(ticket.id_ticket, {
      include: [
        { model: User, as: 'creator', attributes: ['id_user', 'nome'] },
        { model: User, as: 'assignee', attributes: ['id_user', 'nome'], required: false },
      ],
    });

    return res.json({
      success: true,
      message: 'Ticket atualizado com sucesso',
      data: formatTicket(updatedTicket),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = controller;
