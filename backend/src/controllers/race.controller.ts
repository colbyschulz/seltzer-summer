import prismaClient from '../prismaClient';

const createRace = async (req, res) => {
  const { raceDate, raceName, timeInSeconds, distanceInMeters, userId } = req.body;
  // Validate request
  if (!raceDate || !raceName || !timeInSeconds || !distanceInMeters || !userId) {
    res.status(400).send({
      message: 'Must include all fields',
    });
    return;
  }

  // Create a Race
  const race = {
    raceDate: new Date(raceDate),
    raceName,
    timeInSeconds: Number(timeInSeconds),
    distanceInMeters: Number(distanceInMeters),
    user: { connect: { id: Number(userId) } },
  };

  try {
    const result = await prismaClient.race.create({
      data: race,
    });
    res.json(result);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating the Race.',
    });
  }
};

const findAllRaces = async (req, res) => {
  try {
    const races = await prismaClient.race.findMany({
      include: {
        user: true,
      },
    });
    console.log(races);

    res.json(races);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving races.',
    });
  }
};

const findOneRace = async (req, res) => {
  const { id }: { id?: string } = req.params;

  try {
    const race = await prismaClient.race.findUnique({
      where: { id: Number(id) },
    });
    res.json(race);
  } catch (err) {
    res.status(500).send({
      message: 'Error retrieving Race with id=' + id,
    });
  }
};

const updateRace = async (req, res) => {
  const { id }: { id?: string } = req.params;
  const { raceDate, raceName, timeInSeconds, distanceInMeters, userId } = req.body;

  const updatedRace = {
    raceDate: new Date(raceDate),
    raceName,
    timeInSeconds: Number(timeInSeconds),
    distanceInMeters: Number(distanceInMeters),
    user: { connect: { id: Number(userId) } },
  };

  try {
    const race = await prismaClient.race.update({
      where: { id: Number(id) },
      data: updatedRace,
    });

    res.json(race);
  } catch (error) {
    res.json({ error: `Error updating Race with ID ${id}` });
  }
};

const deleteRace = async (req, res) => {
  const { id } = req.params;

  try {
    const race = await prismaClient.race.delete({
      where: {
        id: Number(id),
      },
    });

    res.json(race);
  } catch (error) {
    res.json({ error: `Error deleting Race with ID ${id}` });
  }
};

export default {
  createRace,
  findAllRaces,
  findOneRace,
  updateRace,
  deleteRace,
};
