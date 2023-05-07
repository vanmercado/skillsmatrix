const Sequelize = require("sequelize");
const { SkillsMatrixConnection } = require("../utils/skillsMatrixConnection");

const Users = SkillsMatrixConnection.define(
  "Users",
  {
    user_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    user_email: {
      type: Sequelize.STRING,
    },
    user_status: {
      type: Sequelize.TINYINT,
    },
  },
  {
    tableName: "users",
    createdAt: false,
    updatedAt: false,
    logging: false,
  }
);

module.exports = Users;
