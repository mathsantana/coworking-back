const { User, Meeting } = require("../app/models");
const jwt = require("jsonwebtoken");

function generateToken(params = {}) {
  return jwt.sign(params, "coworking", {
    expiresIn: 5086400,
  });
}

const getById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: Meeting,
          as: "meeting",
        },
      ],
    });

    if (!user)
      return res.status(400).json({ message: "Esse usuário não existe." });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).send({
      message: "Falha ao realizar consulta: " + error,
    });
  }
};
const create = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    delete user.password;

    return res.status(201).json({
      user,
      token: generateToken({ id: user.id, email: user.email }),
    });
  } catch (error) {
    return res.status(400).send({
      message: "Falha ao realizar o cadastro: " + error,
    });
  }
};

const edit = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);

    if (!user)
      return res.status(400).json({ message: "Esse usuário não existe." });

    const { firstName, lastName } = req.body;

    const newUser = await user.update({
      firstName,
      lastName,
    });

    console.log(newUser.password);

    if (!newUser)
      return res
        .status(400)
        .json({ message: "Não foi possível editar esse usuário." });

    newUser.password = undefined;

    return res.status(200).json(newUser);
  } catch (error) {
    return res.status(400).send({
      message: "Falha ao realizar consulta: " + error,
    });
  }
};

const authenticate = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        error: "user not found",
      });
    }

    if (!password || String(password) !== String(user.password)) {
      return res.status(400).json({
        error: "invalid password",
      });
    }

    user.password = undefined;

    return res.status(201).json({
      user,
      token: generateToken({ id: user.id, email: user.email }),
    });
  } catch (error) {
    return res.status(400).json({
      message: "Falha ao logar " + error,
    });
  }
};

module.exports = { getById, create, edit, authenticate };
