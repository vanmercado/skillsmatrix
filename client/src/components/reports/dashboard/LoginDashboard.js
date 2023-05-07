import React, { useEffect, useState } from "react";

import { Box, Grid } from "@material-ui/core";

import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { startOfMonth, format, parseISO } from "date-fns";


import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import moment from 'moment'
import Chart from "./Chart";
import DataTable from "./DataTable";

import { useDispatch, useSelector } from "react-redux";

import { getLoginData } from "../../../actions";

const columns = [
  {
    name: "tm_name",
    label: "Name",
    options: {
      filter: true,
      display: true,
    },
  },
  {
    name: "login_time",
    label: "Date",
    options: {
      filter: true,
      sort: true,
      display: true,
      sortDirection: "desc",
    },
  },
  {
    name: "email",
    label: "Email",
    options: {
      filter: true,
      display: false,
    },
  },
];

const createDate = (start, end) => {
  const arr = []
  const dt = new Date(start);

  while (dt <= end) {
    arr.push(format(new Date(dt), "yyyy-MM-dd"));
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
};

const createDatePerWeek = (start, end) => {
  const arr = []
  const dt = new Date(start);

  while (dt <= end) {
    arr.push(format(new Date(dt), "yyyy-MM-dd"));
    dt.setDate(dt.getDate() + 7);
  }
  return arr;
};

//#region Sample Data
// const data = [
//   {
//     day: "08/01",
//     userCount: 3,
//   },
//   {
//     day: "08/02",
//     userCount: 10,
//   },
//   {
//     day: "08/03",
//     userCount: 8,
//   },
//   {
//     day: "4",
//     userCount: 2,
//   },
//   {
//     day: "5",
//     userCount: 0,
//   },
//   {
//     day: "6",
//     userCount: 8,
//   },
//   {
//     day: "7",
//     userCount: 1,
//   },
//   {
//     day: "8",
//     userCount: 0,
//   },
//   {
//     day: "9",
//     userCount: 25,
//   },
//   {
//     day: "10",
//     userCount: 3,
//   },
// ];
//#endregion Sample Data

export default function LoginDashboard() {
  const loginData = useSelector((state) => state.getLoginData);

  const dispatch = useDispatch();

  const firstDayOfMonth = startOfMonth(new Date());
  const today = new Date();
  const [fromSelectedDate, setFromSelectedDate] = useState(firstDayOfMonth);
  const [toSelectedDate, setToSelectedDate] = useState(today);

  const datesPerWeek = createDatePerWeek(fromSelectedDate, toSelectedDate);
  const dates = createDate(fromSelectedDate, toSelectedDate);
  
  const data = [];
  const data2 = [];

  const [interval, setInterval] = useState(0);
  const handleChange = (event) => {
    setInterval(event.target.value);
  };

  const formattedDataPerWeek = dates.map((date) => {
    let userCount = 0;
    loginData &&
      loginData.forEach((ldDate) => {
        const formattedLdDate = moment(ldDate.login_time).day("Sunday").format("YYYY-MM-DD")
          
        ;
        const isEqualWeek = formattedLdDate === moment(date).day("Sunday").format("YYYY-MM-DD");
        
        if (isEqualWeek) {
          userCount = userCount + 1;
          data2.push({
            ...ldDate,
            login_time: formattedLdDate,
          });
        }


      });
    return {
      day: moment(date).day("sunday").format('DD'),
      userCount,
      date: format(parseISO(date), "MMM dd, yyyy"),
      tag: "users",
    };
  });
  
  
  const formattedData = dates.map((date) => {
    let userCount = 0;
    loginData &&
      loginData.forEach((ldDate) => {
        const formattedLdDate = format(
          parseISO(ldDate.login_time),
          "yyyy-MM-dd"
        );
        const isEqual = formattedLdDate === date;
        
        if (isEqual) {
          userCount = userCount + 1;
          data.push({
            ...ldDate,
            login_time: format(parseISO(ldDate.login_time), "MMM dd, yyyy"),
          });
        }


      });
    return {
      day: format(parseISO(date), "dd"),
      userCount,
      date: format(parseISO(date), "MMM dd, yyyy"),
      tag: "users",
    };
  });

  const handleFromSelectedDate = (date) => {
    setFromSelectedDate(date);
  };

  const handleToSelectedDate = (date) => {
    setToSelectedDate(date);
  };

  useEffect(() => {
    dispatch(getLoginData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Box component="span" m={3}>
            <DatePicker
              label="From:"
              value={fromSelectedDate}
              onChange={handleFromSelectedDate}
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
              value={toSelectedDate}
              onChange={handleToSelectedDate}
              format="MMMM dd, yyyy"
              disableFuture
              // maxDate={addDays(fromSelectedDate, 30)}
              minDate={fromSelectedDate}
              showTodayButton
            />
          </Box>
        </MuiPickersUtilsProvider>
      </Grid>
      <Grid>
      <FormControl>
        <InputLabel id="demo-simple-select-label">group by</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={interval}
          onChange={handleChange}
        >
          <MenuItem value={0}>day</MenuItem>
          <MenuItem value={7}>week</MenuItem>
          
        </Select>
      </FormControl>
      </Grid>

      <Grid item xs={12}>
        <Chart data={formattedData} data2={formattedDataPerWeek} title={"Active Users"} interval={interval}/>
      </Grid>
      <Grid item xs={12}>
        <DataTable data={data} columns={columns} />
      </Grid>
    </Grid>
  );
}
