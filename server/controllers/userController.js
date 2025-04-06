const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secretKey = process.env.JWT_SECRET || 'secret';

// Middleware для проверки токена
async function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.userId = decoded.id; // Добавляем userId в req
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).send('Unauthorized');
    }
}

async function getUserById(req, res) {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const roles = await User.getUserRoles(user.id);
        res.json({
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            avatar: user.avatar,
            roles: roles,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

async function getUser(req, res) {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const roles = await User.getUserRoles(user.id);
        res.json({
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            avatar: user.avatar,
            roles: roles,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

async function getAllUsers(req, res) {
    try {
        const users = await User.findAll();
        const usersWithRoles = await Promise.all(users.map(async user => {
            const roles = await User.getUserRoles(user.id);
            return {
                ...user,
                roles: roles,
            };
        }));
        res.json(usersWithRoles);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

// Обновление информации о пользователе
async function updateUser(req, res) {
    try {
        const targetUser = await User.findById(req.params.id);
        const currentUserRoles = await User.getUserRoles(req.userId);

        if (!currentUserRoles.includes(7) && req.userId !== targetUser.id) {
            return res.status(403).send('Forbidden');
        }

        const { email, first_name, last_name, avatar, role_ids } = req.body; // Добавляем role_ids

        // Обновляем роли пользователя
        await User.updateUserRoles(req.params.id, role_ids);

        // Обновляем основную информацию пользователя
        const updatedUser = await User.update(req.params.id, email, first_name, last_name, avatar);
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

// Удаление пользователя
async function deleteUser(req, res) {
    try {
        const currentUserRoles = await User.getUserRoles(req.userId);

        if (!currentUserRoles.includes(7)) {
            return res.status(403).send('Forbidden');
        }
        await User.delete(req.params.id);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    authenticateToken,
    getUserById,
    getUser,
    getAllUsers,
    updateUser,
    deleteUser
};