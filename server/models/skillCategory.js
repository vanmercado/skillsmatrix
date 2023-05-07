const Sequelize = require("sequelize");
const { SkillsMatrixConnection } = require("../utils/skillsMatrixConnection");

const SkillCategory = SkillsMatrixConnection.define(
  "SkillCategory",
  {
    skill_cat_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    skill_cat_desc: {
      type: Sequelize.STRING,
    },
  },
  {
    tableName: "skill_category",
    createdAt: false,
    updatedAt: false,
    logging: false,
  }
);

module.exports = SkillCategory;
