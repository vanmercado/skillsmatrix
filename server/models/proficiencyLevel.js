const Sequelize = require("sequelize");
const { SkillsMatrixConnection } = require("../utils/skillsMatrixConnection");

const ProficiencyLevel = SkillsMatrixConnection.define(
  "ProficiencyLevel",
  {
    proficiency_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    proficiency_desc: {
      type: Sequelize.STRING,
    },
  },
  {
    tableName: "proficiency_level",
    createdAt: false,
    updatedAt: false,
    logging: false,
  }
);

module.exports = ProficiencyLevel;
