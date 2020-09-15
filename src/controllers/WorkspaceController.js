const { User, Workspace, WorkspaceUser } = require("../app/models");
const { hasDateOverlap } = require("../utils");

const create = async (req, res) => {
  try {
    const { name } = req.body;

    const workspace = await Workspace.create({
      name,
    });

    if (!workspace)
      return res
        .status(400)
        .json({ message: "Não foi possível criar um workspace." });

    return res.status(201).json(workspace);
  } catch (error) {
    return res.status(500).json({
      message: "Falha ao realizar cadastro: " + error,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const workspaces = await Workspace.findAll();

    return res.status(200).json(workspaces);
  } catch (error) {
    return res.status(500).json({
      message: "Falha ao realizar consulta: " + error,
    });
  }
};

const getById = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const { userId } = req.body;

    const workspace = await Workspace.findByPk(workspaceId, {
      include: [
        {
          model: WorkspaceUser,
          as: "workspaceUser",
          include: [
            {
              model: User,
              as: "users",
            },
          ],
        },
      ],
      where: { userId },
    });

    if (!workspace)
      return res.status(400).json({ message: "Workspace não existe." });

    return res.status(201).json(workspace);
  } catch (error) {
    return res.status(400).json({
      message: "Falha ao realizar a consulta: " + error,
    });
  }
};

const edit = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findByPk(workspaceId);

    console.log(workspace);

    if (!workspace)
      return res.status(400).json({ message: "Esse workspace não existe." });

    const { name } = req.body;

    const newWorkspace = await workspace.update({
      name,
    });

    if (!newWorkspace)
      return res
        .status(400)
        .json({ message: "Não foi possível editar esse workspace." });

    return res.status(200).json(newWorkspace);
  } catch (error) {
    return res.status(400).json({
      message: "Falha ao realizar a edição: " + error,
    });
  }
};

const remove = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findByPk(workspaceId);

    if (!workspace)
      return res.status(400).json({ message: "Esse workspace não existe." });

    await workspace.destroy();

    return res.status(200).json({ message: "O workspace foi removido." });
  } catch (error) {
    return res.status(400).json({
      message: "Falha ao realizar a remoção: " + error,
    });
  }
};

const createWorkspaceUser = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findByPk(workspaceId);

    if (!workspace)
      return res.status(400).json({ message: "Essa workspace não existe." });

    const { userId, startDate, endDate } = req.body;

    if (endDate <= startDate)
      res
        .status(400)
        .json({ message: "Data de término menor ou igual a data de início." });

    const user = await User.findByPk(userId);

    if (!user)
      return res.status(400).json({ message: "Esse usuário não existe." });

    const workspaceUsers = await WorkspaceUser.findAll({
      where: { workspaceId, userId },
    });

    const overlapedSchedules = workspaceUsers.filter((workspaceUser) => {
      let dates = { startDate, endDate };
      let newDates = {
        startDate: workspaceUser.startDate,
        endDate: workspaceUser.endDate,
      };
      console.log("POST: ", startDate, endDate);
      console.log("BANCO: ", workspaceUser);
      return hasDateOverlap(dates, newDates);
    });

    if (overlapedSchedules && overlapedSchedules.length > 0)
      return res
        .status(400)
        .json({ message: "O workspace já está ocupado para esse horário." });

    const newWorkspaceUser = await WorkspaceUser.create({
      workspaceId,
      userId,
      startDate,
      endDate,
    });

    if (!newWorkspaceUser)
      return res
        .status(400)
        .json({ message: "Não foi possível criar esse horário." });

    return res.status(201).json(newWorkspaceUser);
  } catch (error) {
    return res.status(400).json({
      message: "Falha ao realizar a criação: " + error,
    });
  }
};

const removeWorkspaceUser = async (req, res) => {
  try {
    const { workspaceUserId } = req.params;

    const workspaceUser = await WorkspaceUser.findByPk(workspaceUserId);

    if (!workspaceUser)
      return res.status(400).json({ message: "Esse horário não existe." });

    await workspaceUser.destroy();

    return res.status(200).json({ message: "O horário foi removido." });
  } catch (error) {
    return res.status(500).json({
      message: "Falha ao realizar a remoção: " + error,
    });
  }
};

const getAllWorkspaceUser = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspaceUsers = await WorkspaceUser.findAll({
      where: { workspaceId },
      include: [
        {
          model: User,
          as: "users",
        },
      ],
      order: [["startDate", "ASC"]],
    });

    return res.status(200).json(workspaceUsers);
  } catch (error) {
    return res.status(500).json({
      message: "Falha ao realizar consulta: " + error,
    });
  }
};

module.exports = {
  create,
  getById,
  getAll,
  remove,
  edit,
  createWorkspaceUser,
  removeWorkspaceUser,
  getAllWorkspaceUser,
};
