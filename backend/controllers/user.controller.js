const db = require('../models/index.js');
const User = db.User;

const createUser = (req, res) => {
  console.log(req.body);
  // Validate request
  if (!req.body.raceName || !req.body.timeInSeconds || !req.body.raceDate) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
    return;
  }

  // Create a User
  const race = {
    raceName: req.body.raceName,
    timeInSeconds: req.body.timeInSeconds,
    raceDate: req.body.raceDate,
  };

  // Save User in the database
  User.create(race)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the User.',
      });
    });
};

const findAllUsers = (req, res) => {
  User.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving tutorials.',
      });
    });
};

const findOneUser = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: 'Error retrieving User with id=' + id,
      });
    });
};

const updateUser = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'User was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: 'Error updating User with id=' + id,
      });
    });
};

const deleteUser = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'User was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: 'Could not delete User with id=' + id,
      });
    });
};

module.exports = {
  createUser,
  findAllUsers,
  findOneUser,
  updateUser,
  deleteUser,
};
