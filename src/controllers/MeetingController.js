const { Meeting, User, Room, MeetingUser } = require("../app/models");
const { hasDateOverlap } = require("../utils");

const getById = async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await Meeting.findByPk(meetingId, {
      include: [
        {
          model: MeetingUser,
          as: "meetingUser",
          include: [
            {
              model: User,
              as: "user",
            },
          ],
        },
      ],
    });

    if (!meeting)
      return res.status(400).json({ message: "Reunião não existe." });

    return res.status(201).json(meeting);
  } catch (error) {
    return res.status(400).json({
      message: "Falha ao realizar a consulta: " + error,
    });
  }
};

const create = async (req, res) => {
  try {
    const { description, startDate, endDate, userId, roomId } = req.body;

    const user = await User.findByPk(userId);

    if (!user) return res.status(400).json({ message: "Usuário não existe" });

    const room = await Room.findByPk(roomId);

    if (!room) return res.status(400).json({ message: "Sala não existe" });

    if (endDate <= startDate)
      res
        .status(400)
        .json({ message: "Data de término maior ou igual a data de início." });

    const meetings = await Meeting.findAll({
      where: { userId, roomId },
    });

    const overlapedSchedules = meetings.filter((meeting) => {
      let dates = { startDate, endDate };
      let newDates = {
        startDate: meeting.startDate,
        endDate: meeting.endDate,
      };

      return hasDateOverlap(dates, newDates);
    });

    if (overlapedSchedules && overlapedSchedules.length > 0)
      return res
        .status(400)
        .json({ message: "A sala já está ocupada para esse horário." });

    const meeting = await Meeting.create({
      description,
      startDate,
      endDate,
      userId,
      roomId,
    });

    if (!meeting)
      return res
        .status(400)
        .json({ message: "Não foi possível criar uma reunião" });

    return res.status(201).json(meeting);
  } catch (error) {
    return res.status(400).json({
      message: "Falha ao realizar cadastro: " + error,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const roomId = req.query.room_id;

    const meetings = await Meeting.findAll({
      where: { roomId },
      include: [
        {
          model: User,
          as: "host",
        },
      ],
      order: [["startDate", "ASC"]],
    });

    return res.status(200).json(meetings);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Falha ao realizar consulta: " + error,
    });
  }
};

const edit = async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await Meeting.findByPk(meetingId);

    if (!meeting)
      return res.status(400).json({ message: "Essa reunião não existe." });

    const { description, startDate, endDate, userId, roomId } = req.body;

    if (startDate || endDate) {
      const meetings = await Meeting.findAll({
        where: {
          userId: userId || meeting.userId,
          roomId: roomId || meeting.roomId,
        },
      });

      const overlapedSchedules = meetings.filter((scheduledMeeting) => {
        let dates = {
          startDate: startDate || meeting.startDate,
          endDate: endDate || meeting.endDate,
        };
        let newDates = {
          startDate: scheduledMeeting.startDate,
          endDate: scheduledMeeting.endDate,
        };

        return hasDateOverlap(dates, newDates);
      });

      if (overlapedSchedules && overlapedSchedules.length > 0)
        return res
          .status(400)
          .json({ message: "A sala já está ocupada para esse horário." });
    }

    const newMeeting = await meeting.update({
      description,
      startDate,
      endDate,
      userId,
      roomId,
    });

    if (!newMeeting)
      return res
        .status(400)
        .json({ message: "Não foi possível editar essa reunião." });

    return res.status(200).json(newMeeting);
  } catch (error) {
    return res.status(400).json({
      message: "Falha ao realizar a edição: " + error,
    });
  }
};

const remove = async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await Meeting.findByPk(meetingId);

    if (!meeting)
      return res.status(400).json({ message: "Essa reunião não existe." });

    await meeting.destroy();

    return res.status(200).json({ message: "A reunião foi removida." });
  } catch (error) {
    return res.status(400).json({
      message: "Falha ao realizar a remoção: " + error,
    });
  }
};

const createAttendee = async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await Meeting.findByPk(meetingId);

    if (!meeting)
      return res.status(400).json({ message: "Essa reunião não existe." });

    const { users } = req.body;

    await Promise.all(
      users.map(async (userId) => {
        const user = await User.findByPk(userId);

        const meetingUser = await MeetingUser.findOne({
          where: { meetingId, userId },
        });

        if (user && !meetingUser) {
          await MeetingUser.create({
            meetingId,
            userId,
          });
        }
      })
    );

    return getById(req, res);
  } catch (error) {
    return res.status(400).json({
      message: "Falha ao realizar a criação: " + error,
    });
  }
};

const removeAttendee = async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await Meeting.findByPk(meetingId);

    if (!meeting)
      return res.status(400).json({ message: "Essa reunião não existe." });

    const { users } = req.body;

    await Promise.all(
      users.map(async (userId) => {
        const meetingUser = await MeetingUser.findOne({
          where: { meetingId, userId },
        });

        if (meetingUser) {
          await meetingUser.destroy();
        }
      })
    );

    return this.getById(req, res);
  } catch (error) {
    return res.status(500).json({
      message: "Falha ao realizar a remoção: " + error,
    });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  remove,
  edit,
  createAttendee,
  removeAttendee,
};
