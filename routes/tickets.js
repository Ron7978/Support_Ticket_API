    const express = require('express');
const axios = require('axios');
const Ticket = require('../models/Ticket');

const router = express.Router();

// Create ticket
router.post('/', async (req, res, next) => {
  try {
    const { title, description, customerEmail, priority, assignee, tags } = req.body;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'title is required (string)' });
    }

    const ticket = await Ticket.create({
      title,
      description,
      customerEmail,
      priority,
      assignee,
      tags,
    });

    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
});

// List tickets (with filters & pagination)
router.get('/', async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 10, search } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Ticket.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Ticket.countDocuments(filter),
    ]);

    res.json({
      page: Number(page),
      limit: Number(limit),
      total,
      items,
    });
  } catch (err) {
    next(err);
  }
});

// Get single ticket
router.get('/:id', async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.json(ticket);
  } catch (err) {
    next(err);
  }
});

// Update ticket (status change triggers webhook)
router.patch('/:id', async (req, res, next) => {
  try {
    const allowed = ['title', 'description', 'customerEmail', 'priority', 'status', 'assignee', 'tags'];
    const updates = {};
    Object.keys(req.body || {}).forEach((k) => {
      if (allowed.includes(k)) updates[k] = req.body[k];
    });

    const before = await Ticket.findById(req.params.id);
    if (!before) return res.status(404).json({ error: 'Ticket not found' });

    const ticket = await Ticket.findByIdAndUpdate(req.params.id, updates, { new: true });

    // If status changed, fire webhook (best-effort)
    if (updates.status && before.status !== updates.status) {
      const payload = {
        event: 'ticket.status.changed',
        ticketId: ticket._id.toString(),
        oldStatus: before.status,
        newStatus: ticket.status,
        ticket,
        at: new Date().toISOString(),
      };

      const url = process.env.WEBHOOK_URL;
      if (url) {
        axios.post(url, payload).catch((e) => {
          console.error('Webhook failed:', e.message);
        });
      } else {
        console.log('No WEBHOOK_URL set. Skipping webhook.');
      }
    }

    res.json(ticket);
  } catch (err) {
    next(err);
  }
});

// Delete ticket
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Ticket.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Ticket not found' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
