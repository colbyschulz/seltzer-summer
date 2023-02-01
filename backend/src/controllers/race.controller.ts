import prismaClient from '../prismaClient';
import { getEffectiveTime } from '../utils/getEffectiveTime';

const EFFECTIVE_DISTANCE = 5000;

const createRace = async (req, res) => {
  const { raceDate, raceName, timeInSeconds, distanceInMeters, userId, user } = req.body;
  // Validate request
  if (!raceDate || !raceName || !timeInSeconds || !distanceInMeters) {
    res.status(400).send({
      message: 'Must include all fields',
    });
    return;
  }

  const parsedTimeInSeconds = Number(timeInSeconds);
  const parsedDistanceInMeters = Number(distanceInMeters);
  const effectiveTimeInSeconds =
    parsedDistanceInMeters === EFFECTIVE_DISTANCE
      ? parsedTimeInSeconds
      : getEffectiveTime({
          timeInSeconds: parsedTimeInSeconds,
          distanceInMeters: parsedDistanceInMeters,
          // use 10k as effective time
          effectiveDistanceInMeters: EFFECTIVE_DISTANCE,
        });

  let race;
  if (userId) {
    // Create a Race with exsiting user
    race = {
      raceDate: new Date(raceDate),
      raceName,
      timeInSeconds: parsedTimeInSeconds,
      effectiveTimeInSeconds,
      distanceInMeters: parsedDistanceInMeters,
      effectiveDistanceInMeters: EFFECTIVE_DISTANCE,
      user: { connect: { id: Number(userId) } },
    };
  } else {
    // Create a Race with new user
    race = {
      raceDate: new Date(raceDate),
      raceName,
      timeInSeconds: parsedTimeInSeconds,
      effectiveTimeInSeconds,
      distanceInMeters: parsedDistanceInMeters,
      effectiveDistanceInMeters: EFFECTIVE_DISTANCE,
      user: {
        create: {
          firstName: user.firstName,
          lastName: user.lastName,
          userFullName: `${user.firstName} ${user.lastName}`,
        },
      },
    };
  }

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

    races.sort((a, b) => new Date(a.raceDate).getTime() - new Date(b.raceDate).getTime());

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
  // Validate request
  if (!raceDate || !raceName || !timeInSeconds || !distanceInMeters) {
    res.status(400).send({
      message: 'Must include all fields',
    });
    return;
  }

  const parsedTimeInSeconds = Number(timeInSeconds);
  const parsedDistanceInMeters = Number(distanceInMeters);
  const effectiveTimeInSeconds =
    parsedDistanceInMeters === EFFECTIVE_DISTANCE
      ? parsedTimeInSeconds
      : getEffectiveTime({
          timeInSeconds: parsedTimeInSeconds,
          distanceInMeters: parsedDistanceInMeters,
          // use 10k as effective time
          effectiveDistanceInMeters: EFFECTIVE_DISTANCE,
        });

  // update a Race with exsiting user
  const updatedRace = {
    raceDate: new Date(raceDate),
    raceName,
    timeInSeconds: parsedTimeInSeconds,
    effectiveTimeInSeconds,
    distanceInMeters: parsedDistanceInMeters,
    effectiveDistanceInMeters: EFFECTIVE_DISTANCE,
    user: { connect: { id: Number(userId) } },
  };

  try {
    const race = await prismaClient.race.update({
      where: { id: Number(id) },
      data: updatedRace,
    });

    res.json(race);
  } catch (error) {
    res.json({ error: `Error updating Race with ID ${id}, ${error}` });
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
