const db = require('../models/index.js');
const Race = db.Race;

const createRace = (req, res) => {
  console.log(req.body);
  // Validate request
  if (!req.body.raceName || !req.body.timeInSeconds || !req.body.raceDate) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
    return;
  }

  // Create a Race
  const race = {
    raceName: req.body.raceName,
    timeInSeconds: req.body.timeInSeconds,
    raceDate: req.body.raceDate,
  };

  // Save Race in the database
  Race.create(race)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Race.',
      });
    });
};

const findAllRaces = (req, res) => {
  Race.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving tutorials.',
      });
    });
};

const findOneRace = (req, res) => {
  const id = req.params.id;

  Race.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Race with id=${id}.`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: 'Error retrieving Race with id=' + id,
      });
    });
};

const updateRace = (req, res) => {
  const id = req.params.id;

  Race.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Race was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update Race with id=${id}. Maybe Race was not found or req.body is empty!`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: 'Error updating Race with id=' + id,
      });
    });
};

const deleteRace = (req, res) => {
  const id = req.params.id;

  Race.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Race was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Race with id=${id}. Maybe Race was not found!`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: 'Could not delete Race with id=' + id,
      });
    });
};

module.exports = {
  createRace,
  findAllRaces,
  findOneRace,
  updateRace,
  deleteRace,
};
