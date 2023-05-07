const Sequelize = require("sequelize");
const { SkillsMatrixConnection } = require("../utils/skillsMatrixConnection");
const TeamMemberProficiency = require("./teamMemberProficiency");

const TeamMember = SkillsMatrixConnection.define(
  "TeamMember",
  {
    tm_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    tm_name: {
      type: Sequelize.STRING,
    },
    team_id: {
      type: Sequelize.INTEGER,
    },
    email: {
      type: Sequelize.STRING,
    },
    job_profile_id: {
      type: Sequelize.INTEGER,
    },
    is_role: {
      type: Sequelize.STRING,
    },
    team_lead: {
      type: Sequelize.STRING,
    },
  },
  {
    tableName: "team_member",
    createdAt: false,
    updatedAt: false,
    logging: false,
  }
);

TeamMember.hasMany(TeamMemberProficiency, {
  as: "team_member_proficiencies",
  foreignKey: "tm_id",
});

module.exports = TeamMember;
