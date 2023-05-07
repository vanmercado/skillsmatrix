import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Title from "../Title";

export default function BarCharts({ data, title }) {
  return (
    <>
      <Title>{title}</Title>
      <ResponsiveContainer width="100%" aspect={8 / 3}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 5,
            bottom: 50,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            interval={0}
            dataKey="tm_name"
            angle={40}
            dy={5}
            textAnchor="start"
            fontSize={11}
            height={200}
          />
          <YAxis
            type="number"
            domain={[0, (dataMax) => dataMax + 10]}
            fontSize={11}
            allowDecimals={false}
          />
          <Tooltip />
          <Legend height={50} />
          <Bar name="Pending Skills" dataKey="pending" fill="#8884d8" />
          <Bar name="Approved Skills" dataKey="approved" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
