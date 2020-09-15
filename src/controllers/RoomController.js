const { Room } = require("../app/models");

const create = async (req, res) => {
  try {
    const { name } = req.body;

    const room = await Room.create({
      name,
    });

    if (!room)
      return res
        .status(400)
        .json({ message: "Não foi possível criar uma sala" });

    return res.status(201).send(room);
  } catch (error) {
    return res.status(500).send({
      message: "Falha ao realizar cadastro " + error,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const rooms = await Room.findAll();

    return res.status(201).send(rooms);
  } catch (error) {
    return res.status(500).send({
      message: "Falha ao realizar consulta: " + error,
    });
  }
};

const getById = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findByPk(roomId);

    if (!room) return res.status(400).json({ message: "Sala não existe." });

    return res.status(201).json(room);
  } catch (error) {
    return res.status(400).json({
      message: "Falha ao realizar a consulta: " + error,
    });
  }
};

const edit = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findByPk(roomId);

    if (!room)
      return res.status(400).json({ message: "Essa sala não existe." });

    const { name } = req.body;

    const newRoom = await room.update({
      name,
    });

    if (!newRoom)
      return res
        .status(400)
        .json({ message: "Não foi possível editar essa sala." });

    return res.status(200).json(newRoom);
  } catch (error) {
    return res.status(400).json({
      message: "Falha ao realizar a edição: " + error,
    });
  }
};

const remove = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findByPk(roomId);

    if (!room)
      return res.status(400).json({ message: "Essa sala não existe." });

    await room.destroy();

    return res.status(200).json({ message: "A sala foi removida." });
  } catch (error) {
    return res.status(400).json({
      message: "Falha ao realizar a remoção: " + error,
    });
  }
};

module.exports = { create, getById, getAll, remove, edit };
