import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", s2p: 4200, l2c: 3800, h2r: 2100 },
  { month: "Feb", s2p: 4800, l2c: 4200, h2r: 2300 },
  { month: "Mar", s2p: 5100, l2c: 4600, h2r: 2400 },
  { month: "Apr", s2p: 4900, l2c: 5100, h2r: 2600 },
  { month: "May", s2p: 5400, l2c: 5400, h2r: 2800 },
  { month: "Jun", s2p: 5800, l2c: 5900, h2r: 3000 },
  { month: "Jul", s2p: 6200, l2c: 6300, h2r: 3100 },
  { month: "Aug", s2p: 5900, l2c: 6100, h2r: 3200 },
  { month: "Sep", s2p: 6400, l2c: 6800, h2r: 3400 },
  { month: "Oct", s2p: 6800, l2c: 7200, h2r: 3600 },
  { month: "Nov", s2p: 7100, l2c: 7600, h2r: 3800 },
  { month: "Dec", s2p: 7500, l2c: 8100, h2r: 4000 },
];

export function PerformanceChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 card-elevated">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">
            Performance Overview
          </h3>
          <p className="text-sm text-muted-foreground">
            Transaction volume by module (in thousands)
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-1" />
            <span className="text-sm text-muted-foreground">S2P</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-2" />
            <span className="text-sm text-muted-foreground">L2C</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-3" />
            <span className="text-sm text-muted-foreground">H2R</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorS2p" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(25, 60%, 25%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(25, 60%, 25%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorL2c" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorH2r" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 20%, 88%)" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(25, 15%, 45%)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(25, 15%, 45%)", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(35, 20%, 88%)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="s2p"
              stroke="hsl(25, 60%, 25%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorS2p)"
            />
            <Area
              type="monotone"
              dataKey="l2c"
              stroke="hsl(38, 92%, 50%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorL2c)"
            />
            <Area
              type="monotone"
              dataKey="h2r"
              stroke="hsl(142, 76%, 36%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorH2r)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
