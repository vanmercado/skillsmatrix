//#region Import components
// React components
import React, { useState, useEffect } from "react";

// Material UI components
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import InputLabel from "@material-ui/core/InputLabel";

// Common utils and actions
import axios from "axios";
//#endregion

function IdealSkillSet(props) {
  const [idealSkillSet, setIdealSkillSet] = useState({});
  const email = props.email;

  useEffect(() => {
    if (props != null) {
      axios
        .get(`/api/tm/getIdealSkillSet/${email}`)
        .then(({ data }) => setIdealSkillSet([...data.data]));
    } else {
      setIdealSkillSet(email);
    
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <List
      style={{
        overflow: "auto",
        maxHeight: 200,
      }}
    >
      {idealSkillSet.length > 0 ? (idealSkillSet.map((skill) => (
        <ListItem>
          <ListItemText primary={`${skill.skillname}`} />
        </ListItem>
      ))) : <InputLabel htmlFor="idealSkillSetRemarks">Nothing to display...</InputLabel>}
    </List>
  );
}

export default IdealSkillSet;
