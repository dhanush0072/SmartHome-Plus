import { useState } from "react"
import {
  Zap,
  TrendingDown,
  TrendingUp,
  Leaf,
  DollarSign,
  Lightbulb,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts"

const dailyData = [
  { time: "12am", kw: 0.8 },
  { time: "2am", kw: 0.6 },
  { time: "4am", kw: 0.5 },
  { time: "6am", kw: 1.2 },
  { time: "8am", kw: 2.4 },
  { time: "10am", kw: 2.1 },
  { time: "12pm", kw: 2.8 },
  { time: "2pm", kw: 3.1 },
  { time: "4pm", kw: 2.9 },
  { time: "6pm", kw: 3.5 },
  { time: "8pm", kw: 2.8 },
  { time: "10pm", kw: 1.9 },
]

const weeklyData = [
  { day: "Mon", kwh: 18.4 },
  { day: "Tue", kwh: 22.1 },
  { day: "Wed", kwh: 19.8 },
  { day: "Thu", kwh: 17.2 },
  { day: "Fri", kwh: 23.5 },
  { day: "Sat", kwh: 28.1 },
  { day: "Sun", kwh: 20.4 },
]

const monthlyData = [
  { month: "Jan", kwh: 520 },
  { month: "Feb", kwh: 490 },
  { month: "Mar", kwh: 460 },
  { month: "Apr", kwh: 430 },
  { month: "May", kwh: 480 },
  { month: "Jun", kwh: 550 },
  { month: "Jul", kwh: 580 },
  { month: "Aug", kwh: 540 },
  { month: "Sep", kwh: 470 },
  { month: "Oct", kwh: 420 },
  { month: "Nov", kwh: 460 },
  { month: "Dec", kwh: 510 },
]

const deviceConsumption = [
  { name: "AC", value: 38, color: "#007AFF" },
  { name: "Water Heater", value: 22, color: "#FF9F0A" },
  { name: "Refrigerator", value: 14, color: "#34C759" },
  { name: "Lighting", value: 12, color: "#5AC8FA" },
  { name: "Other", value: 14, color: "#AF52DE" },
]

const recommendations = [
  { icon: "🌡️", title: "Raise AC by 2°C", saving: "₹180/month", impact: "high" },
  {
    icon: "💡",
    title: "Switch to LED bulbs",
    saving: "₹90/month",
    impact: "medium",
  },
  {
    icon: "⏰",
    title: "Schedule water heater",
    saving: "₹240/month",
    impact: "high",
  },
  {
    icon: "🌙",
    title: "Enable sleep mode overnight",
    saving: "₹60/month",
    impact: "low",
  },
]

export default function Energy() {
  const [period, setPeriod] = useState<"day" | "week" | "month">("day")

  const chartData =
    period === "day" ? dailyData : period === "week" ? weeklyData : monthlyData
  const xKey = period === "day" ? "time" : period === "week" ? "day" : "month"
  const yKey = period === "day" ? "kw" : "kwh"

  return (
    <div
      className="energy-page readable-energy"
      style={{ padding: 32, minHeight: "100%" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#1D1D1F",
              margin: "0 0 6px",
              letterSpacing: "-0.8px",
            }}
          >
            Energy
          </h1>
          <p style={{ fontSize: 14, color: "#6E6E73", margin: 0 }}>
            Saved ₹1,840 this month · 127 kWh less than last month
          </p>
        </div>
        <div className="segmented-control">
          {(["day", "week", "month"] as const).map((p) => (
            <button
              key={p}
              type="button"
              className={period === p ? "active" : ""}
              onClick={() => setPeriod(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div
        className="energy-kpi-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {[
          {
            label: "Today's Usage",
            value: "18.4 kWh",
            sub: "↓ 12% vs yesterday",
            icon: <Zap size={18} />,
            color: "#007AFF",
            trend: "down",
          },
          {
            label: "Monthly Cost",
            value: "₹2,460",
            sub: "↓ ₹380 savings",
            icon: <DollarSign size={18} />,
            color: "#34C759",
            trend: "down",
          },
          {
            label: "Carbon Footprint",
            value: "14.7 kg",
            sub: "↑ 2.3 kg CO₂ today",
            icon: <Leaf size={18} />,
            color: "#34C759",
            trend: "up",
          },
          {
            label: "Peak Demand",
            value: "3.5 kW",
            sub: "At 6:00 PM",
            icon: <TrendingUp size={18} />,
            color: "#FF9F0A",
            trend: "neutral",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="glass-card dashboard-status-card"
            style={{ padding: "20px 22px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: s.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                {s.icon}
              </div>
              {s.trend === "down" ? (
                <TrendingDown size={14} color="#34C759" />
              ) : s.trend === "up" ? (
                <TrendingUp size={14} color="#FF3B30" />
              ) : null}
            </div>
            <p
              style={{
                fontSize: 12,
                color: "#6E6E73",
                margin: "0 0 4px",
                fontWeight: 500,
              }}
            >
              {s.label}
            </p>
            <p
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#1D1D1F",
                margin: "0 0 4px",
                letterSpacing: "-0.5px",
              }}
            >
              {s.value}
            </p>
            <p style={{ fontSize: 12, color: "#6E6E73", margin: 0 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Main chart + pie */}
      <div
        className="energy-chart-grid"
        style={{ display: "grid", gap: 20, marginBottom: 20 }}
      >
        <div className="glass-card dashboard-card" style={{ padding: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h2
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#1D1D1F",
                margin: 0,
              }}
            >
              {period === "day"
                ? "Daily Usage"
                : period === "week"
                  ? "Weekly Usage"
                  : "Monthly Usage"}
            </h2>
            <span style={{ fontSize: 13, color: "#6E6E73" }}>
              {period === "day" ? "kW" : "kWh"}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData as any}>
              <defs>
                <linearGradient id="energyGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#007AFF" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#007AFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey={xKey}
                tick={{ fontSize: 11, fill: "#6E6E73" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6E6E73" }}
                axisLine={false}
                tickLine={false}
                width={35}
              />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 12,
                  fontSize: 12,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey={yKey}
                stroke="#007AFF"
                strokeWidth={2.5}
                fill="url(#energyGrad2)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Device consumption pie */}
        <div className="glass-card dashboard-card" style={{ padding: 24 }}>
          <h2
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#1D1D1F",
              margin: "0 0 16px",
            }}
          >
            Device Consumption
          </h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={deviceConsumption}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {deviceConsumption.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 10,
                  fontSize: 12,
                }}
                formatter={(v: any) => `${v}%`}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {deviceConsumption.map((d) => (
              <div
                key={d.name}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: d.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 13, color: "#1D1D1F", flex: 1 }}>
                  {d.name}
                </span>
                <span
                  style={{ fontSize: 13, fontWeight: 600, color: "#6E6E73" }}
                >
                  {d.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="glass-card dashboard-card" style={{ padding: 24 }}>
        <h2
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "#1D1D1F",
            margin: "0 0 16px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Lightbulb size={18} color="#FF9F0A" />
          AI Recommendations
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          {recommendations.map((r) => (
            <div
              key={r.title}
              className="energy-recommendation"
              style={{
                display: "flex",
                flexDirection: "column",
                background:
                  r.impact === "high"
                    ? "rgba(0,122,255,0.05)"
                    : "rgba(0,0,0,0.02)",
                border:
                  r.impact === "high"
                    ? "1px solid rgba(0,122,255,0.15)"
                    : "1px solid rgba(0,0,0,0.06)",
                borderRadius: 16,
                padding: "16px 18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: 24 }}>{r.icon}</span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    background:
                      r.impact === "high"
                        ? "rgba(0,122,255,0.1)"
                        : r.impact === "medium"
                          ? "rgba(255,159,10,0.1)"
                          : "rgba(52,199,89,0.1)",
                    color:
                      r.impact === "high"
                        ? "#007AFF"
                        : r.impact === "medium"
                          ? "#FF9F0A"
                          : "#34C759",
                    borderRadius: 6,
                    padding: "2px 6px",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {r.impact} impact
                </span>
              </div>
              <p
                style={{
                  margin: "0 0 4px",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#1D1D1F",
                }}
              >
                {r.title}
              </p>
              <p
                style={{
                  margin: "auto 0 0",
                  paddingTop: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#34C759",
                }}
              >
                {r.saving}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
