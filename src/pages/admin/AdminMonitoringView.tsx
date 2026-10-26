import { useState } from "react"
import { Server, Clock, RefreshCw, Cpu, Radio } from "lucide-react"
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts"

const latencyData = [
  { time: "14:00", p50: 12, p95: 22, p99: 28 },
  { time: "14:05", p50: 11, p95: 21, p99: 26 },
  { time: "14:10", p50: 14, p95: 25, p99: 34 },
  { time: "14:15", p50: 12, p95: 23, p99: 29 },
  { time: "14:20", p50: 13, p95: 24, p99: 30 },
  { time: "14:25", p50: 11, p95: 20, p99: 25 },
  { time: "14:30", p50: 10, p95: 19, p99: 24 },
]

const services = [
  {
    name: "Core Auth & RBAC Service",
    status: "healthy",
    uptime: "99.99%",
    latency: "8ms",
    region: "ap-south-1a",
  },
  {
    name: "MQTT Broker & Telemetry Gateway",
    status: "healthy",
    uptime: "99.98%",
    latency: "14ms",
    region: "ap-south-1b",
  },
  {
    name: "Automation Dispatch Engine",
    status: "healthy",
    uptime: "99.99%",
    latency: "19ms",
    region: "ap-south-1a",
  },
  {
    name: "Primary Spanner / DB Cluster",
    status: "healthy",
    uptime: "100.00%",
    latency: "4ms",
    region: "Multi-region",
  },
  {
    name: "Matter Border Router Gateway",
    status: "healthy",
    uptime: "99.95%",
    latency: "28ms",
    region: "ap-south-1c",
  },
  {
    name: "Encrypted Media & Video Streamer",
    status: "healthy",
    uptime: "99.97%",
    latency: "32ms",
    region: "CDN Edge",
  },
]

export default function AdminMonitoringView() {
  const [cpuUsage, setCpuUsage] = useState(34)
  const [memoryUsage, setMemoryUsage] = useState(62)
  const [networkIO, setNetworkIO] = useState("1.84 Gbps")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setCpuUsage(Math.floor(28 + Math.random() * 12))
      setMemoryUsage(Math.floor(58 + Math.random() * 8))
      setNetworkIO(`${(1.6 + Math.random() * 0.4).toFixed(2)} Gbps`)
      setIsRefreshing(false)
    }, 600)
  }

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
                color: "#34C759",
                background: "rgba(52,199,89,0.1)",
                padding: "2px 8px",
                borderRadius: 999,
                textTransform: "uppercase",
              }}
            >
              Cluster Health Telemetry
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
            System Monitoring
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#48484A",
              margin: "4px 0 0",
              fontWeight: 500,
            }}
          >
            Real-time infrastructure health, server latency, and microservice
            SLA metrics.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 16px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.7)",
            color: "#1D1D1F",
            border: "1px solid rgba(0,0,0,0.12)",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Cluster Vital Gauges */}
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
            label: "Cluster CPU Load",
            value: `${cpuUsage}%`,
            sub: "16 vCPU across 4 nodes",
            color: "#007AFF",
            icon: <Cpu size={18} />,
          },
          {
            label: "Memory Allocation",
            value: `${memoryUsage}%`,
            sub: "39.6 GB of 64 GB used",
            color: "#5AC8FA",
            icon: <Server size={18} />,
          },
          {
            label: "Network Throughput",
            value: networkIO,
            sub: "In: 1.2 Gbps · Out: 640 Mbps",
            color: "#34C759",
            icon: <Radio size={18} />,
          },
          {
            label: "Uptime SLA (30d)",
            value: "99.982%",
            sub: "Zero unmanaged downtime",
            color: "#34C759",
            icon: <Clock size={18} />,
          },
        ].map((v) => (
          <div
            key={v.label}
            className="glass-card"
            style={{ padding: "20px 22px" }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: `${v.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: v.color,
                marginBottom: 12,
              }}
            >
              {v.icon}
            </div>
            <p
              style={{
                fontSize: 12,
                color: "#6E6E73",
                margin: "0 0 4px",
                fontWeight: 600,
              }}
            >
              {v.label}
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
              {v.value}
            </p>
            <p
              style={{
                fontSize: 11,
                color: "#48484A",
                margin: 0,
                fontWeight: 500,
              }}
            >
              {v.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Latency Percentiles Chart */}
      <div className="glass-card" style={{ padding: 22, marginBottom: 22 }}>
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
              API Request Latency (ms)
            </h2>
            <p style={{ fontSize: 12, color: "#6E6E73", margin: "2px 0 0" }}>
              p50 (median) vs p95 vs p99 peak response times
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#34C759",
                }}
              />
              <span style={{ color: "#1D1D1F", fontWeight: 600 }}>
                p50 (Median)
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#007AFF",
                }}
              />
              <span style={{ color: "#1D1D1F", fontWeight: 600 }}>p95</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#FF3B30",
                }}
              />
              <span style={{ color: "#1D1D1F", fontWeight: 600 }}>
                p99 Peak
              </span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={latencyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "#6E6E73" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6E6E73" }}
              axisLine={false}
              tickLine={false}
              width={35}
              tickFormatter={(v) => `${v}ms`}
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 10,
                fontSize: 12,
              }}
              formatter={(v: any) => [`${v} ms`, "Response Time"]}
            />
            <Line
              type="monotone"
              dataKey="p50"
              stroke="#34C759"
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="p95"
              stroke="#007AFF"
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="p99"
              stroke="#FF3B30"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Microservice Health Table */}
      <div className="glass-card" style={{ padding: 22 }}>
        <h2
          style={{
            fontSize: 17,
            fontWeight: 800,
            color: "#1D1D1F",
            margin: "0 0 14px",
          }}
        >
          Microservices & Gateway Nodes
        </h2>

        <div
          style={{
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            width: "100%",
          }}
        >
          <table
            style={{ width: "100%", minWidth: 640, borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                {[
                  "Service / Worker",
                  "Deployment Region",
                  "Latency",
                  "Availability",
                  "Health Status",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#6E6E73",
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      padding: "0 8px 12px",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr
                  key={s.name}
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
                >
                  <td style={{ padding: "12px 8px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#34C759",
                        }}
                      />
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#1D1D1F",
                        }}
                      >
                        {s.name}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "12px 8px",
                      fontSize: 12,
                      color: "#6E6E73",
                      fontFamily: "monospace",
                    }}
                  >
                    {s.region}
                  </td>
                  <td
                    style={{
                      padding: "12px 8px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#1D1D1F",
                    }}
                  >
                    {s.latency}
                  </td>
                  <td
                    style={{
                      padding: "12px 8px",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#34C759",
                    }}
                  >
                    {s.uptime}
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: 6,
                        background: "rgba(52,199,89,0.1)",
                        color: "#34C759",
                        textTransform: "uppercase",
                      }}
                    >
                      Healthy
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
