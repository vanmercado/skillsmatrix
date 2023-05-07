const Sequelize = require("sequelize");
const { SkillsMatrixConnection } = require("../utils/skillsMatrixConnection");

const FaSnapshot = SkillsMatrixConnection.define(
  "FaSnapshot",
  {
    functional_area_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    functional_area_name: {
      type: Sequelize.STRING,
    },
    functional_area_desc: {
      type: Sequelize.STRING,
    },
  },
  {
    tableName: "functional_area",
    createdAt: false,
    updatedAt: false,
    logging: false,
  }
);

module.exports = FaSnapshot;
