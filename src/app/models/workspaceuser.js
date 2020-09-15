"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class WorkspaceUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      WorkspaceUser.belongsTo(models.User, {
        foreignKey: "userId",
        as: "users",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      WorkspaceUser.belongsTo(models.Workspace, {
        foreignKey: "workspaceId",
        as: "workspace",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  WorkspaceUser.init(
    {
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "WorkspaceUser",
    }
  );
  return WorkspaceUser;
};
