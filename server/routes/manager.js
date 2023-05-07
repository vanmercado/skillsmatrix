// Make use of the connection pool exported from mysql
const skillsMatrixMysql = require("../utils/skillsMatrix-mysql.js");

const Skill = require("../models/skill");
const SkillCategory = require("../models/skillCategory");
const Team = require("../models/team");
const TeamMember = require("../models/teamMember");
const Users = require("../models/users");
const FaSnapshot = require("../models/faSnapshot");

// Declare association
SkillCategory.hasMany(Skill, { as: "skill", foreignKey: "skill_cat_id" });
Skill.belongsTo(SkillCategory, {
  as: "skill_category",
  foreignKey: "skill_cat_id",
});

module.exports = (app) => {
  app.get("/api/mgr/teamNames", async (req, res) => {
    Team.findAll({
      attributes: ["team_name"],
      group: ["team_name"],
      order: [["team_name", "ASC"]],
    })
      .then((result) => res.send({ isSuccess: true, data: result }))
      .catch((err) => res.send({ isSuccess: false, message: err.message }));
  });

  app.get("/api/mgr/teamLeadNames", async (req, res) => {
    Team.findAll({
      attributes: ["manager_name"],
      group: ["manager_name"],
      order: [["manager_name", "ASC"]],
    })
      .then((result) => res.send({ isSuccess: true, data: result }))
      .catch((err) => res.send({ isSuccess: false, message: err.message }));
  });

  app.post("/api/mgr/reports/resourceCountPerSkill", async (req, res) => {
    console.log(req.body.teamId);
    console.log(req.body.teamId);

    // Create a connection to the database
    const connection = await skillsMatrixMysql.connection();

    try {
      const result = await connection.query(`
        SELECT 
          skill.skill_desc,
            COUNT(skill.skill_desc) AS skill_count
        FROM skill
        INNER JOIN team_member_proficiency
          ON skill.skill_id = team_member_proficiency.skill_id
        INNER JOIN team_member
          ON team_member_proficiency.tm_id = team_member.tm_id
        INNER JOIN team
          ON team_member.team_id = team.team_id
        WHERE team.team_id = '${req.body.teamId}'
        GROUP BY skill.skill_desc
        ORDER BY skill.skill_desc    
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

  app.post("/api/mgr/reports/proficiencyCountPerSkill", async (req, res) => {
    // Create a connection to the database
    const connection = await skillsMatrixMysql.connection();

    try {
      const result = await connection.query(`
        SELECT 
            skill.skill_desc,
            SUM(IF(team_member_proficiency.personal_rating = 0,
                1,
                0)) AS no_knowledge,
            SUM(IF(team_member_proficiency.personal_rating = 1,
                1,
                0)) AS learning_in_progress,
            SUM(IF(team_member_proficiency.personal_rating = 2,
                1,
                0)) AS intermediate,
            SUM(IF(team_member_proficiency.personal_rating = 3,
                1,
                0)) AS proficient,
            SUM(IF(team_member_proficiency.personal_rating = 4,
                1,
                0)) AS subject_matter_expert,
            COUNT(team_member_proficiency.personal_rating) AS TOTAL
        FROM
            skill
                INNER JOIN
            team_member_proficiency ON skill.skill_id = team_member_proficiency.skill_id
                INNER JOIN
            team_member ON team_member_proficiency.tm_id = team_member.tm_id
                INNER JOIN
            team ON team_member.team_id = team.team_id
        WHERE
            team.team_id = '${req.body.teamId}'
        GROUP BY skill.skill_desc
        ORDER BY skill.skill_desc
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

  app.get("/api/mgr/reports/pivotGeneratorData", async (req, res) => {
    const connection = await skillsMatrixMysql.connection();

    try {
      const result = await connection.query(`
      SELECT
      team_member_proficiency.approval_flag,
        team_member_proficiency.approval_reason,
        team_member_proficiency.updated_by,
        team_member_proficiency.personal_rating,
        skill.skill_desc,
        skill_category.skill_cat_desc,
        proficiency_level.proficiency_desc,
        team_member.tm_name,
        team.team_name,
        team.manager_name,
        job_profile.job_profile_name,
        om.om_name,
        om.om_group_desc
    FROM team_member_proficiency
      INNER JOIN skill
    ON team_member_proficiency.skill_id = skill.skill_id
      INNER JOIN skill_category
    ON skill.skill_cat_id = skill_category.skill_cat_id
      INNER JOIN proficiency_level
    ON team_member_proficiency.proficiency_id = proficiency_level.proficiency_id
      INNER JOIN team_member
    ON team_member_proficiency.tm_id = team_member.tm_id
      INNER JOIN team
    ON team_member.team_id = team.team_id
      INNER JOIN job_profile
    ON team_member.job_profile_id = job_profile.job_profile_id
      INNER JOIN om
    ON team.om_id = om.om_id;
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

  app.post("/api/mgr/admin/hrta", async (req, res) => {
    Users.findOne({ where: { user_email: req.body.email } })
      .then((result) => res.send({ isSuccess: true, data: result }))
      .catch((err) => res.send({ isSuccess: false, message: err.message }));
  });

  app.get("/api/mgr/admin/skillCategories", async (req, res) => {
    const connection = await skillsMatrixMysql.connection();

    try {
      const result = await connection.query(`
        SELECT
          sc.skill_cat_id,
          skill_cat_desc,
          GROUP_CONCAT(
            DISTINCT skill_desc
            ORDER BY
              skill_desc ASC SEPARATOR ', '
          ) AS child_skills
        FROM
          skill
          RIGHT JOIN skill_category sc ON sc.skill_cat_id = skill.skill_cat_id
        GROUP BY
          skill_cat_id
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

  app.post("/api/mgr/admin/skillCategory/skills", async (req, res) => {
    SkillCategory.findAll({
      where: { skill_cat_id: req.body.skill_cat_id },
      include: {
        model: Skill,
        as: "skill",
      },
    })
      .then((result) => res.send({ isSuccess: true, data: result }))
      .catch((err) => res.send({ isSuccess: false, message: err.message }));
  });

  app.post("/api/mgr/admin/skillCategory/create", async (req, res) => {
    const newSkillCategory = SkillCategory.build(req.body);
    newSkillCategory
      .save()
      .then(() =>
        res.send({
          isSuccess: true,
          message: "Skill Category created successfully",
        })
      )
      .catch((err) => res.send({ isSuccess: false, message: err.message }));
  });

  app.put("/api/mgr/admin/skillCategory/update", async (req, res) => {
    // Check if combination of skill_cat_id and skill_id exists
    const isExisting = await SkillCategory.findOne({
      where: {
        skill_cat_id: req.body.skill_cat_id,
        skill_cat_desc: req.body.old_skill_cat_desc,
      },
    });
    // If the combination of skill_cat_id and skill_id does not exist
    if (isExisting) {
      // Proceed in updating the row
      SkillCategory.update(
        { skill_cat_desc: req.body.new_skill_cat_desc },
        {
          where: {
            skill_cat_id: req.body.skill_cat_id,
            skill_cat_desc: req.body.old_skill_cat_desc,
          },
        }
      )
        .then(() =>
          res.send({
            isSuccess: true,
            message: "Skill Category updated successfully",
          })
        )
        .catch((err) => res.send({ isSuccess: false, message: err.message }));
    }
    // No combination of skill_cat_id and skill_id exists
    else {
      res.send({
        isSuccess: false,
        message: "No combination of skill_cat_id and skill_cat_desc exists",
      });
    }
  });

  app.delete("/api/mgr/admin/skillCategory/delete", async (req, res) => {
    // Check if combination of skill_cat_id and skill_id exists
    const isExisting = await SkillCategory.findOne({
      where: {
        skill_cat_id: req.body.skill_cat_id,
        skill_cat_desc: req.body.skill_cat_desc,
      },
    });
    // If the combination of skill_cat_id and skill_id does not exist
    if (isExisting) {
      // Proceed in deleting the row
      SkillCategory.destroy({
        where: {
          skill_cat_id: req.body.skill_cat_id,
          skill_cat_desc: req.body.skill_cat_desc,
        },
      })
        .then(() =>
          res.send({
            isSuccess: true,
            message: `skill_cat_id (${req.body.skill_cat_id}) + skill_cat_desc (${req.body.skill_cat_desc}) is deleted successfully`,
          })
        )
        .catch((err) => res.send({ isSuccess: false, message: err.message }));
    }
    // No combination of skill_cat_id and skill_id exists
    else {
      res.send({
        isSuccess: false,
        message: "No combination of skill_cat_id and skill_cat_desc exists",
      });
    }
  });

  app.post("/api/mgr/admin/skill/create", async (req, res) => {
    const newSkill = Skill.build(req.body);
    newSkill
      .save()
      .then(() =>
        res.send({ isSuccess: true, message: "Skill created successfully" })
      )
      .catch((err) => res.send({ isSuccess: false, message: err.message }));
  });

  app.delete("/api/mgr/admin/skill/delete", async (req, res) => {
    // Check if combination of skill_cat_id and skill_id exists
    const isExisting = await Skill.findOne({
      where: {
        skill_cat_id: req.body.skill_cat_id,
        skill_id: req.body.skill_id,
      },
    });
    // If the combination of skill_cat_id and skill_id does not exist
    if (isExisting) {
      // Proceed in deleting the row
      Skill.destroy({
        where: {
          skill_cat_id: req.body.skill_cat_id,
          skill_id: req.body.skill_id,
        },
      })
        .then(() =>
          res.send({
            isSuccess: true,
            message: `skill_cat_id (${req.body.skill_cat_id}) + skill_id (${req.body.skill_id}) is deleted successfully`,
          })
        )
        .catch((err) => res.send({ isSuccess: false, message: err.message }));
    }
    // No combination of skill_cat_id and skill_id exists
    else {
      res.send({
        isSuccess: false,
        message: "No combination of skill_cat_id and skill_id exists",
      });
    }
  });

  app.get("/api/mgr/admin/teamMembers", async (req, res) => {
    TeamMember.findAll({
      attributes: ["tm_id", "tm_name"],
      order: [["tm_name", "ASC"]],
    })
      .then((result) => res.send({ isSuccess: true, data: result }))
      .catch((err) => res.send({ isSuccess: false, message: err.message }));
  });

  app.get("/api/mgr/admin/teams", async (req, res) => {
    Team.findAll({ order: [["team_name", "ASC"]] })
      .then((result) => res.send({ isSuccess: true, data: result }))
      .catch((err) => res.send({ isSuccess: false, message: err.message }));
  });

  app.post("/api/mgr/admin/skillsGap", async (req, res) => {
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
          AND tm.tm_id = '${req.body.tmId}'
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
          tm.tm_id = '${req.body.tmId}'
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

  app.put("/api/mgr/admin/teamSnapshot/update", async (req, res) => {
    // Check if combination of skill_cat_id and skill_id exists
    const isExisting = await Team.findOne({
      where: { team_id: req.body.teamId },
    });
    // If Team ID is existing
    if (isExisting) {
      // Proceed in updating the row
      Team.update(
        { team_desc: req.body.newTeamSnapshot },
        {
          where: { team_id: req.body.teamId },
        }
      )
        .then(() =>
          res.send({
            isSuccess: true,
            message: "Team Snapshot updated successfully",
          })
        )
        .catch((err) => res.send({ isSuccess: false, message: err.message }));
    }
    // Team ID does not exist
    else {
      res.send({ isSuccess: false, message: "Team does not exist" });
    }
  });

  app.get("/api/mgr/admin/teamJobRoleManager", async (req, res) => {
    // Create a connection to the database
    const connection = await skillsMatrixMysql.connection();

    try {
      const result = await connection.query(`
      SELECT DISTINCT
        job_profile.job_profile_id,
        job_profile.job_profile_name,
        team.team_id,
        team.team_name,
        team.manager_name
      FROM job_profile
        LEFT OUTER JOIN team
          ON team.team_id = job_profile.team_id
      ORDER BY manager_name, job_profile_name;
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

  app.post("/api/mgr/admin/teamJobRoleSkillProficiency", async (req, res) => {
    // Create a connection to the database
    const connection = await skillsMatrixMysql.connection();

    try {
      const result = await connection.query(`
      SELECT DISTINCT
      ideal_proficiency.ideal_proficiency_id,
      job_profile.job_profile_id,
      job_profile.job_profile_name,
      proficiency_level.proficiency_desc,
      team.team_id,
      team.team_name,
      team.manager_name,
      skill.skill_id,
      skill.skill_desc
   FROM job_profile
     INNER JOIN ideal_proficiency
       ON ideal_proficiency.job_profile_id = job_profile.job_profile_id
      INNER JOIN proficiency_level
       ON ideal_proficiency.proficiency_id = proficiency_level.proficiency_id
     INNER JOIN team
       ON ideal_proficiency.team_id = team.team_id
     INNER JOIN skill
       ON ideal_proficiency.skill_id = skill.skill_id
    WHERE job_profile.job_profile_id = ${req.body.jobRoleId};
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

  app.patch("/api/mgr/admin/teamJobRoleSkillProficiency", async (req, res) => {
    // Create a connection to the database
    const connection = await skillsMatrixMysql.connection();
    try {
      const result = await connection.query(`
      UPDATE ideal_proficiency
      SET 
        proficiency_id = ${req.body.proficiency_id}
      WHERE ideal_proficiency_id= ${req.body.ideal_proficiency};
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

  app.post("/api/mgr/admin/teamJobRoleIdealProficiency", async (req, res) => {
    // Create a connection to the database
    const connection = await skillsMatrixMysql.connection();
    try {
      const result = await connection.query(
        `
      INSERT INTO ideal_proficiency 
      (job_profile_id, proficiency_id, skill_id, team_id)
      VALUES (?, ?, ?, ?)
      `,
        [
          req.body.job_profile_id,
          req.body.proficiency_id,
          req.body.skill_id,
          req.body.team_id,
        ]
      );
      res.send({ isSuccess: true, data: result });
    } catch (error) {
      if (error.sqlState == "23000") {
        res.send({ isSuccess: false, data: "Duplicate Skill/Technology" });
      } else {
        res.send({ isSuccess: false, data: error.message });
      }
    } finally {
      // Release the connection
      await connection.release();
    }
  });

  app.delete("/api/mgr/admin/teamJobRoleIdealProficiency", async (req, res) => {
    const connection = await skillsMatrixMysql.connection();
    try {
      const result = await connection.query(
        `
        DELETE FROM ideal_proficiency WHERE ideal_proficiency_id = ?
      `,
        [req.body.ideal_proficiency]
      );
      res.send({ isSuccess: true, data: result });
    } catch (error) {
      // Throw the error message on the logs
      throw error.message;
    } finally {
      // Release the connection
      await connection.release();
    }
  });

  //#region SNAPSHOT
  app.put("/api/mgr/admin/faSnapshot/update", async (req, res) => {
    // Check if combination of skill_cat_id and skill_id exists
    const isExisting = await FaSnapshot.findOne({
      where: { functional_area_id: req.body.faId },
    });
    // If FA ID is existing
    if (isExisting) {
      // Proceed in updating the row
      FaSnapshot.update(
        { functional_area_desc: req.body.newFaSnapshot },
        {
          where: { functional_area_id: req.body.faId },
        }
      )
        .then(() =>
          res.send({
            isSuccess: true,
            message: "FA Snapshot updated successfully",
          })
        )
        .catch((err) => res.send({ isSuccess: false, message: err.message }));
    }
    // FA ID does not exist
    else {
      res.send({ isSuccess: false, message: "Fa does not exist" });
    }
  });

  app.get("/api/mgr/admin/fas", async (req, res) => {
    FaSnapshot.findAll({
      attributes: [
        "functional_area_id",
        "functional_area_name",
        "functional_area_desc",
      ],
      order: [["functional_area_name", "ASC"]],
    })
      .then((result) => res.send({ isSuccess: true, data: result }))
      .catch((err) => res.send({ isSuccess: false, message: err.message }));
  });

  //#endregion SNAPSHOT

  //*********START HERE */

  app.get(
    "/api/mgr/admin/getJobCategory/jobFamily/:jobFamilyId",
    async (req, res) => {
      // Create a connection to the database
      const connection = await skillsMatrixMysql.connection();
      try {
        const result = await connection.query(`
        SELECT
          DISTINCT
            job_category.job_category_id,
            job_category.job_category_name,
            job_family.job_family_id
        FROM job_family
        INNER JOIN job_profile
          ON job_family.job_family_id = job_profile.job_family_id
        INNER JOIN job_category
          ON job_profile.job_profile_id = job_category.job_profile_id
        WHERE job_family.job_family_id = ${req.params.jobFamilyId};
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
    "/api/mgr/admin/getJobFamily/jobFamily/:jobFamilyId/jobCategoryId/:jobCategoryId",
    async (req, res) => {
      // Create a connection to the database
      const connection = await skillsMatrixMysql.connection();

      try {
        const result = await connection.query(`
        SELECT
          job_family.job_family_id,
          job_category.job_category_id,
          job_profile.job_profile_id,
          job_profile.job_profile_name
        FROM job_family
        INNER JOIN job_profile
          ON job_family.job_family_id = job_profile.job_family_id
        INNER JOIN job_category
          ON job_profile.job_profile_id = job_category.job_profile_id
        WHERE job_family.job_family_id = ${req.params.jobFamilyId} AND job_category.job_category_id = ${req.params.jobCategoryId};
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
    "/api/mgr/admin/getIdealProficiency/jobFamily/:jobFamilyId/jobCategory/:jobCategoryId/jobProfile/:jobProfileId",
    async (req, res) => {
      // Create a connection to the database
      const connection = await skillsMatrixMysql.connection();

      try {
        const result = await connection.query(`
        SELECT
        ideal_proficiency.ideal_proficiency_id,
        job_family.job_family_id,
        job_family.job_family_name,
        job_profile.job_profile_id,
        job_profile.job_profile_name,
        job_category.job_category_id,
        job_category.job_category_name,
        ideal_proficiency.proficiency_id,
        proficiency_level.proficiency_desc,
        ideal_proficiency.skill_id,
        skill.skill_desc
      FROM job_family
      INNER JOIN job_profile
        ON job_family.job_family_id = job_profile.job_family_id
      INNER JOIN job_category
        ON job_profile.job_profile_id = job_category.job_profile_id
      INNER JOIN ideal_proficiency
        ON job_category.job_profile_id = ideal_proficiency.job_profile_id
      INNER JOIN skill
        ON ideal_proficiency.skill_id = skill.skill_id
      INNER JOIN proficiency_level
        ON ideal_proficiency.proficiency_id = proficiency_level.proficiency_id
      WHERE job_family.job_family_id = ${req.params.jobFamilyId}
        AND job_category.job_category_id = ${req.params.jobCategoryId}
        AND ideal_proficiency.job_profile_id = ${req.params.jobProfileId}
      ORDER BY ideal_proficiency.ideal_proficiency_id DESC
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

  // custom skill gap analysis graph data start

  app.get(
    "/api/mgr/admin/jobProfile/:jobProfile/jobCategory/:jobCategory/tmId/:tmId",
    async (req, res) => {
      // Create a connection to the database
      const connection = await skillsMatrixMysql.connection();
      console.log(req.params.jobProfile);
      console.log(req.params.tmId);
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
            WHERE
              ideal_proficiency.job_profile_id = ${req.params.jobProfile}
              AND 
              ideal_proficiency.job_category_id = ${req.params.jobCategory}
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
            WHERE tm_id = ${req.params.tmId}
          ) AS team_member_proficiency

        ON sme_ideal_proficiency.skill_id = team_member_proficiency.skill_id
        `);
        res.send({ isSuccess: true, data: result });
      } catch (error) {
        res.send({ isSuccess: false, data: error });
      } finally {
        // Release the connection
        await connection.release();
      }
    }
  );

  app.post("/api/mgr/admin/idealProficiency", async (req, res) => {
    console.log(req.body);
    //Create a connection to the database
    const connection = await skillsMatrixMysql.connection();
    try {
      const result = await connection.query(
        `
      INSERT INTO ideal_proficiency
      (job_profile_id, proficiency_id, skill_id, job_category_id)
      VALUES (?, ?, ?, ?)
      `,
        [
          req.body.jobProfileId,
          req.body.proficiencyId,
          req.body.skillId,
          req.body.jobCategoryId,
        ]
      );
      res.send({ isSuccess: true, message: "Added" });
    } catch (error) {
      if (error.sqlState == "23000") {
        res.send({ isSuccess: true, message: "Duplicate Skill" });
      } else {
        res.send({ isSuccess: false, message: error.message });
      }
    } finally {
      // Release the connection
      await connection.release();
    }
  });

  app.patch("/api/mgr/admin/idealProficiency", async (req, res) => {
    //Create a connection to the database
    const connection = await skillsMatrixMysql.connection();
    try {
      const result = await connection.query(
        `
          UPDATE ideal_proficiency
          SET
            proficiency_id = ?
          WHERE ideal_proficiency_id = ${req.body.idealProficiencyId}
        `,
        [req.body.proficiencyId]
      );
      res.send({ isSuccess: true, data: result });
    } catch (error) {
      res.send({ isSuccess: false, data: error.message });
    } finally {
      // Release the connection
      await connection.release();
    }
  });

  app.delete("/api/mgr/admin/idealProficiency", async (req, res) => {
    //Create a connection to the database

    const connection = await skillsMatrixMysql.connection();
    try {
      const result = await connection.query(
        `
          DELETE FROM ideal_proficiency
          WHERE ideal_proficiency_id = ?
        `,
        [req.body.idealProficiencyId]
      );
      res.send({ isSuccess: true, data: result });
    } catch (error) {
      res.send({ isSuccess: false, data: error.message });
    } finally {
      // Release the connection
      await connection.release();
    }
  });

  // custom skill gap analysis graph data end

  // REPORTS START
  app.get("/api/tm/getIdealSkillSet/:email", async (req, res) => {
    // Create a connection to the database
    const connection = await skillsMatrixMysql.connection();

    try {
      const result = await connection.query(`
        SELECT s.skill_id AS id, s.skill_desc AS skillname
          FROM team_member AS tm
            LEFT JOIN ideal_proficiency AS ip
              ON tm.job_profile_id = ip.job_profile_id
            LEFT JOIN skill AS s
              ON s.skill_id = ip.skill_id
          WHERE ip.job_category_id = 0 AND tm.email = '${req.params.email}' 
          ORDER BY s.skill_desc;
      `);
      res.send({ isSuccess: true, data: result });
    } catch (error) {
      res.send({ isSuccess: false, data: err });
    } finally {
      // Release the connection
      await connection.release();
    }
  });
  // ****** START Get all the TM count of skills status ******
  // Get all the TM count of skills status
  app.get("/api/mgr/getTMSkillStatusCount", async (req, res) => {
    // Create a connection to the database
    const connection = await skillsMatrixMysql.connection();

    try {
      const result = await connection.query(`
        Select
          'ALL' as tm_name,
          SUM(IF(team_member_proficiency.approval_flag = "A"|| team_member_proficiency.approval_flag = "Y", 1, 0)) AS approved,
          SUM(IF(team_member_proficiency.approval_flag = "P", 1, 0)) AS pending
        FROM
          team_member_proficiency
        JOIN
          team_member
        ON
          team_member.tm_id = team_member_proficiency.tm_id;
      `);
      res.send({ isSuccess: true, data: result });
    } catch (error) {
      res.send({ isSuccess: false, data: err });
    } finally {
      // Release the connection
      await connection.release();
    }
  });

  // Get SLT List
  app.get("/api/mgr/getSLTList", async (req, res) => {
    // Create a connection to the database
    const connection = await skillsMatrixMysql.connection();

    try {
      const result = await connection.query(`
        SELECT
          team_member.tm_id,
          team_member.tm_name,
          team_member.team_lead,
          team_member.is_role
        FROM 
          team_member	
        JOIN
          om
        on
          om.om_name = team_member.tm_name;
      `);
      res.send({ isSuccess: true, data: result });
    } catch (error) {
      res.send({ isSuccess: false, data: err });
    } finally {
      // Release the connection
      await connection.release();
    }
  });

  // Get Team Manager List with Team Leader or Member Skill Status Count
  app.get(
    "/api/mgr/skillStatusCount/getTMListBySLT/:sltId",
    async (req, res) => {
      // Create a connection to the database
      const connection = await skillsMatrixMysql.connection();

      try {
        const result = await connection.query(`
      SELECT
        team_member.tm_name,
        team_member.tm_id,
        team_member.team_lead,
        team_member.is_role,
        SUM(IF(team_member_proficiency.approval_flag = "A"|| team_member_proficiency.approval_flag = "Y", 1, 0)) AS approved,
        SUM(IF(team_member_proficiency.approval_flag = "P", 1, 0)) AS pending
      FROM
        team_member_proficiency
      RIGHT JOIN
        team_member
      ON
        team_member.tm_id = team_member_proficiency.tm_id
      WHERE
        team_member.team_lead = (Select team_member.tm_id FROM team_member WHERE team_member.tm_id = ${req.params.sltId})
      GROUP BY
        team_member.tm_id;
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

  // Get Team Leader and Member List and Skills Status Count by Team Manager
  app.get(
    "/api/mgr/skillStatusCount/getTMListBySLT/:sltId/getTMListByTM/:tmId",
    async (req, res) => {
      // Create a connection to the database
      const connection = await skillsMatrixMysql.connection();

      try {
        const result = await connection.query(`
      SELECT
        team_member.tm_name,
        team_member.tm_id,
        team_member.team_lead,
        team_member.is_role,
        SUM(IF(team_member_proficiency.approval_flag = "A"|| team_member_proficiency.approval_flag = "Y", 1, 0)) AS approved,
        SUM(IF(team_member_proficiency.approval_flag = "P", 1, 0)) AS pending
      FROM
        team_member_proficiency
      RIGHT JOIN
        team_member
      ON
        team_member.tm_id = team_member_proficiency.tm_id
      WHERE
        team_member.team_lead = (SELECT team_member.tm_id FROM team_member WHERE team_member.tm_id = ${req.params.tmId} AND team_member.team_lead = ${req.params.sltId})
      GROUP BY
        team_member.tm_id;
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

  // Get Team Leader and Member List and Skills Status Count by Team Manager
  app.get(
    "/api/mgr/getTMListByTM/:tmId/getTMListByTL/:tlId",
    async (req, res) => {
      // Create a connection to the database
      const connection = await skillsMatrixMysql.connection();

      try {
        const result = await connection.query(`
      SELECT
        team_member.tm_name,
        team_member.tm_id,
        team_member.team_lead,
        team_member.is_role,
        SUM(IF(team_member_proficiency.approval_flag = "A"|| team_member_proficiency.approval_flag = "Y", 1, 0)) AS approved,
        SUM(IF(team_member_proficiency.approval_flag = "P", 1, 0)) AS pending
      FROM
        team_member_proficiency
      RIGHT JOIN
        team_member
      ON
        team_member.tm_id = team_member_proficiency.tm_id
      WHERE
        team_member.team_lead = 
        (SELECT 
            team_member.tm_id 
          FROM 
            team_member 
          WHERE 
            team_member.tm_id = ${req.params.tlId} 
              AND 
            team_member.team_lead = ${req.params.tmId} 
        )
      GROUP BY
        team_member.tm_id;
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

  // ****** END Get all the TM count of skills status ******

  // ****** START Get the Team Member DataList of skills status ******

  // Get Team Member DataList per SLT
  app.get("/api/mgr/dataList/getTMListBySLT/:sltId", async (req, res) => {
    // Create a connection to the database
    const connection = await skillsMatrixMysql.connection();

    try {
      const result = await connection.query(`SELECT
        team_member.tm_name,
        team_member.email,
        skill.skill_desc,
        tm_lead.tm_name as team_lead,
      CASE
        WHEN team_member_proficiency.approval_flag = "A" || team_member_proficiency.approval_flag = "Y" THEN "Approved"
        WHEN team_member_proficiency.approval_flag = "P" THEN "Pending"
      END AS status
      FROM
        team_member_proficiency
      JOIN
        skill
      ON
        skill.skill_id = team_member_proficiency.skill_id
      JOIN
        team_member
      ON
        team_member.tm_id = team_member_proficiency.tm_id
      JOIN
        team_member tm_lead
      ON
        team_member.team_lead = tm_lead.tm_id
      
      WHERE
        team_member.team_lead = 
          (
          Select 
            team_member.tm_id 
          FROM 
            team_member 
          WHERE 
            team_member.tm_id = ${req.params.sltId}
        );
    `);
      res.send({ isSuccess: true, data: result });
    } catch (error) {
      res.send({ isSuccess: false, data: err });
    } finally {
      // Release the connection
      await connection.release();
    }
  });

  // Get Team Member DataList per TM
  app.get(
    "/api/mgr/dataList/getTMListBySLT/:sltId/getTMListByTM/:tmId",
    async (req, res) => {
      // Create a connection to the database
      const connection = await skillsMatrixMysql.connection();

      try {
        const result = await connection.query(`SELECT
        team_member.tm_name,
        team_member.email,
        skill.skill_desc,
        tm_lead.tm_name as team_lead,
      CASE
        WHEN team_member_proficiency.approval_flag = "A" || team_member_proficiency.approval_flag = "Y" THEN "Approved"
        WHEN team_member_proficiency.approval_flag = "P" THEN "Pending"
      END AS status
      FROM
        team_member_proficiency
      JOIN
        skill
      ON
        skill.skill_id = team_member_proficiency.skill_id
      JOIN
        team_member
      ON
        team_member.tm_id = team_member_proficiency.tm_id
      JOIN
        team_member tm_lead
      ON
        team_member.team_lead = tm_lead.tm_id
      
      WHERE
        team_member.team_lead = 
          (
          Select 
            team_member.tm_id 
          FROM 
            team_member 
          WHERE 
            team_member.tm_id = ${req.params.tmId} and team_member.team_lead = ${req.params.sltId}
        );
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

  // Get Team Member DataList per TM
  app.get(
    "/api/mgr/dataList/getTMListByTM/:tmId/getTMListByTL/:tlId",
    async (req, res) => {
      // Create a connection to the database
      const connection = await skillsMatrixMysql.connection();

      try {
        const result = await connection.query(`SELECT
        team_member.tm_name,
        team_member.email,
        skill.skill_desc,
        tm_lead.tm_name as team_lead,
      CASE
        WHEN team_member_proficiency.approval_flag = "A" || team_member_proficiency.approval_flag = "Y" THEN "Approved"
        WHEN team_member_proficiency.approval_flag = "P" THEN "Pending"
      END AS status
      FROM
        team_member_proficiency
      JOIN
        skill
      ON
        skill.skill_id = team_member_proficiency.skill_id
      JOIN
        team_member
      ON
        team_member.tm_id = team_member_proficiency.tm_id
      JOIN
        team_member tm_lead
      ON
        team_member.team_lead = tm_lead.tm_id
      
      WHERE
        team_member.team_lead = 
          (
          Select 
            team_member.tm_id 
          FROM 
            team_member 
          WHERE 
            team_member.tm_id = ${req.params.tlId} and team_member.team_lead = ${req.params.tmId}
        );
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

  // Get all the TM DataList of skills status
  app.get("/api/mgr/dataList/getTMSkillStatus", async (req, res) => {
    // Create a connection to the database
    const connection = await skillsMatrixMysql.connection();

    try {
      const result = await connection.query(`
      Select
        team_member.tm_name,
        team_member.email,
        skill.skill_desc,
        tm_lead.tm_name as team_lead,
        team_member.tm_id,
        CASE
          WHEN team_member_proficiency.personal_rating = 0 THEN "No Knowledge"
          WHEN team_member_proficiency.personal_rating = 1 THEN "Learning in Progress"
          WHEN team_member_proficiency.personal_rating = 2 THEN "Intermediate"
          WHEN team_member_proficiency.personal_rating = 3 THEN "Proficient"
          WHEN team_member_proficiency.personal_rating = 4 THEN "SME"
        END AS proficiency,
        CASE
          WHEN team_member_proficiency.approval_flag = "A" || team_member_proficiency.approval_flag = "Y" THEN "Approved"
          WHEN team_member_proficiency.approval_flag = "P" THEN "Pending"
        END AS status
        FROM
          team_member_proficiency
        JOIN
          skill
        ON
          skill.skill_id = team_member_proficiency.skill_id
        JOIN
          team_member
        ON
          team_member.tm_id = team_member_proficiency.tm_id
        JOIN
          team_member tm_lead
        ON
          team_member.team_lead = tm_lead.tm_id;
      `);
      res.send({ isSuccess: true, data: result });
    } catch (error) {
      res.send({ isSuccess: false, data: err });
    } finally {
      // Release the connection
      await connection.release();
    }
  });

  // ****** END Get the Team Member DataList of skills status ******
};
