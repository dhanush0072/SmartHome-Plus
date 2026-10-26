import { useState } from "react"
import {
  Users,
  Cpu,
  Zap,
  GitBranch,
  Activity,
  TrendingUp,
  Radio,
  HardDrive,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Bell,
  X,
  Send,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts"
import type { Page } from "../../App"

const dauData = [
  { day: "Mon", users: 38200, load: 45 },
  { day: "Tue", users: 41500, load: 52 },
  { day: "Wed", users: 43100, load: 56 },
  { day: "Thu", users: 42900, load: 54 },
  { day: "Fri", users: 47800, load: 68 },
  { day: "Sat", users: 51200, load: 74 },
  { day: "Sun", users: 52847, load: 62 },
]

const deviceBreakdown = [
  { type: "Lights", count: 485000, color: "#FF9F0A" },
  { type: "Climate", count: 280000, color: "#007AFF" },
  { type: "Security", count: 245000, color: "#FF3B30" },
  { type: "Appliances", count: 120000, color: "#34C759" },
  { type: "Sensors", count: 70000, color: "#AF52DE" },
]

const energyTrends = [
  { hour: "00:00", mwh: 14.2 },
  { hour: "04:00", mwh: 11.8 },
  { hour: "08:00", mwh: 26.5 },
  { hour: "12:00", mwh: 22.1 },
  { hour: "16:00", mwh: 28.4 },
  { hour: "20:00", mwh: 34.9 },
  { hour: "23:59", mwh: 18.3 },
]

interface LogItem {
  id: string
  level: "info" | "warn" | "error" | "success"
  msg: string
  source: string
  time: string
}

const initialLogs: LogItem[] = [
  {
    id: "1",
    level: "info",
    source: "SyncEngine",
    msg: "Device sync completed for 1,247 homes across Mumbai & Bengaluru",
    time: "2 min ago",
  },
  {
    id: "2",
    level: "warn",
    source: "APIGateway",
    msg: "High API request rate (3,400 req/sec) from Enterprise client #ENT-89",
    time: "14 min ago",
  },
  {
    id: "3",
    level: "success",
    source: "BackupService",
    msg: "Automated snapshot #BKP-9832 finished successfully (14.2 GB)",
    time: "45 min ago",
  },
  {
    id: "4",
    level: "error",
    source: "MatterGateway",
    msg: "Thread border router timeout on 3 hub clusters in Goa node",
    time: "1 hr ago",
  },
  {
    id: "5",
    level: "info",
    source: "Automation",
    msg: "Scheduled morning routine trigger dispatched to 42,100 homes",
    time: "3 hr ago",
  },
]

interface Props {
  onNavigate: (p: Page) => void
}

export default function AdminDashboardView({ onNavigate }: Props) {
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [backupRunning, setBackupRunning] = useState(false)
  const [engineRestarting, setEngineRestarting] = useState(false)
  const [bannerNotice, setBannerNotice] = useState<string | null>(null)
  const [broadcastOpen, setBroadcastOpen] = useState(false)
  const [broadcastTitle, setBroadcastTitle] = useState("")
  const [broadcastMsg, setBroadcastMsg] = useState("")
  const [logFilter, setLogFilter] = useState<"all" | "info" | "warn" | "error">(
    "all",
  )

  const handleTriggerBackup = () => {
    setBackupRunning(true)
    setBannerNotice("Database backup sequence initiated in background...")
    setTimeout(() => {
      setBackupRunning(false)
      setBannerNotice(
        "Backup #BKP-9833 completed successfully (14.4 GB encrypted to Cloud Storage).",
      )
    }, 2200)
  }

  const handleRestartEngine = () => {
    setEngineRestarting(true)
    setBannerNotice(
      "Restarting Automation Dispatcher cluster (rolling reboot)...",
    )
    setTimeout(() => {
      setEngineRestarting(false)
      setBannerNotice(
        "Automation Engine workers back online (4/4 nodes healthy).",
      )
    }, 1800)
  }

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault()
    if (!broadcastTitle.trim() || !broadcastMsg.trim()) return

    setBroadcastOpen(false)
    setBannerNotice(
      `System broadcast "${broadcastTitle}" dispatched to all active homes.`,
    )
    setBroadcastTitle("")
    setBroadcastMsg("")
  }

  const filteredLogs = initialLogs.filter(
    (l) => logFilter === "all" || l.level === logFilter,
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
                color: "#FF3B30",
                background: "rgba(255, 59, 48, 0.1)",
                border: "1px solid rgba(255, 59, 48, 0.25)",
                padding: "2px 8px",
                borderRadius: 999,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Platform Overview
            </span>
            <span style={{ fontSize: 13, color: "#6E6E73", fontWeight: 500 }}>
              Global Infrastructure Control
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
            Administrator Console
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#48484A",
              margin: "4px 0 0",
              fontWeight: 500,
            }}
          >
            Real-time telemetry and management across all connected smart
            residences.
          </p>
        </div>

        {/* Global status pill */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: maintenanceMode
                ? "rgba(255, 149, 0, 0.12)"
                : "rgba(52, 199, 89, 0.12)",
              border: `1px solid ${
                maintenanceMode
                  ? "rgba(255, 149, 0, 0.3)"
                  : "rgba(52, 199, 89, 0.3)"
              }`,
              borderRadius: 12,
              padding: "8px 16px",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: maintenanceMode ? "#FF9500" : "#34C759",
              }}
              className="animate-pulse-soft"
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: maintenanceMode ? "#D70015" : "#248A3D",
              }}
            >
              {maintenanceMode
                ? "Maintenance Mode Active"
                : "All Microservices Healthy"}
            </span>
          </div>
        </div>
      </div>

      {/* Banner Notice */}
      {bannerNotice && (
        <div
          className="animate-fade-in"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 18px",
            background: "rgba(0, 122, 255, 0.08)",
            border: "1px solid rgba(0, 122, 255, 0.25)",
            borderRadius: 14,
            marginBottom: 20,
            color: "#007AFF",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle2 size={16} />
            <span>{bannerNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setBannerNotice(null)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#007AFF",
              padding: 2,
            }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Top 5 Stats Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 14,
          marginBottom: 22,
        }}
      >
        {[
          {
            label: "Total Users",
            value: "52,847",
            sub: "↑ 1,247 this month",
            icon: <Users size={18} />,
            color: "#007AFF",
            page: "admin-users",
          },
          {
            label: "Connected Devices",
            value: "1.20M",
            sub: "34,800 active now",
            icon: <Cpu size={18} />,
            color: "#34C759",
            page: "admin-devices",
          },
          {
            label: "Platform Energy",
            value: "482 MWh",
            sub: "↓ 4.2% eco-optimized",
            icon: <Zap size={18} />,
            color: "#FF9500",
            page: "admin-energy",
          },
          {
            label: "Active Automations",
            value: "324,190",
            sub: "99.98% execution rate",
            icon: <GitBranch size={18} />,
            color: "#AF52DE",
            page: "admin-automation",
          },
          {
            label: "System Health",
            value: "99.98%",
            sub: "24ms API latency",
            icon: <Activity size={18} />,
            color: "#34C759",
            page: "admin-monitoring",
          },
        ].map((k) => (
          <div
            key={k.label}
            className="dashboard-glass admin-stat-card"
            onClick={() => onNavigate(k.page as Page)}
            style={{
              padding: "18px 20px",
              cursor: "pointer",
              transition: "transform 0.18s ease, box-shadow 0.18s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
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
                }}
              >
                {k.icon}
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#007AFF" }}>
                View →
              </span>
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

      {/* Quick Operations Bar */}
      <div
        className="dashboard-glass"
        style={{ padding: "16px 20px", marginBottom: 22 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Radio size={16} color="#FF3B30" />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#1D1D1F" }}>
              Operations Quick Actions
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            {/* Broadcast */}
            <button
              type="button"
              onClick={() => setBroadcastOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 10,
                background: "#007AFF",
                color: "white",
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0, 122, 255, 0.25)",
              }}
            >
              <Bell size={14} />
              <span>Broadcast Notice</span>
            </button>

            {/* Backup */}
            <button
              type="button"
              onClick={handleTriggerBackup}
              disabled={backupRunning}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.7)",
                color: "#1D1D1F",
                border: "1px solid rgba(0,0,0,0.1)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <HardDrive size={14} color="#5AC8FA" />
              <span>{backupRunning ? "Backing up..." : "Trigger Backup"}</span>
            </button>

            {/* Restart Engine */}
            <button
              type="button"
              onClick={handleRestartEngine}
              disabled={engineRestarting}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.7)",
                color: "#1D1D1F",
                border: "1px solid rgba(0,0,0,0.1)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <RefreshCw
                size={14}
                color="#34C759"
                className={engineRestarting ? "animate-spin" : ""}
              />
              <span>
                {engineRestarting ? "Restarting..." : "Restart Automation"}
              </span>
            </button>

            {/* Maintenance Toggle */}
            <button
              type="button"
              onClick={() => {
                const next = !maintenanceMode
                setMaintenanceMode(next)
                setBannerNotice(
                  next
                    ? "System Maintenance Mode enabled. Public logins are gated."
                    : "Maintenance Mode disabled. Regular traffic resumed.",
                )
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 10,
                background: maintenanceMode
                  ? "#FF3B30"
                  : "rgba(255, 59, 48, 0.1)",
                color: maintenanceMode ? "white" : "#FF3B30",
                border: "1px solid rgba(255, 59, 48, 0.3)",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <AlertTriangle size={14} />
              <span>
                {maintenanceMode ? "Disable Maint." : "Toggle Maint. Mode"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div
        className="admin-charts-grid"
        style={{
          marginBottom: 22,
        }}
      >
        {/* Active Users Trends */}
        <div className="dashboard-glass" style={{ padding: 22 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#1D1D1F",
                  margin: 0,
                }}
              >
                Weekly Active Homeowners
              </h2>
              <p style={{ fontSize: 12, color: "#6E6E73", margin: "2px 0 0" }}>
                Peak concurrence: 52,847 users
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                color: "#34C759",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              <TrendingUp size={14} /> +12.4% WoW
            </div>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={dauData}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#007AFF" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#007AFF" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#6E6E73" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6E6E73" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                width={35}
              />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 10,
                  fontSize: 12,
                }}
                formatter={(v: any) => [
                  Number(v).toLocaleString(),
                  "Active Users",
                ]}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#007AFF"
                strokeWidth={2.5}
                fill="url(#userGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Device Categories */}
        <div className="dashboard-glass" style={{ padding: 22 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#1D1D1F",
                  margin: 0,
                }}
              >
                Device Category Share
              </h2>
              <p style={{ fontSize: 12, color: "#6E6E73", margin: "2px 0 0" }}>
                1.2M online hardware devices
              </p>
            </div>
            <span
              style={{
                fontSize: 12,
                color: "#007AFF",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onClick={() => onNavigate("admin-devices")}
            >
              Inventory →
            </span>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={deviceBreakdown} layout="vertical">
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "#6E6E73" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
              />
              <YAxis
                type="category"
                dataKey="type"
                tick={{ fontSize: 12, fill: "#1D1D1F", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={75}
              />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 10,
                  fontSize: 12,
                }}
                formatter={(v: any) => [
                  Number(v).toLocaleString(),
                  "Registered Units",
                ]}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {deviceBreakdown.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Energy trends */}
        <div className="dashboard-glass" style={{ padding: 22 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#1D1D1F",
                  margin: 0,
                }}
              >
                Platform Energy Load
              </h2>
              <p style={{ fontSize: 12, color: "#6E6E73", margin: "2px 0 0" }}>
                Hourly aggregate MWh consumption
              </p>
            </div>
            <span
              style={{
                fontSize: 12,
                color: "#007AFF",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onClick={() => onNavigate("admin-energy")}
            >
              Energy Details →
            </span>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={energyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 10, fill: "#6E6E73" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#6E6E73" }}
                axisLine={false}
                tickLine={false}
                width={30}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 10,
                  fontSize: 12,
                }}
                formatter={(v: any) => [`${v} MWh`, "Platform Load"]}
              />
              <Line
                type="monotone"
                dataKey="mwh"
                stroke="#FF9500"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#FF9500" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Platform Activity Feed */}
      <div className="dashboard-glass" style={{ padding: 22 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
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
              Recent Platform Events & Incidents
            </h2>
            <p style={{ fontSize: 12, color: "#6E6E73", margin: "2px 0 0" }}>
              Live stream from cluster telemetry and security monitors
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {(["all", "info", "warn", "error"] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLogFilter(lvl)}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  padding: "4px 10px",
                  borderRadius: 8,
                  border: "none",
                  background:
                    logFilter === lvl ? "#1D1D1F" : "rgba(0,0,0,0.05)",
                  color: logFilter === lvl ? "#FFFFFF" : "#6E6E73",
                  cursor: "pointer",
                }}
              >
                {lvl}
              </button>
            ))}
            <button
              type="button"
              onClick={() => onNavigate("admin-logs")}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#007AFF",
                background: "none",
                border: "none",
                cursor: "pointer",
                marginLeft: 6,
              }}
            >
              All Logs →
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filteredLogs.map((log) => {
            const isErr = log.level === "error"
            const isWarn = log.level === "warn"
            const isSuccess = log.level === "success"

            const color = isErr
              ? "#FF3B30"
              : isWarn
                ? "#FF9500"
                : isSuccess
                  ? "#34C759"
                  : "#007AFF"

            return (
              <div
                key={log.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  background: isErr
                    ? "rgba(255, 59, 48, 0.05)"
                    : isWarn
                      ? "rgba(255, 149, 0, 0.05)"
                      : "rgba(0,0,0,0.02)",
                  borderRadius: 10,
                  border: `1px solid ${
                    isErr ? "rgba(255, 59, 48, 0.18)" : "rgba(0,0,0,0.04)"
                  }`,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    color,
                    background: `${color}15`,
                    padding: "2px 7px",
                    borderRadius: 5,
                    flexShrink: 0,
                  }}
                >
                  {log.level}
                </span>

                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#1D1D1F",
                    width: 110,
                    flexShrink: 0,
                  }}
                >
                  [{log.source}]
                </span>

                <span
                  className="admin-event-message"
                  style={{
                    fontSize: 13,
                    color: "#1D1D1F",
                    flex: 1,
                    fontFamily: "inherit",
                  }}
                >
                  {log.msg}
                </span>

                <span style={{ fontSize: 11, color: "#6E6E73", flexShrink: 0 }}>
                  {log.time}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Broadcast Modal */}
      {broadcastOpen && (
        <div
          className="feedback-modal-backdrop"
          role="presentation"
          onMouseDown={(e) =>
            e.target === e.currentTarget && setBroadcastOpen(false)
          }
        >
          <div className="feedback-modal" style={{ maxWidth: 480 }}>
            <div className="feedback-modal-header">
              <div className="feedback-modal-heading">
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(0, 122, 255, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#007AFF",
                  }}
                >
                  <Bell size={18} />
                </div>
                <div>
                  <h2
                    id="broadcast-title"
                    style={{
                      margin: 0,
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#1D1D1F",
                    }}
                  >
                    Broadcast Global Announcement
                  </h2>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: 12,
                      color: "#6E6E73",
                    }}
                  >
                    Send an instantaneous banner to all active homeowners
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="feedback-close-button"
                onClick={() => setBroadcastOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSendBroadcast}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <label className="feedback-field-group">
                <span className="feedback-field-label">Headline / Title</span>
                <input
                  type="text"
                  placeholder="e.g. Scheduled Firmware Maintenance Tonight at 2 AM"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(0,0,0,0.12)",
                    fontSize: 13,
                    background: "rgba(255,255,255,0.7)",
                    outline: "none",
                  }}
                />
              </label>

              <label className="feedback-field-group">
                <span className="feedback-field-label">Broadcast Message</span>
                <textarea
                  rows={3}
                  placeholder="Provide clarity on downtime, changes, or security notices..."
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(0,0,0,0.12)",
                    fontSize: 13,
                    background: "rgba(255,255,255,0.7)",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
              </label>

              <div className="feedback-modal-actions">
                <button
                  type="button"
                  className="feedback-secondary-button"
                  onClick={() => setBroadcastOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="feedback-primary-button"
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Send size={14} /> Dispatch Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
