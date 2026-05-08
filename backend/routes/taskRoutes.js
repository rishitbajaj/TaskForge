const express = require('express');
const router = express.Router();
const Task = require('../models/Task'); // We will build this model next!

// 1. GET ALL TASKS: This fetches everything from the DB
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. CREATE A TASK: This saves a new task to the DB
router.post('/', async (req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// Ensure it looks exactly like this:
router.delete('/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// TOGGLE TASK COMPLETION
router.patch('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        task.completed = !task.completed; // If true, make false. If false, make true.
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;