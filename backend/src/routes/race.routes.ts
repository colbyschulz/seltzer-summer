import express from 'express';
import raceController from '../controllers/race.controller';

const router = express.Router();

router.post('/races', raceController.createRace);

// Retrieve all Races
router.get('/races', raceController.findAllRaces);

// Retrieve a single Race with id
router.get('/races/:id', raceController.findOneRace);

// Update a Race with id
router.put('/races/:id', raceController.updateRace);

// Delete a Race with id
router.delete('/races/:id', raceController.deleteRace);

export default router;
