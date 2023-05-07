const Sequelize = require("sequelize");
const { SkillsMatrixConnection } = require("../utils/skillsMatrixConnection");

const JobRole = SkillsMatrixConnection.define(
  "JobRole",
  {
    job_profile_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    job_profile_name: {
      type: Sequelize.STRING,
    },
    team_id: {
      type: Sequelize.INTEGER,
    },
  },
  {
    tableName: "job_profile",
    createdAt: false,
    updatedAt: false,
    logging: false,
  }
);

module.exports = JobRole;
