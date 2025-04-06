const Role = require('../models/Role');

async function getAllRoles(req, res) {
    try {
        const roles = await Role.findAll();
        res.json(roles);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

async function createRole(req, res) {
    try {
        const { name, description } = req.body;
        const role = new Role(null, name, description);
        const newRole = await role.save();
        res.status(201).json(newRole);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

async function updateRole(req, res) {
    try {
        const { name, description } = req.body;
        const updatedRole = await Role.update(req.params.id, name, description);
        res.json(updatedRole);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

async function deleteRole(req, res) {
    try {
        await Role.delete(req.params.id);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    getAllRoles,
    createRole,
    updateRole,
    deleteRole,
};