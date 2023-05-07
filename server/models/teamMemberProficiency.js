const Sequelize = require("sequelize");
const { SkillsMatrixConnection } = require("../utils/skillsMatrixConnection");
const Skill = require("./skill");

const TeamMemberProficiency = SkillsMatrixConnection.define(
  "TeamMemberProficiency",
  {
    tmp_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    tm_id: {
      type: Sequelize.INTEGER,
    },
    skill_id: {
      type: Sequelize.INTEGER,
    },
    personal_rating: {
      type: Sequelize.INTEGER,
    },
    proficiency_id: {
      type: Sequelize.INTEGER,
    },
    approval_flag: {
      type: Sequelize.STRING,
    },
    approval_reason: {
      type: Sequelize.STRING,
    },
    // job_profile_id: {
    //   type: Sequelize.INTEGER,
    // },
    // team_id: {
    //   type: Sequelize.INTEGER,
    // },
    date_created: {
      type: Sequelize.DATE,
    },
    created_by: {
      type: Sequelize.STRING,
    },
    date_updated: {
      type: Sequelize.DATE,
    },
    updated_by: {
      type: Sequelize.STRING,
    },
    date_approved: {
      type: Sequelize.DATE,
    },
    approved_by: {
      type: Sequelize.STRING,
    },
    years_experience: {
      type: Sequelize.INTEGER,
    },
    andmonths_experience: {
      type: Sequelize.INTEGER,
    },
    lastused_experience: {
      type: Sequelize.INTEGER,
    },
  },
  {
    tableName: "team_member_proficiency",
    createdAt: false,
    updatedAt: false,
    logging: false,
  }
);

TeamMemberProficiency.belongsTo(Skill, { as: "skill", foreignKey: "skill_id" });

module.exports = TeamMemberProficiency;
