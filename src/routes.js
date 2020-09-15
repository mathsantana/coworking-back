"use strict";

const express = require("express");
const router = express.Router();

const userController = require("./controllers/UserController");
const roomController = require("./controllers/RoomController");
const meetingController = require("./controllers/MeetingController");
const workspaceController = require("./controllers/WorkspaceController");

router.get("/", (req, res) => {
  res.status(200).send({
    app: "Coworking",
    running: true,
  });
});

// User
router.post("/user/", userController.create);
router.post("/user/authenticate", userController.authenticate);
router.get("/user/:userId", userController.getById);
router.put("/user/:userId", userController.edit);

// Room
router.post("/room/", roomController.create);
router.get("/room/", roomController.getAll);
router.get("/room/:roomId", roomController.getById);
router.put("/room/:roomId", roomController.edit);
router.delete("/room/:roomId", roomController.remove);

// Meeting
router.post("/meeting/", meetingController.create);
router.get("/meeting/", meetingController.getAll);
router.get("/meeting/:meetingId", meetingController.getById);
router.put("/meeting/:meetingId", meetingController.edit);
router.delete("/meeting/:meetingId", meetingController.remove);

// MeetingUser
router.post("/meeting/:meetingId/attendee", meetingController.createAttendee);
router.delete("/meeting/:meetingId/attendee", meetingController.removeAttendee);

// Workspace
router.post("/workspace/", workspaceController.create);
router.get("/workspace/", workspaceController.getAll);
router.get("/workspace/:workspaceId", workspaceController.getById);
router.put("/workspace/:workspaceId", workspaceController.edit);
router.delete("/workspace/:workspaceId", workspaceController.remove);

// WorkspaceUser
router.post(
  "/workspace/:workspaceId/schedule",
  workspaceController.createWorkspaceUser
);
router.delete(
  "/workspace/schedule/:workspaceUserId",
  workspaceController.removeWorkspaceUser
);

router.get(
  "/workspace/:workspaceId/schedule",
  workspaceController.getAllWorkspaceUser
);

module.exports = router;
