import { useState } from "react"
import {
  GitBranch,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Zap,
  Activity,
} from "lucide-react"

interface AutomationRule {
  id: string
  name: string
  creator: string
  triggerType: "Schedule" | "Geofence" | "Sensor Threshold" | "Security Alarm"
  executionsToday: number
  failureRate: string
  status: "active" | "paused"
}

const mockRules: AutomationRule[] = [
  {
    id: "AUTO-01",
    name: "Global Good Morning (Wake up lights + climate)",
    creator: "52,100 homes",
    triggerType: "Schedule",
    executionsToday: 48920,
    failureRate: "0.01%",
    status: "active",
  },
  {
    id: "AUTO-02",
    name: "Away Mode (Lock doors + arm alarms)",
    creator: "38,400 homes",
    triggerType: "Geofence",
    executionsToday: 24100,
    failureRate: "0.03%",
    status: "active",
  },
  {
    id: "AUTO-03",
    name: "Motion Nightlight (Garden & corridors)",
    creator: "29,800 homes",
    triggerType: "Sensor Threshold",
    executionsToday: 82140,
    failureRate: "0.00%",
    status: "active",
  },
  {
    id: "AUTO-04",
    name: "Severe Storm Alert (Close blinds + shut gas valve)",
    creator: "14,200 homes",
    triggerType: "Security Alarm",
    executionsToday: 180,
    failureRate: "0.00%",
    status: "active",
  },
  {
    id: "AUTO-05",
    name: "High Temperature Eco Throttle (Set AC to 24°C)",
    creator: "34,900 homes",
    triggerType: "Sensor Threshold",
    executionsToday: 41200,
    failureRate: "0.02%",
    status: "active",
  },
]

export default function AdminAutomationView() {
  const [rules, setRules] = useState<AutomationRule[]>(mockRules)
  const [enginePaused, setEnginePaused] = useState(false)
  const [actionNotice, setActionNotice] = useState<string | null>(null)
  const [queueCount, setQueueCount] = useState(24)

  const handleToggleEngine = () => {
    const next = !enginePaused
    setEnginePaused(next)
    setActionNotice(
      next
        ? "Automation Dispatch Engine paused. Trigger executions are queued."
        : "Automation Dispatch Engine resumed. Processing queue...",
    )
  }

  const handleFlushQueue = () => {
    setQueueCount(0)
    setActionNotice(
      "Event queue flushed. 24 pending triggers dispatched across workers.",
    )
  }

  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const next = r.status === "active" ? "paused" : "active"
          return { ...r, status: next }
        }
        return r
      }),
    )
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
                color: "#AF52DE",
                background: "rgba(175,82,222,0.1)",
                padding: "2px 8px",
                borderRadius: 999,
                textTransform: "uppercase",
              }}
            >
              Routines & Trigger Dispatcher
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
            Automation Engine
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#48484A",
              margin: "4px 0 0",
              fontWeight: 500,
            }}
          >
            Platform-wide execution queue, trigger SLA tracking, and
            asynchronous worker dispatch.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            type="button"
            onClick={handleToggleEngine}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 16px",
              borderRadius: 12,
              background: enginePaused ? "#34C759" : "rgba(255, 59, 48, 0.1)",
              color: enginePaused ? "white" : "#FF3B30",
              border: enginePaused
                ? "none"
                : "1px solid rgba(255, 59, 48, 0.3)",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {enginePaused ? <Play size={14} /> : <Pause size={14} />}
            <span>{enginePaused ? "Resume Engine" : "Pause Engine"}</span>
          </button>

          <button
            type="button"
            onClick={handleFlushQueue}
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
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RotateCcw size={14} />
            <span>Flush Queue ({queueCount})</span>
          </button>
        </div>
      </div>

      {/* Action Notice */}
      {actionNotice && (
        <div
          className="animate-fade-in"
          style={{
            padding: "12px 16px",
            borderRadius: 12,
            background: "rgba(0,122,255,0.08)",
            border: "1px solid rgba(0,122,255,0.25)",
            marginBottom: 20,
            color: "#007AFF",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle2 size={16} />
            <span>{actionNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            style={{
              background: "none",
              border: "none",
              color: "#007AFF",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* KPIs */}
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
            label: "Active Routines Registered",
            value: "324,190",
            sub: "Across 52,847 homes",
            color: "#AF52DE",
            icon: <GitBranch size={18} />,
          },
          {
            label: "Dispatches Today",
            value: "1.84M",
            sub: "99.98% successful executions",
            color: "#34C759",
            icon: <Zap size={18} />,
          },
          {
            label: "Trigger Failure Rate",
            value: "0.018%",
            sub: "Within 5-nines SLA envelope",
            color: "#007AFF",
            icon: <Activity size={18} />,
          },
          {
            label: "Worker Queue Depth",
            value: `${queueCount} jobs`,
            sub: "Average wait time: 12ms",
            color: "#FF9500",
            icon: <Clock size={18} />,
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

      {/* Popular Automation Templates Across Homes */}
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
              Top Platform Automation Routines
            </h2>
            <p style={{ fontSize: 12, color: "#6E6E73", margin: "2px 0 0" }}>
              Most commonly executed trigger-action routines in the user network
            </p>
          </div>
        </div>

        <div
          style={{
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            width: "100%",
          }}
        >
          <table
            style={{ width: "100%", minWidth: 680, borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                {[
                  "Routine Name",
                  "Trigger Class",
                  "Adoption",
                  "Today Executions",
                  "Failure Rate",
                  "Status",
                  "Engine Action",
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
              {rules.map((r) => {
                const isPaused = r.status === "paused"
                return (
                  <tr
                    key={r.id}
                    style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
                  >
                    <td style={{ padding: "12px 8px" }}>
                      <p
                        style={{
                          margin: 0,
                          fontWeight: 700,
                          fontSize: 13,
                          color: "#1D1D1F",
                        }}
                      >
                        {r.name}
                      </p>
                      <span style={{ fontSize: 11, color: "#8E8E93" }}>
                        {r.id}
                      </span>
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: 6,
                          background: "rgba(175,82,222,0.1)",
                          color: "#AF52DE",
                        }}
                      >
                        {r.triggerType}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px 8px",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#1D1D1F",
                      }}
                    >
                      {r.creator}
                    </td>
                    <td
                      style={{
                        padding: "12px 8px",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#1D1D1F",
                      }}
                    >
                      {r.executionsToday.toLocaleString()}
                    </td>
                    <td
                      style={{
                        padding: "12px 8px",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#34C759",
                      }}
                    >
                      {r.failureRate}
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: 6,
                          background: isPaused
                            ? "rgba(255,149,0,0.1)"
                            : "rgba(52,199,89,0.1)",
                          color: isPaused ? "#FF9500" : "#34C759",
                          textTransform: "capitalize",
                        }}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      <button
                        type="button"
                        onClick={() => handleToggleRule(r.id)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 6,
                          background: isPaused
                            ? "rgba(52,199,89,0.1)"
                            : "rgba(255,149,0,0.1)",
                          color: isPaused ? "#34C759" : "#FF9500",
                          border: "none",
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {isPaused ? "Enable" : "Halt"}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
