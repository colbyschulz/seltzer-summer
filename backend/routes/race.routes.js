// import express from 'express';
// import racesController from '../controllers/race.controller.js';

const express = require('express');
const racesController = require('../controllers/race.controller.js');

const router = express.Router();

router.post('/races', racesController.createRace);

// Retrieve all Races
router.get('/races', racesController.findAllRaces);

// Retrieve a single Race with id
router.get('/races/:id', racesController.findOneRace);

// Update a Race with id
router.put('/races/:id', racesController.updateRace);

// Delete a Race with id
router.delete('/races/:id', racesController.deleteRace);

module.exports = router;
