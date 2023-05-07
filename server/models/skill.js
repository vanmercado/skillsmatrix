const Sequelize = require("sequelize");
const { SkillsMatrixConnection } = require("../utils/skillsMatrixConnection");

const Skill = SkillsMatrixConnection.define(
  "Skill",
  {
    skill_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    skill_desc: {
      type: Sequelize.STRING,
    },
    skill_cat_id: {
      type: Sequelize.INTEGER,
    },
  },
  {
    tableName: "skill",
    createdAt: false,
    updatedAt: false,
    logging: false,
  }
);

module.exports = Skill;
