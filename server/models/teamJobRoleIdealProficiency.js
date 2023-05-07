const Sequelize = require("sequelize");
const { SkillsMatrixConnection } = require("../utils/skillsMatrixConnection");
const Team = require("./team");

const TeamJobRoleIdealProficiency = SkillsMatrixConnection.define(
  "TeamJobRoleIdealProficiency",
  {
    ideal_proficiency_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    job_profile_id: {
      type: Sequelize.INTEGER,
    },
    proficiency_id: {
      type: Sequelize.INTEGER,
    },
    skill_id: {
      type: Sequelize.INTEGER,
    },
    team_id: {
      type: Sequelize.INTEGER,
    },
  },
  {
    tableName: "ideal_proficiency",
    createdAt: false,
    updatedAt: false,
    logging: false,
  }
);

TeamJobRoleIdealProficiency.belongsTo(Team, {
  as: "team",
  foreignKey: "team_id",
});

module.exports = TeamJobRoleIdealProficiency;
