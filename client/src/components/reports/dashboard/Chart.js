import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

import Title from "./Title";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div>
        <p
          style={{ fontSize: "14px", fontWeight: "bold" }}
        >{`${payload[0].payload.date}`}</p>
        <p style={{ fontSize: "14px", lineHeight: "1px" }}>
          {`${payload[0].value} ${payload[0].payload.tag}`}
        </p>
      </div>
    );
  }

  return null;
};

export default function Chart({ data, data2, title, interval }) {
  console.log(data)
  console.log(data2)
  return (
    <>
      <Title>{title}</Title>
      {
      interval === 0 ? (
      <ResponsiveContainer width="100%" aspect={4 / 1}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 5,
            bottom: 50,
          }}
        >
          <XAxis dataKey="day" interval={interval} stroke="#4b286d" dx={0} dy={10}>
            <Label position="center" dy={35} style={{ textAnchor: "middle" }}>
              Date(day)
            </Label>
          </XAxis>
          <Line type="monotone" dataKey="userCount" stroke="#66CC00" />
          <YAxis stroke="#4b286d">
            <Label
              angle={270}
              position="left"
              dx={20}
              style={{ textAnchor: "middle" }}
            >
              Users Count
            </Label>
          </YAxis>

          <Tooltip content={<CustomTooltip dataList={data} />} />
          {/* <Tooltip /> */}
          <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
      )
      : interval === 7 ? (
        <ResponsiveContainer width="100%" aspect={4 / 1}>
        <LineChart
          data={data2}
          margin={{
            top: 5,
            right: 10,
            left: 5,
            bottom: 50,
          }}
        >
          <XAxis dataKey="day" interval={interval} stroke="#4b286d" dx={0} dy={10}>
            <Label position="center" dy={35} style={{ textAnchor: "middle" }}>
              Date(day)
            </Label>
          </XAxis>
          <Line type="monotone" dataKey="userCount" stroke="#66CC00" />
          <YAxis stroke="#4b286d">
            <Label
              angle={270}
              position="left"
              dx={20}
              style={{ textAnchor: "middle" }}
            >
              Users Count
            </Label>
          </YAxis>

          <Tooltip content={<CustomTooltip dataList={data} />} />
          {/* <Tooltip /> */}
          <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
      ) : (null)
}
    </>
  );
}
