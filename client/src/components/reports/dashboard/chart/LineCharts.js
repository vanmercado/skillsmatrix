import React from 'react'
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
  
import Title from "../Title";

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

export default function LineCharts({ data, title }) {
  return (
    <>
        <Title>{title}</Title>
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
            <XAxis dataKey="day" stroke="#4b286d" dx={0} dy={10}>
                <Label position="center" dy={35} style={{ textAnchor: "middle" }}>
                Date(day)
                </Label>
            </XAxis>
            <Line type="monotone" dataKey="userCount" stroke="#66CC00"/>
            <YAxis stroke="#4b286d" allowDecimals={false}>
                <Label
                angle={270}
                position="left"
                dx={10}
                style={{ textAnchor: "middle" }}
                >
                Users Count
                </Label>
            </YAxis>

            <Tooltip content={<CustomTooltip dataList={data} />} />
            {/* <Tooltip /> */}
            <CartesianGrid stroke="#e0dfdf" vertical={false}  strokeDasharray="3 3"/>
            </LineChart>
        </ResponsiveContainer>
    </>
  )
}
