const Sequelize = require("sequelize");
const { SkillsMatrixConnection } = require("../utils/skillsMatrixConnection");
const TeamMember = require("./teamMember");

const Team = SkillsMatrixConnection.define(
  "Team",
  {
    team_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    team_name: {
      type: Sequelize.STRING,
    },
    manager_name: {
      type: Sequelize.STRING,
    },
    om_id: {
      type: Sequelize.INTEGER,
    },
    team_desc: {
      type: Sequelize.TEXT,
    },
  },
  {
    tableName: "team",
    createdAt: false,
    updatedAt: false,
    logging: false,
  }
);

Team.hasMany(TeamMember, { as: "team_member", foreignKey: "team_id" });

module.exports = Team;
