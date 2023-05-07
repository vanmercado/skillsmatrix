// Make use of the connection pool exported from mysql
const skillsMatrixMysql = require("../utils/skillsMatrix-mysql.js");
const teamJobRoleIdealProficiency = require("../models/teamJobRoleIdealProficiency");
const team = require("../models/team");
const teamMember = require("../models/teamMember");
const { Op } = require("sequelize");
const Team = require("../models/team");
const TeamMember = require("../models/teamMember");

module.exports = (app) => {
  app.post("/api/tl/teamInfo", async (req, res) => {
    // Create a connection to the database
    const connection = await skillsMatrixMysql.connection();

    try {
      const result = await connection.query(`
        SELECT
          tm.tm_id,
          tm.tm_name,
          jr.job_profile_name,
          tm.email,
          team.team_name 
        FROM
          team_member as tm,
          job_profile as jr,
          team as team 
        WHERE
          jr.job_profile_id = tm.job_profile_id
          AND team.team_id = tm.team_id
          AND tm.team_lead = (
            SELECT
              tm_id
            FROM
              team_member
            WHERE
              email = '${req.body.email}'
          ) AND tm.active = 1
      `);
      res.send(result);
    } catch (error) {
      // Throw the error message on the logs
      throw error.message;
    } finally {
      // Release the connection
      await connection.release();
    }
  });

  app.post("/api/tl/teamMemberCount", async (req, res) => {
    // Create a connection to the database
    const connection = await skillsMatrixMysql.connection();

    try {
      const result = await connection.query(`
        SELECT
          COUNT(tm.tm_id) AS team_member_count
        FROM
          team_member as tm
        WHERE
          tm.team_lead = (
            SELECT
              tm2.tm_id
            FROM
              team_member tm2
            WHERE
              tm2.email = '${req.body.email}'
          )
      `);
      res.send(result);
    } catch (error) {
      // Throw the error message on the logs
      throw error.message;
    } finally {
      // Release the connection
      await connection.release();
    }
  });

  app.post("/api/tl/teamJobRoleIdealProficiencies", async (req, res) => {
    // Create a connection to the database
    const connection = await skillsMatrixMysql.connection();

    try {
      const result = await connection.query(`
        SELECT 
          ideal_proficiency.* 
        FROM 
          ideal_proficiency ideal_proficiency 
        INNER JOIN 
          (
            SELECT DISTINCT 
              team_id, 
              job_profile_id 
            FROM 
              team_member 
            WHERE 
              team_lead = 
              (
                SELECT 
                  tm_id 
                FROM 
                  team_member 
                WHERE 
                  email = '${req.body.email}'
              )
          ) tm 
        ON 
          tm.team_id = ideal_proficiency.team_id 
        AND 
          tm.job_profile_id = ideal_proficiency.job_profile_id
      `);
      res.send(result);
    } catch (error) {
      // Throw the error message on the logs
      throw error.message;
    } finally {
      // Release the connection
      await connection.release();
    }
  });

  app.post("/api/tl/teamSkillsGap", async (req, res) => {
    // Create a connection to the database
    const connection = await skillsMatrixMysql.connection();

    try {
      const result = await connection.query(`
        SELECT
          tm.tm_id,
          tm.tm_name,
          tm.team_id,
          tm.job_profile_id,
          ideal_proficiency.skill_id,
          tmp.personal_rating,
          ideal_proficiency.proficiency_id
        FROM
          team_member tm
        INNER JOIN
          ideal_proficiency ideal_proficiency
          ON tm.job_profile_id = ideal_proficiency.job_profile_id
          AND tm.team_id = ideal_proficiency.team_id
        LEFT JOIN
          team_member_proficiency tmp
          ON ideal_proficiency.skill_id = tmp.skill_id
          AND tm.tm_id = tmp.tm_id
        WHERE
          tm.team_lead = (
            SELECT
              tm_id
            FROM
              team_member
            WHERE
              email = '${req.body.email}'
          )
      `);
      res.send(result);
    } catch (error) {
      // Throw the error message on the logs
      throw error.message;
    } finally {
      // Release the connection
      await connection.release();
    }
  });

  // (SELECT
  //       proficiency_level.proficiency_desc
  //   FROM
  //       proficiency_level
  //   WHERE
  //       tmp.personal_rating = proficiency_level.proficiency_id) AS personal_ratings,
  app.post("/api/tl/proficiencyApprovalRequests", async (req, res) => {
    // Create a connection to the database
    const connection = await skillsMatrixMysql.connection();

    try {
      const result = await connection.query(`
        SELECT 
          tmp.tmp_id, 
          tm.tm_id, 
          tm.tm_name, 
          tmp.skill_id, 
          s.skill_desc, 
          tmp.personal_rating,
          tmp.years_experience, 
          tmp.andmonths_experience,
          tmp.proficiency_id, 
          CONCAT(tmp.years_experience, " yr", " "  ,tmp.andmonths_experience, " mos") AS duration_experience,
          SUBSTRING(tmp.lastused_experience, 1, 7) as lastused_experience,
          SUBSTRING(tmp.date_created, 1, 10) as date_created,
          (
            SELECT 
              pl.proficiency_desc 
            FROM 
              proficiency_level pl 
            WHERE 
              tmp.personal_rating = pl.proficiency_id
          ) personal_rating_desc, 
          (
            SELECT 
              pl.proficiency_desc 
            FROM 
              proficiency_level pl 
            WHERE 
              tmp.proficiency_id = pl.proficiency_id
          ) proficiency_id_desc 
        FROM 
          team_member tm 
          INNER JOIN team_member_proficiency tmp ON tm.tm_id = tmp.tm_id 
          INNER JOIN skill s ON s.skill_id = tmp.skill_id 
        WHERE 
          tm.team_lead = (
            SELECT 
              tm_id 
            FROM 
              team_member 
            WHERE 
              email = '${req.body.email}' 
          )
          AND tmp.approval_flag = 'P'
          ORDER BY tmp.personal_rating DESC
      `);
      res.send(result);
    } catch (error) {
      // Throw the error message on the logs
      throw error.message;
    } finally {
      // Release the connection
      await connection.release();
    }
  });
};
