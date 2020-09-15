"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Meeting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Meeting.belongsTo(models.User, {
        foreignKey: "userId",
        as: "host",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Meeting.belongsTo(models.Room, {
        foreignKey: "roomId",
        as: "room",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Meeting.hasMany(models.MeetingUser, {
        foreignKey: "meetingId",
        as: "meetingUser",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Meeting.init(
    {
      description: DataTypes.STRING,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Meeting",
    }
  );
  return Meeting;
};
