const Priority = require('../models/Priority');

async function getAllPriorities(req, res) {
    try {
        const priorities = await Priority.findAll();
        res.json(priorities);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

async function getPriorityById(req, res) {
    try {
        const priority = await Priority.findById(req.params.id);
        if (priority) {
            res.json(priority);
        } else {
            res.status(404).send('Priority not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

async function createPriority(req, res) {
    try {
        const priority = await Priority.create(req.body.name);
        res.status(201).json(priority);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

async function updatePriority(req, res) {
    try {
        const priority = await Priority.update(req.params.id, req.body.name);
        res.json(priority);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

async function deletePriority(req, res) {
    try {
        await Priority.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    getAllPriorities,
    getPriorityById,
    createPriority,
    updatePriority,
    deletePriority,
};