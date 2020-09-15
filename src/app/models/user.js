"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Meeting, {
        foreignKey: "userId",
        as: "meeting",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      User.hasMany(models.MeetingUser, {
        foreignKey: "userId",
        as: "meetingUser",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      User.hasMany(models.WorkspaceUser, {
        foreignKey: "userId",
        as: "workspaceUser",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
