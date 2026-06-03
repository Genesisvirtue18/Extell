import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area } from 'recharts';

export default function RuntimeChart({ data }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-lg border">
          <p className="font-medium text-gray-900 mb-1 text-sm sm:text-base">{label} Watts</p>
          <p className="text-red-600 font-semibold text-sm sm:text-base">{payload[0].value} minutes runtime</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[350px] sm:h-[400px] md:h-[450px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="loadWatts"
            label={{
              value: 'Load (Watts)',
              position: 'insideBottom',
              offset: -5,
              className: 'text-xs sm:text-sm fill-gray-600 font-medium',
              fontSize: 12
            }}
            tick={{ fontSize: 11, dy: 5 }}
            tickLine={false}
            axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
            height={50}
            minTickGap={15}
            interval="preserveStartEnd"
          />
          <YAxis
            label={{
              value: 'Runtime (Minutes)',
              angle: -90,
              position: 'insideLeft',
              offset: 15,
              className: 'text-xs sm:text-sm fill-gray-600 font-medium',
              fontSize: 12
            }}
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: 'none' }} />
          <Legend
            verticalAlign="top"
            height={30}
            wrapperStyle={{ fontSize: '12px', paddingBottom: '5px', paddingTop: '5px' }}
            formatter={() => <span className="text-xs sm:text-sm font-medium">Runtime Curve</span>}
          />
          <defs>
            <linearGradient id="colorRuntime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="runtimeMinutes" stroke="transparent" fill="url(#colorRuntime)" fillOpacity={0.3} />
          <Line
            type="monotone"
            dataKey="runtimeMinutes"
            stroke="#dc2626"
            strokeWidth={2.5}
            dot={{ stroke: '#dc2626', strokeWidth: 2, r: 3.5 }}
            activeDot={{ r: 5, strokeWidth: 0, fill: '#dc2626' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
