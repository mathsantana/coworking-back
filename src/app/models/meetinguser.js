"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MeetingUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MeetingUser.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }),
        MeetingUser.belongsTo(models.Meeting, {
          foreignKey: "meetingId",
          as: "meeting",
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        });
    }
  }
  MeetingUser.init(
    {},
    {
      sequelize,
      modelName: "MeetingUser",
    }
  );
  return MeetingUser;
};
