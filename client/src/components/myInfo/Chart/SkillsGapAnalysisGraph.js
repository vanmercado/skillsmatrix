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

export default function SkillsGapAnaylsisGraph({ skillsData }) {
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
        {/* verticalAlign="top" */}
        <Legend height={50} />
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
