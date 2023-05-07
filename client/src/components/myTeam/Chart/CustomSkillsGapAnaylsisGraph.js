import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

// const data = [
//   {
//     name: "Page A",
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: "Page B",
//     uv: -3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: "Page C",
//     uv: -2000,
//     pv: -9800,
//     amt: 2290,
//   },
//   {
//     name: "Page D",
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: "Page E",
//     uv: -1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: "Page F",
//     uv: 2390,
//     pv: -3800,
//     amt: 2500,
//   },
//   {
//     name: "Page G",
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];

export default function CustomSkillsGapAnaylsisGraph({ skillsData }) {
  return (
    <ResponsiveContainer width="100%" aspect={8 / 3}>
      <BarChart
        data={skillsData}
        // stackOffset="sign"
        margin={{
          top: 40,
          right: 30,
          left: 20,
          bottom: 10,
        }}
      >
        <XAxis
          interval={0}
          dataKey="skill_name"
          angle={40}
          dy={5}
          textAnchor="start"
          fontSize={11}
          height={200}
        />
        <YAxis
          ticks={[0, 1, 2, 3, 4]}
          type="number"
          domain={[0, 4]}
          fontSize={11}
        />

        <ReferenceLine y={0} stroke="#000" />
        <Tooltip />
        <Legend />
        <Bar
          name="Team Member Proficiency"
          dataKey="member_proficiency"
          fill="#8884d8"
        />
        <Bar
          name="Ideal Proficiency"
          dataKey="sme_proficiency"
          fill="#82ca9d"
        />
        <CartesianGrid strokeDasharray="5 5" />
      </BarChart>
    </ResponsiveContainer>
  );
}
