// Make use of the connection pool exported from mysql
const careerCityMysql = require("../utils/careerCity-mysql.js");
const skillsMatrixMysql = require("../utils/skillsMatrix-mysql.js");

const Team = require("../models/team");
const TeamMember = require("../models/teamMember");
const TeamMemberProficiency = require("../models/teamMemberProficiency");
const Skill = require("../models/skill");
const ProficiencyLevel = require("../models/proficiencyLevel");
const JobRole = require("../models/jobRole");
const FaSnapshot = require("../models/faSnapshot");

const { Op } = require("sequelize");

module.exports = (app) => {
  app.post("/api/tm/info", async (req, res) => {
    const { email, tm_id } = req.body;
    const option = !tm_id ? { email } : { tm_id };
    TeamMember.findOne({ where: option })
      .then((result) => res.send({ isSuccess: true, data: result }))
      .catch((err) => res.send({ isSuccess: false, message: err.message }));
  });

  app.post("/api/tm/techInfo", async (req, res) => {
    // Create a connection to the database
    const connection = await skillsMatrixMysql.connection();

    try {
      const result = await connection.query(`
      SELECT 
      (SELECT 
              proficiency_level.proficiency_desc
          FROM
              proficiency_level
          WHERE
              team_member_proficiency.personal_rating = proficiency_level.proficiency_id) AS personal_rating,
      (SELECT 
              proficiency_level.proficiency_desc
          FROM
              proficiency_level
          WHERE
              team_member_proficiency.proficiency_id = proficiency_level.proficiency_id) AS manager_rating,
      (SELECT 
              team_member.tm_name
          FROM
              team_member
          WHERE
              team_member_proficiency.updated_by = team_member.tm_id) AS updated_by,
      (SELECT 
              team_member.tm_name
          FROM
              team_member
          WHERE
              team_member_proficiency.created_by = team_member.tm_id) AS created_by,
      (SELECT 
              team_member.tm_name
          FROM
              team_member
          WHERE
              team_member_proficiency.approved_by = team_member.tm_id) AS approved_by,
      SUBSTRING(team_member_proficiency.lastused_experience, 1, 7) as lastused_experience,
      SUBSTRING(team_member_proficiency.date_approved,
          1,
          10) AS date_approved,
      SUBSTRING(team_member_proficiency.date_created,
          1,
          10) AS date_created,
      SUBSTRING(team_member_proficiency.date_updated,
          1,
          10) AS date_updated,
          CASE
          WHEN team_member_proficiency.approval_flag = "A" || team_member_proficiency.approval_flag = "Y" THEN "Approved"
          WHEN team_member_proficiency.approval_flag = "P" THEN "Pending"
          WHEN team_member_proficiency.approval_flag = "S" THEN "Send Back"
        END AS status,
      team_member_proficiency.approval_reason,
      CONCAT(team_member_proficiency.years_experience, " yr", " "  ,team_member_proficiency.andmonths_experience, " mos") AS duration_experience, 
      team_member_proficiency.years_experience,
      team_member_proficiency.andmonths_experience,
      team_member.email,
      team_member.tm_name,
      job_profile.job_profile_name,
      team.manager_name,
      team.team_name,
      om.om_name,
      om.om_group_desc,
      skill.skill_desc,
      skill_category.skill_cat_desc,
      team_member_proficiency.tmp_id
  FROM
      team_member_proficiency
          INNER JOIN
      team_member ON team_member_proficiency.tm_id = team_member.tm_id
          INNER JOIN
      job_profile ON team_member.job_profile_id = job_profile.job_profile_id
          INNER JOIN
      team ON team_member.team_id = team.team_id
          INNER JOIN
      om ON team.om_id = om.om_id
          INNER JOIN
      skill ON team_member_proficiency.skill_id = skill.skill_id
          INNER JOIN
      skill_category ON skill.skill_cat_id = skill_category.skill_cat_id
  WHERE team_member.email = '${req.body.email}'`);
      res.send(result);
    } catch (error) {
      // Throw the error message on the logs
      throw error.message;
    } finally {
      // Release the connection
      await connection.release();
    }
  });

  app.post("/api/tm/position", async (req, res) => {
    // Create a connection to the database

    // const connection = await careerCityMysql.connection();
    const connection = await skillsMatrixMysql.connection();
    try {
      const result = await connection.query(`
        SELECT job_level FROM tm_job_details WHERE primary_work_email = '${req.body.email}'
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

  app.post("/api/tm/tids/info", async (req, res) => {
    TeamMember.findOne({ where: { email: req.body.email } })
      .then((result) => res.send({ isSuccess: true, data: result }))
      .catch((err) => res.send({ isSuccess: false, message: err.message }));
  });

  app.post("/api/tm/teamAssoc", async (req, res) => {
    // Create a connection to the database
    const connection = await skillsMatrixMysql.connection();

    try {
      const result = await connection.query(`
        SELECT 
          jr.job_profile_name, 
          t.team_name, 
          t.manager_name, 
          o.om_group_desc, 
          o.om_name, 
          (
            SELECT 
              team_member.tm_name 
            FROM 
              team_member 
            WHERE 
              team_member.tm_id = tm.team_lead
          ) as immediate_supervisor 
        FROM 
          team_member as tm, 
          job_profile as jr, 
          team as t, 
          om as o 
        WHERE 
          jr.job_profile_id = tm.job_profile_id 
          AND t.team_id = tm.team_id 
          AND o.om_id = t.om_id 
          AND tm.email = '${req.body.email}'
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

  app.post("/api/tm/skills", async (req, res) => {
    Skill.findAll({
      where: {
        skill_id: {
          [Op.in]: req.body.skillIds,
        },
      },
    })
      .then((result) => res.send(result))
      .catch((err) => res.send({ isSuccess: false, message: err.message }));
  });

  app.get("/api/tm/skills", async (req, res) => {
    Skill.findAll({ order: [["skill_desc", "ASC"]] })
      .then((result) => res.send({ isSuccess: true, data: result }))
      .catch((err) => res.send({ isSuccess: false, message: err.message }));
  });

  app.post("/api/tm/jobRoles", async (req, res) => {
    JobRole.findAll({
      where: {
        job_profile_id: {
          [Op.in]: req.body.jobRoleIds,
        },
      },
    })
      .then((result) => res.send(result))
      .catch((err) => res.send({ isSuccess: false, message: err.message }));
  });

  app.get("/api/tm/proficiencies", async (req, res) => {
    ProficiencyLevel.findAll()
      .then((result) => res.send({ isSuccess: true, data: result }))
      .catch((err) => res.send({ isSuccess: false, message: err.message }));
  });

  app.post("/api/tm/proficiency/create", async (req, res) => {
    const newProficiency = TeamMemberProficiency.build(req.body);
    newProficiency
      .save()
      .then(() =>
        res.send({
          isSuccess: true,
          message: "Proficiency created successfully",
        })
      )
      .catch((err) => {
        if (err.parent.sqlState === "23000") {
          res.send({ isSuccess: false, message: "Duplicate Skill/Technology" });
        } else {
          res.send({ isSuccess: false, message: err.message });
        }
      });
  });

  app.put("/api/tm/proficiency/update", async (req, res) => {
    // Check if combination of tm_id and skill_id exists
    const options = req.body.tmp_id
      ? { where: { tmp_id: req.body.tmp_id } }
      : { where: { tm_id: req.body.tm_id, skill_id: req.body.skill_id } };
    const proficiency = await TeamMemberProficiency.findOne(options);
    // If the combination of tm_id and skill_id does not exist
    if (proficiency) {
      // Proceed in updating the row
      Object.keys(req.body).forEach((field) => {
        if (req.body[field] != proficiency[field]) {
          proficiency[field] = req.body[field];
        }
      });
      proficiency
        .save()
        .then(() =>
          res.send({
            isSuccess: true,
            message: "Proficiency updated successfully",
          })
        )
        .catch((err) => res.send({ isSuccess: false, message: err.message }));
    }
    // No combination of tm_id and skill_id exists
    else {
      res.send({
        isSuccess: false,
        message: "No combination of tm_id and skill_id exists",
      });
    }
  });

  app.delete("/api/tm/proficiency/delete", async (req, res) => {
    // Check if combination of tm_id and skill_id exists
    const isExisting = await TeamMemberProficiency.findOne({
      where: { tm_id: req.body.tm_id, skill_id: req.body.skill_id },
    });
    // If the combination of tm_id and skill_id does not exist
    if (isExisting) {
      // Proceed in deleting the row
      TeamMemberProficiency.destroy({
        where: { tm_id: req.body.tm_id, skill_id: req.body.skill_id },
      })
        .then(() =>
          res.send({
            isSuccess: true,
            message: `tm_id (${req.body.tm_id}) + skill_id (${req.body.skill_id}) is deleted successfully`,
          })
        )
        .catch((err) => res.send({ isSuccess: false, message: err.message }));
    }
    // No combination of tm_id and skill_id exists
    else {
      res.send({
        isSuccess: false,
        message: "No combination of tm_id and skill_id exists",
      });
    }
  });

  app.post("/api/tm/jobRoles/currentTeam", async (req, res) => {
    JobRole.findAll({
      where: { team_id: req.body.teamId },
      order: [["job_profile_name", "ASC"]],
    })
      .then((result) => res.send({ isSuccess: true, data: result }))
      .catch((err) => res.send({ isSuccess: false, message: err.message }));
  });

  app.post("/api/tm/skillsGap/currentTeam/currentRole", async (req, res) => {
    // Create a connection to the database
    const connection = await skillsMatrixMysql.connection();

    try {
      const result = await connection.query(`
        SELECT
          tm.tm_id,
          tm.tm_name,
          tm.job_profile_id,
          skill.skill_desc,
          tmp.proficiency_id AS manager_rating,
          ideal_proficiency.proficiency_id AS ideal_rating
        FROM
          team_member tm,
          ideal_proficiency ideal_proficiency,
          team_member_proficiency tmp,
          skill
        WHERE
          tm.tm_id = tmp.tm_id
          AND tmp.skill_id = skill.skill_id
          AND tm.team_id = ideal_proficiency.team_id
          AND ideal_proficiency.skill_id = tmp.skill_id
          AND ideal_proficiency.job_profile_id = tm.job_profile_id
          AND tm.email = '${req.body.email}'
        UNION
        SELECT
          tm.tm_id,
          tm.tm_name,
          tm.job_profile_id,
          skill.skill_desc,
          tmp.proficiency_id AS manager_rating,
          ideal_proficiency.proficiency_id AS ideal_rating
        FROM
          team_member tm
        INNER JOIN
          ideal_proficiency ideal_proficiency
          ON tm.job_profile_id = ideal_proficiency.job_profile_id
          AND tm.team_id = ideal_proficiency.team_id
        LEFT JOIN
          skill
          ON ideal_proficiency.skill_id = skill.skill_id
        LEFT JOIN
          team_member_proficiency tmp
          ON tm.tm_id = tmp.tm_id
          AND ideal_proficiency.skill_id = tmp.skill_id
        WHERE
          tm.email = '${req.body.email}'
      `);
      res.send({ isSuccess: true, data: result });
    } catch (error) {
      // Throw the error message on the logs
      throw error.message;
    } finally {
      // Release the connection
      await connection.release();
    }
  });

  app.post("/api/tm/skillsGap/currentTeam/selectedRole", async (req, res) => {
    // Create a connection to the database
    const connection = await skillsMatrixMysql.connection();

    try {
      const result = await connection.query(`
        SELECT
          tm.tm_id,
          tm.tm_name,
          tm.job_profile_id,
          skill.skill_desc,
          tmp.proficiency_id AS manager_rating,
          ideal_proficiency.proficiency_id AS ideal_rating
        FROM
          team_member tm,
          ideal_proficiency ideal_proficiency,
          team_member_proficiency tmp,
          skill
        WHERE
          tm.tm_id = tmp.tm_id
          AND tmp.skill_id = skill.skill_id
          AND ideal_proficiency.team_id = '${req.body.teamId}'
          AND ideal_proficiency.skill_id = tmp.skill_id
          AND ideal_proficiency.job_profile_id = '${req.body.jobRoleId}'
          AND tm.email = '${req.body.email}'
        UNION
        SELECT
          tm.tm_id,
          tm.tm_name,
          tm.job_profile_id,
          skill.skill_desc,
          tmp.proficiency_id AS manager_rating,
          ideal_proficiency.proficiency_id AS ideal_rating
        FROM
          team_member tm
        INNER JOIN
          ideal_proficiency ideal_proficiency
          ON ideal_proficiency.job_profile_id = '${req.body.jobRoleId}'
          AND ideal_proficiency.team_id = '${req.body.teamId}'
        LEFT JOIN
          skill
          ON ideal_proficiency.skill_id = skill.skill_id
        LEFT JOIN
          team_member_proficiency tmp
          ON tm.tm_id = tmp.tm_id
          AND ideal_proficiency.skill_id = tmp.skill_id
        WHERE
          tm.email = '${req.body.email}'
      `);
      res.send({ isSuccess: true, data: result });
    } catch (error) {
      // Throw the error message on the logs
      throw error.message;
    } finally {
      // Release the connection
      await connection.release();
    }
  });

  app.post("/api/tm/team/snapshot", async (req, res) => {
    Team.findOne({ where: { team_id: req.body.teamId } })
      .then((result) => res.send({ isSuccess: true, data: result }))
      .catch((err) => res.send({ isSuccess: false, message: err.message }));
  });

  app.post("/api/tm/fa/snapshot", async (req, res) => {
    FaSnapshot.findOne({ where: { functional_area_id: req.body.faId } })
      .then((result) => res.send({ isSuccess: true, data: result }))
      .catch((err) => res.send({ isSuccess: false, message: err.message }));
  });

  app.get("/api/tm/allTechInfo", async (req, res) => {
    // Create a connection to the database
    const connection = await skillsMatrixMysql.connection();

    try {
      const result = await connection.query(`
      SELECT 
      (SELECT 
              proficiency_level.proficiency_desc
          FROM
              proficiency_level
          WHERE
              team_member_proficiency.personal_rating = proficiency_level.proficiency_id) AS personal_rating,
      (SELECT 
              proficiency_level.proficiency_desc
          FROM
              proficiency_level
          WHERE
              team_member_proficiency.proficiency_id = proficiency_level.proficiency_id) AS manager_rating,
      (SELECT 
              team_member.tm_name
          FROM
              team_member
          WHERE
              team_member_proficiency.updated_by = team_member.tm_id) AS updated_by,
      (SELECT 
              team_member.tm_name
          FROM
              team_member
          WHERE
              team_member_proficiency.created_by = team_member.tm_id) AS created_by,
      (SELECT 
              team_member.tm_name
          FROM
              team_member
          WHERE
              team_member_proficiency.approved_by = team_member.tm_id) AS approved_by,
      SUBSTRING(team_member_proficiency.date_approved,
          1,
          10) AS date_approved,
      SUBSTRING(team_member_proficiency.date_created,
          1,
          10) AS date_created,
      SUBSTRING(team_member_proficiency.date_updated,
          1,
          10) AS date_updated,
          CASE
          WHEN team_member_proficiency.approval_flag = "A" || team_member_proficiency.approval_flag = "Y" THEN "Approved"
          WHEN team_member_proficiency.approval_flag = "P" THEN "Pending"
          WHEN team_member_proficiency.approval_flag = "S" THEN "Send Back"
        END AS status,
      team_member_proficiency.approval_reason,
      CONCAT(team_member_proficiency.years_experience, " yrs", " "  ,team_member_proficiency.andmonths_experience, " mos") AS duration_experience,   
      team_member_proficiency.lastused_experience,
      team_member_proficiency.years_experience,
      team_member_proficiency.andmonths_experience,
      team_member.email,
      team_member.tm_name,
      team_member.tm_id,
      job_profile.job_profile_name,
      team.manager_name,
      team.team_name,
      om.om_name,
      om.om_group_desc,
      skill.skill_desc,
      skill_category.skill_cat_desc
  FROM
      team_member_proficiency
          INNER JOIN
      team_member ON team_member_proficiency.tm_id = team_member.tm_id
          INNER JOIN
      job_profile ON team_member.job_profile_id = job_profile.job_profile_id
          INNER JOIN
      team ON team_member.team_id = team.team_id
          INNER JOIN
      om ON team.om_id = om.om_id
          INNER JOIN
      skill ON team_member_proficiency.skill_id = skill.skill_id
          INNER JOIN
      skill_category ON skill.skill_cat_id = skill_category.skill_cat_id
      ORDER BY team_member_proficiency.personal_rating DESC`);
      res.send({ isSuccess: true, data: result });
    } catch (error) {
      res.send({ isSuccess: false, data: err });
    } finally {
      // Release the connection
      await connection.release();
    }
  });

  //*********START HERE

  app.get("/api/tm/getJobFamily", async (req, res) => {
    // Create a connection to the database
    const connection = await skillsMatrixMysql.connection();

    try {
      const result = await connection.query(`
        SELECT * FROM job_family;
      `);
      res.send({ isSuccess: true, data: result });
    } catch (error) {
      res.send({ isSuccess: false, data: err });
    } finally {
      // Release the connection
      await connection.release();
    }
  });

  app.get("/api/tm/getJobLevel/jobFamilyId/:jobFamilyId", async (req, res) => {
    // Create a connection to the database
    const connection = await skillsMatrixMysql.connection();

    try {
      const result = await connection.query(`
      SELECT DISTINCT job_level, job_family_id FROM job_profile WHERE job_family_id = ${req.params.jobFamilyId}
      `);
      res.send({ isSuccess: true, data: result });
    } catch (error) {
      res.send({ isSuccess: false, data: err });
    } finally {
      // Release the connection
      await connection.release();
    }
  });

  app.get(
    "/api/tm/getJobProfile/jobFamilyId/:jobFamilyId/jobLevel/:jobLevel",
    async (req, res) => {
      // Create a connection to the database
      const connection = await skillsMatrixMysql.connection();
      try {
        const result = await connection.query(`
        SELECT * FROM job_profile 
        WHERE job_family_id = ${req.params.jobFamilyId} AND job_level = '${req.params.jobLevel}'
      `);
        res.send({ isSuccess: true, data: result });
      } catch (error) {
        res.send({ isSuccess: false, data: err });
      } finally {
        // Release the connection
        await connection.release();
      }
    }
  );

  app.get(
    "/api/tm/getJobProfile/jobProfileId/:jobProfileId",
    async (req, res) => {
      // Create a connection to the database
      const connection = await skillsMatrixMysql.connection();

      try {
        const result = await connection.query(`
        SELECT * FROM job_category
        WHERE job_profile_id = ${req.params.jobProfileId}
      `);
        res.send({ isSuccess: true, data: result });
      } catch (error) {
        res.send({ isSuccess: false, data: err });
      } finally {
        // Release the connection
        await connection.release();
      }
    }
  );

  app.get(
    "/api/tm/getJobProfile/jobProfileId/:jobProfileId/jobCategoryId/:jobCategoryId/teamMemberId/:teamMemberId",
    async (req, res) => {
      // Create a connection to the database
      const connection = await skillsMatrixMysql.connection();
      console.log(req.params);
      try {
        const result = await connection.query(`
      SELECT 
        sme_ideal_proficiency.sme_proficiency,
        sme_ideal_proficiency.skill_name,
      CASE WHEN manager_rating IS NULL THEN 0 ELSE manager_rating 
          END AS member_proficiency,
      CASE WHEN proficiency_desc IS NULL THEN "No Knowledge" ELSE proficiency_desc 
          END AS proficiency_desc,
        sme_ideal_proficiency.job_profile_id,
          sme_ideal_proficiency.job_category_id
      FROM (
          SELECT
            ideal_proficiency.skill_id,
            ideal_proficiency.proficiency_id AS sme_proficiency,
                  ideal_proficiency.job_category_id,
                  ideal_proficiency.job_profile_id,
            skill.skill_desc AS skill_name
          FROM ideal_proficiency
          INNER JOIN skill
            ON ideal_proficiency.skill_id = skill.skill_id
          WHERE (ideal_proficiency.job_profile_id = ${req.params.jobProfileId} 
            AND ideal_proficiency.job_category_id IN(0, IFNULL(${req.params.jobCategoryId}, 0)))
        ) AS sme_ideal_proficiency
      
      LEFT JOIN (
          SELECT
            team_member_proficiency.skill_id,
            team_member_proficiency.proficiency_id AS manager_rating,
            skill.skill_desc AS skill_name,
            proficiency_level.proficiency_desc
          FROM team_member_proficiency
          INNER JOIN skill
            ON team_member_proficiency.skill_id = skill.skill_id
          INNER JOIN proficiency_level
            ON team_member_proficiency.proficiency_id = proficiency_level.proficiency_id
          WHERE tm_id = ${req.params.teamMemberId}
        ) AS team_member_proficiency
          
      ON sme_ideal_proficiency.skill_id = team_member_proficiency.skill_id
      `);
        res.send({ isSuccess: true, data: result });
      } catch (error) {
        res.send({ isSuccess: false, data: err });
      } finally {
        // Release the connection
        await connection.release();
      }
    }
  );

  app.delete("/api/tm/delete/:email/:tmp_id", async (req, res) => {
    const connection = await skillsMatrixMysql.connection();
    try {
      const sql = `DELETE FROM team_member_proficiency 
      WHERE tm_id = (SELECT tm_id FROM team_member WHERE email = ?)
      AND tmp_id IN (?);`;
      const values = [req.params.email, req.params.tmp_id.split(",")];
      const result = await skillsMatrixMysql.query(sql, values);
      res.send({ isSuccess: true, data: result });
    } catch (err) {
      res.send({ isSuccess: false, data: err });
    } finally {
      await connection.release();
    }
  });

  app.put("/api/tm/bulk/update/:personal_rating/:tmp_id", async (req, res) => {
    const connection = await skillsMatrixMysql.connection();
    try {
      const sql = `UPDATE team_member_proficiency SET proficiency_id = null, approval_flag = 'P', 
      date_updated = NOW(), updated_by = created_by, date_approved = null, approved_by = '',
      personal_rating = ?
      WHERE tmp_id = ?`;
      const values = [req.params.personal_rating, req.params.tmp_id];
      const result = await skillsMatrixMysql.query(sql, values);
      res.send({ isSuccess: true, data: result });
    } catch (err) {
      res.send({ isSuccess: false, data: err });
    } finally {
      await connection.release();
    }
  });
};
