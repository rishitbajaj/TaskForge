const express = require('express');
const { body, param } = require('express-validator');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(auth);

const taskIdValidation = param('id').isMongoId().withMessage('Invalid task id');

const createTaskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('status')
    .optional()
    .isIn(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH'])
    .withMessage('Invalid priority'),
];

const updateTaskValidation = [
  taskIdValidation,
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('status')
    .optional()
    .isIn(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH'])
    .withMessage('Invalid priority'),
];

router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(tasks);
  } catch (error) {
    return next(error);
  }
});

router.post('/', createTaskValidation, validate, async (req, res, next) => {
  try {
    const task = await Task.create({
      title: req.body.title.trim(),
      description: req.body.description || '',
      status: req.body.status || 'TODO',
      priority: req.body.priority || 'MEDIUM',
      user: req.user._id,
    });

    return res.status(201).json(task);
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', updateTaskValidation, validate, async (req, res, next) => {
  try {
    const updates = {};
    const { title, description, status, priority } = req.body;

    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.json(task);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', taskIdValidation, validate, async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.json({ message: 'Task deleted', id: req.params.id });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
