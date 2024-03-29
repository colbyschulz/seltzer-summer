import prismaClient from '../prismaClient';

const createUser = async (req, res) => {
  console.log(req.body);
  const { firstName, lastName } = req.body;
  // Validate request
  if (!firstName || !lastName) {
    res.status(400).send({
      message: 'Must include first name and last name',
    });
    return;
  }

  // Create a User
  const user = {
    firstName,
    lastName,
    userFullName: `${firstName} ${lastName}`,
  };

  try {
    const result = await prismaClient.user.create({
      data: user,
    });
    res.json(result);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating the User.',
    });
  }
};

const findAllUsers = async (req, res) => {
  try {
    const users = await prismaClient.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving users.',
    });
  }
};

const findOneUser = async (req, res) => {
  const { id }: { id?: string } = req.params;

  try {
    const user = await prismaClient.user.findUnique({
      where: { id: Number(id) },
      include: { races: true },
    });
    res.json(user);
  } catch (err) {
    res.status(500).send({
      message: 'Error retrieving User with id=' + id,
    });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prismaClient.user.update({
      where: { id: Number(id) },
      data: req.body,
    });

    res.json(user);
  } catch (error) {
    res.json({ error: `Error updating User with ID ${id}` });
  }
};

export default {
  createUser,
  findAllUsers,
  findOneUser,
  updateUser,
};
