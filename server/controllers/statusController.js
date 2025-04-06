const Status = require('../models/Status');

async function getAllStatuses(req, res) {
    try {
        const statuses = await Status.findAll();
        res.json(statuses);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

async function createStatus(req, res) {
    try {
        const { name } = req.body;
        const status = new Status(null, name);
        const newStatus = await status.save();
        res.status(201).json(newStatus);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

async function updateStatus(req, res) {
    try {
        const { name } = req.body;
        const updatedStatus = await Status.update(req.params.id, name);
        res.json(updatedStatus);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

async function deleteStatus(req, res) {
    try {
        await Status.delete(req.params.id);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

async function updateStatusPositions(req, res) {
    try {
        const { order } = req.body;
        await Status.updatePositions(order);
        res.json({ message: 'Positions updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    getAllStatuses,
    createStatus,
    updateStatus,
    deleteStatus,
    updateStatusPositions
};