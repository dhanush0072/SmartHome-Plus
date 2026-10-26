import { useState } from "react"
import { Zap, Sun, DollarSign, Activity } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

const monthlyEnergy = [
  { month: "Oct", totalMwh: 412, renewable: 160 },
  { month: "Nov", totalMwh: 440, renewable: 182 },
  { month: "Dec", totalMwh: 498, renewable: 210 },
  { month: "Jan", totalMwh: 520, renewable: 228 },
  { month: "Feb", totalMwh: 470, renewable: 198 },
  { month: "Mar", totalMwh: 482, renewable: 204 },
]

const categoryConsumption = [
  { category: "Climate & HVAC", mwh: 218, pct: "45.2%", color: "#007AFF" },
  {
    category: "Water Heaters & Pumps",
    mwh: 96,
    pct: "19.9%",
    color: "#FF9500",
  },
  { category: "Lighting & Ambience", mwh: 74, pct: "15.3%", color: "#34C759" },
  { category: "EV Home Chargers", mwh: 58, pct: "12.0%", color: "#AF52DE" },
  {
    category: "Appliances & Entertainment",
    mwh: 36,
    pct: "7.6%",
    color: "#5AC8FA",
  },
]

export default function AdminEnergyView() {
  const [timeframe, setTimeframe] = useState<"month" | "quarter" | "year">(
    "month",
  )

  return (
    <div
      className="account-page"
      style={{ padding: "clamp(16px, 3vw, 32px)", minHeight: "100vh" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: "#FF9500",
                background: "rgba(255,149,0,0.1)",
                padding: "2px 8px",
                borderRadius: 999,
                textTransform: "uppercase",
              }}
            >
              Platform Energy Analytics
            </span>
          </div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "#1D1D1F",
              margin: 0,
              letterSpacing: "-0.8px",
            }}
          >
            Energy & Grid Operations
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#48484A",
              margin: "4px 0 0",
              fontWeight: 500,
            }}
          >
            Aggregated power draw across 52,847 households, solar
            micro-generation, and peak shaving telemetry.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {(["month", "quarter", "year"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTimeframe(t)}
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "capitalize",
                padding: "6px 14px",
                borderRadius: 10,
                border: "none",
                background: timeframe === t ? "#FF9500" : "rgba(0,0,0,0.05)",
                color: timeframe === t ? "white" : "#6E6E73",
                cursor: "pointer",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 22,
        }}
      >
        {[
          {
            label: "Platform Load (This Month)",
            value: "482 MWh",
            sub: "↓ 4.2% optimized by AI routines",
            color: "#FF9500",
            icon: <Zap size={18} />,
          },
          {
            label: "Renewable Solar Mix",
            value: "42.3%",
            sub: "204 MWh clean generation offset",
            color: "#34C759",
            icon: <Sun size={18} />,
          },
          {
            label: "Peak Hour Demand",
            value: "34.9 MW",
            sub: "Occurred 8:15 PM across metro hubs",
            color: "#FF3B30",
            icon: <Activity size={18} />,
          },
          {
            label: "Estimated Homeowner Savings",
            value: "₹4.2M",
            sub: "Through dynamic schedule throttling",
            color: "#007AFF",
            icon: <DollarSign size={18} />,
          },
        ].map((k) => (
          <div
            key={k.label}
            className="glass-card"
            style={{ padding: "20px 22px" }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: `${k.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: k.color,
                marginBottom: 12,
              }}
            >
              {k.icon}
            </div>
            <p
              style={{
                fontSize: 12,
                color: "#6E6E73",
                margin: "0 0 4px",
                fontWeight: 600,
              }}
            >
              {k.label}
            </p>
            <p
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: "#1D1D1F",
                margin: "0 0 4px",
                letterSpacing: "-0.5px",
              }}
            >
              {k.value}
            </p>
            <p
              style={{
                fontSize: 11,
                color: "#48484A",
                margin: 0,
                fontWeight: 500,
              }}
            >
              {k.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 20,
          marginBottom: 22,
        }}
      >
        {/* Total vs Renewable Chart */}
        <div className="glass-card" style={{ padding: 22 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#1D1D1F",
                  margin: 0,
                }}
              >
                Historical Energy Consumption (MWh)
              </h2>
              <p style={{ fontSize: 12, color: "#6E6E73", margin: "2px 0 0" }}>
                Total Grid Load vs Clean Solar Self-Generation
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyEnergy}>
              <defs>
                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF9500" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#FF9500" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="renewGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34C759" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#34C759" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#6E6E73" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6E6E73" }}
                axisLine={false}
                tickLine={false}
                width={40}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 10,
                  fontSize: 12,
                }}
                formatter={(v: any) => [`${v} MWh`, "Energy"]}
              />
              <Area
                type="monotone"
                dataKey="totalMwh"
                stroke="#FF9500"
                strokeWidth={2.5}
                fill="url(#totalGrad)"
              />
              <Area
                type="monotone"
                dataKey="renewable"
                stroke="#34C759"
                strokeWidth={2.5}
                fill="url(#renewGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown by Equipment */}
        <div className="glass-card" style={{ padding: 22 }}>
          <h2
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: "#1D1D1F",
              margin: "0 0 4px",
            }}
          >
            Category Consumption Breakdown
          </h2>
          <p style={{ fontSize: 12, color: "#6E6E73", margin: "0 0 16px" }}>
            Heavy-load category distribution across households
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {categoryConsumption.map((cat) => (
              <div key={cat.category}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 4,
                    fontSize: 13,
                  }}
                >
                  <span style={{ fontWeight: 700, color: "#1D1D1F" }}>
                    {cat.category}
                  </span>
                  <span style={{ fontWeight: 700, color: cat.color }}>
                    {cat.mwh} MWh ({cat.pct})
                  </span>
                </div>
                <div
                  style={{
                    height: 8,
                    borderRadius: 999,
                    background: "rgba(0,0,0,0.06)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: cat.pct,
                      background: cat.color,
                      borderRadius: 999,
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
