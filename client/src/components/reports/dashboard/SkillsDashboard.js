import React, { useEffect, useState } from "react";

import { Box, Grid, makeStyles } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { startOfMonth, format, parseISO } from "date-fns";
import DataTable from "./DataTable";

import { useDispatch, useSelector } from "react-redux";

import { getAllTmTechInfo } from "../../../actions";
import LineCharts from "./chart/LineCharts";

const columns = [
  {
    name: "tm_id",
    label: "Workday ID",
    options: {
      filter: true,
      display: true,
    },
  },
  {
    name: "tm_name",
    label: "Name",
    options: {
      filter: true,
      display: true,
    },
  },
  {
    name: "date_created",
    label: "Date Added",
    options: {
      filter: true,
      sort: true,
      display: true,
      sortDirection: "desc",
    },
  },
  {
    name: "skill_desc",
    label: "Skill",
    options: {
      filter: true,
      display: true,
    },
  },
  {
    name: "personal_rating",
    label: "Personal Rating",
    options: {
      filter: true,
      display: true,
    },
  },
  // {
  //   name: "manager_rating",
  //   label: "Manager Rating",
  //   options: {
  //     filter: true,
  //     display: true,
  //   },
  // },
  {
    name: "manager_name",
    label: "Supervisor",
    options: {
      filter: true,
      display: true,
    },
  },
];

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const createDate = (start, end) => {
  const arr = [];
  const dt = new Date(start);

  while (dt <= end) {
    arr.push(format(new Date(dt), "yyyy-MM-dd"));
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
};

export default function SkillsDashboard() {
  const allTmTechInfo = useSelector((state) => state.getAllTmTechInfo);
  const dispatch = useDispatch();
  const classes = useStyles();

  const today = new Date();
  const [dateRange, setDateRange] = useState(1);
  const [startDate, setStartDate] = useState(startOfMonth(today));
  const [endDate, setEndDate] = useState(today);
  const data = [];

  let prior = [];
  let toSelectedDate = [];
  switch (dateRange) {
    case 1:
      prior = new Date().setDate(today.getDate() - 0);
      toSelectedDate = today;
      break;

    case 2:
      prior = new Date().setDate(today.getDate() - 1);
      toSelectedDate = today;
      break;

    case 3:
      prior = new Date().setDate(today.getDate() - 7);
      toSelectedDate = today;
      break;

    case 4:
      prior = new Date().setDate(today.getDate() - 30);
      toSelectedDate = today;
      break;

    case 5:
      prior = startOfMonth(new Date());
      toSelectedDate = today;
      break;

    case 6:
      prior = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      toSelectedDate = new Date(today.getFullYear(), today.getMonth(), 0);
      break;

    default:
      break;
  }

  const formattedPrior = new Date(prior).toDateString();

  let dates = [];
  if (dateRange === 7) {
    dates = createDate(startDate, endDate);
  } else {
    dates = createDate(formattedPrior, toSelectedDate);
  }

  const formattedData = dates.map((date) => {
    let userCount = 0;
    allTmTechInfo &&
      allTmTechInfo.forEach((item) => {
        const isDateEqual = item.date_created === date;
        if (isDateEqual) {
          userCount = userCount + 1;
          data.push({
            ...item,
            date_created: format(parseISO(item.date_created), "MMM dd, yyyy"),
          });
        }
      });
    return {
      day: format(parseISO(date), "MMM dd"),
      userCount,
      date: format(parseISO(date), "MMM dd, yyyy"),
      tag: "skills",
    };
  });

  const handleChangeStartDate = (date) => {
    setStartDate(date);
  };

  const handleChangeEndDate = (date) => {
    setEndDate(date);
  };

  const handleChangeDateRange = (event) => {
    setDateRange(event.target.value);
  };

  useEffect(() => {
    dispatch(getAllTmTechInfo());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container>
      <Grid
        container
        direction="row-reverse"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-helper-label">Range</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              label="Range"
              value={dateRange}
              onChange={handleChangeDateRange}
            >
              <MenuItem value={1}>Today</MenuItem>
              <MenuItem value={2}>Yesterday</MenuItem>
              <MenuItem value={3}>Last 7 Days</MenuItem>
              <MenuItem value={4}>Last 30 Days</MenuItem>
              <MenuItem value={5}>This Month</MenuItem>
              <MenuItem value={6}>Last Month</MenuItem>
              <MenuItem value={7}>Custom</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {dateRange === 7 ? (
          <Grid item>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Box component="span" m={3}>
                <DatePicker
                  label="From:"
                  value={startDate}
                  onChange={handleChangeStartDate}
                  format="MMMM dd, yyyy"
                  disableFuture
                  maxDate={today}
                  // minDate={addDays(toSelectedDate, -30)}
                  showTodayButton
                />
              </Box>
              <Box component="span" m={3}>
                <DatePicker
                  label="To:"
                  value={endDate}
                  onChange={handleChangeEndDate}
                  format="MMMM dd, yyyy"
                  disableFuture
                  // maxDate={addDays(fromSelectedDate, 30)}
                  minDate={startDate}
                  showTodayButton
                />
              </Box>
            </MuiPickersUtilsProvider>
          </Grid>
        ) : null}
      </Grid>
      <Grid item xs={12}>
        <LineCharts data={formattedData} title={"Skills"} />
      </Grid>
      <Grid item xs={12}>
        <DataTable data={data} columns={columns} />
      </Grid>
    </Grid>
  );
}
