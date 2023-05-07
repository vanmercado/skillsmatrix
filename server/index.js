const express = require("express");

const teamMemberRoute = require("./routes/teamMember");
const teamLeadRoute = require("./routes/teamLead");
const managerRoute = require("./routes/manager");
const loggerRoute = require("./routes/logger");

const {
  SkillsMatrixConnection,
  dbName,
} = require("./utils/skillsMatrixConnection");

const app = express();
const port = 3001;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

SkillsMatrixConnection.authenticate()
  .then(() => console.log(`Connected to ${dbName} successfully.`))
  .catch((err) => {
    throw err.message;
  });

teamMemberRoute(app);
teamLeadRoute(app);
managerRoute(app);
loggerRoute(app);

app.listen(port, () => {
  console.log(`Server side app listening on port: ${port}`);
});
