const db = require("../utils/skillsMatrix-mysql.js");

module.exports = (app) => {
  app.post("/api/mgr/admin/logger", async (req, res) => {
    const connection = await db.connection();
    try {
      const sql = `INSERT INTO login_history (sid, email) VALUES (?, ?)`;
      const values = [req.body.sid, req.body.email];

      const result = await db.query(sql, values);
      res.send({ isSuccess: true, data: result });
    } catch (err) {
      res.send({ isSuccess: false, data: err });
    } finally {
      await connection.release();
    }
  });

  app.get("/api/mgr/admin/logger", async (req, res) => {
    const connection = await db.connection();
    try {
      const sql = `
        SELECT
          MAX(login_history.login_history_id) login_history_id,
          MAX(login_history.sid) sid,
          MAX(login_history.email) emails,
          MAX(login_history.login_time) login_time,
          MAX(team_member.tm_name) tm_name,
          MAX(team_member.tm_id) tm_id,
          MAX(team.manager_name) manager_name
        FROM login_history
	        INNER JOIN team_member
	          ON login_history.email = team_member.email
          INNER JOIN team
            ON team_member.team_id = team.team_id
            GROUP BY SUBSTR(login_history.login_time ,1,10), team_member.email
            ORDER BY MAX(login_history.login_time) DESC;
        `;
      const result = await db.query(sql);
      res.send({ isSuccess: true, data: result });
    } catch (err) {
      res.send({ isSuccess: false, data: err });
    } finally {
      await connection.release();
    }
  });

  app.get("/api/mgr/admin/skillset/:skill", async (req, res) => {
    const connection = await db.connection();
    try {
      const sql = `SELECT tm.tm_id, tm.tm_name, tm.email, jp.job_profile_name,
      CASE
        WHEN tmp.personal_rating = 0 THEN "No Knowledge"
        WHEN tmp.personal_rating = 1 THEN "Learning in Progress"
        WHEN tmp.personal_rating = 2 THEN "Intermediate"
        WHEN tmp.personal_rating = 3 THEN "Proficient"
        WHEN tmp.personal_rating = 4 THEN "SME"
      END AS proficiency,
      CASE
        WHEN tmp.approval_flag = "A" || tmp.approval_flag = "Y" THEN "Approved"
        WHEN tmp.approval_flag = "P" THEN "Pending"
      END AS status,
      s.skill_desc
      FROM skill s
      INNER JOIN team_member_proficiency tmp
      ON s.skill_id = tmp.skill_id
      INNER JOIN team_member tm
      ON tm.tm_id = tmp.tm_id
      INNER JOIN job_profile jp
      ON jp.job_profile_id = tm.job_profile_id
      WHERE s.skill_id IN (?) AND tmp.personal_rating IN (1,2,3,4)
      ORDER BY tmp.personal_rating DESC, tm.tm_id;`;
      const values = [req.params.skill.split(",")];
      const result = await db.query(sql, values);
      res.send({ isSuccess: true, data: result });
    } catch (err) {
      res.send({ isSuccess: false, data: err });
    } finally {
      await connection.release();
    }
  });
};
