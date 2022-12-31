const express = require('express');
const userController = require('../controllers/user.controller.js');

const router = express.Router();

router.post('/users', userController.createUser);

// Retrieve all Users
router.get('/users', userController.findAllUsers);

// Retrieve a single User with id
router.get('/users/:id', userController.findOneUser);

// Update a User with id
router.put('/users/:id', userController.updateUser);

// Delete a User with id
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
