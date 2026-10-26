import { useState } from "react"
import { Search, Download } from "lucide-react"

interface AuditLog {
  id: string
  timestamp: string
  actor: string
  action: string
  category: "AUTH" | "SECURITY" | "DEVICE" | "SYSTEM" | "USER_MGMT"
  level: "info" | "warn" | "error" | "critical"
  details: string
  ip: string
}

const mockLogs: AuditLog[] = [
  {
    id: "LOG-8901",
    timestamp: "2026-10-26 14:12:05",
    actor: "admin@smarthome.io",
    action: "DISPATCH_BROADCAST",
    category: "SYSTEM",
    level: "info",
    details: "Sent Matter 1.3 OTA advisory to 52,847 homes",
    ip: "10.0.12.4",
  },
  {
    id: "LOG-8902",
    timestamp: "2026-10-26 14:02:18",
    actor: "SyncEngine",
    action: "CLUSTER_SYNC_COMPLETE",
    category: "DEVICE",
    level: "info",
    details: "Synced 1,247 residential hub gateways",
    ip: "internal-mesh",
  },
  {
    id: "LOG-8903",
    timestamp: "2026-10-26 13:48:40",
    actor: "system-firewall",
    action: "RATE_LIMIT_EXCEEDED",
    category: "SECURITY",
    level: "warn",
    details: "Client 49.36.12.89 exceeded 100 req/sec limit on /api/v2/auth",
    ip: "49.36.12.89",
  },
  {
    id: "LOG-8904",
    timestamp: "2026-10-26 13:30:12",
    actor: "admin@smarthome.io",
    action: "USER_ROLE_PROMOTED",
    category: "USER_MGMT",
    level: "info",
    details: "Created platform account for Meera Kapoor",
    ip: "10.0.12.4",
  },
  {
    id: "LOG-8905",
    timestamp: "2026-10-26 12:15:22",
    actor: "MatterGateway",
    action: "THREAD_BORDER_TIMEOUT",
    category: "DEVICE",
    level: "error",
    details: "Goa cluster Thread border node timed out after 3 retries",
    ip: "10.4.1.20",
  },
  {
    id: "LOG-8906",
    timestamp: "2026-10-26 11:05:44",
    actor: "BackupWorker",
    action: "SNAPSHOT_COMPLETE",
    category: "SYSTEM",
    level: "info",
    details: "Encrypted snapshot #BKP-9832 (14.2 GB) saved to cloud vault",
    ip: "internal-worker",
  },
  {
    id: "LOG-8907",
    timestamp: "2026-10-26 10:18:02",
    actor: "SecurityMonitor",
    action: "FAILED_ADMIN_LOGIN",
    category: "AUTH",
    level: "warn",
    details: "Invalid credentials attempted for root admin portal",
    ip: "198.51.100.22",
  },
]

export default function AdminLogsView() {
  const [logs] = useState<AuditLog[]>(mockLogs)
  const [search, setSearch] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("ALL")
  const [catFilter, setCatFilter] = useState<string>("ALL")

  const handleExport = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(logs, null, 2))
    const downloadAnchor = document.createElement("a")
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute(
      "download",
      `smarthome-audit-logs-${Date.now()}.json`,
    )
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  const filtered = logs.filter((l) => {
    const matchSearch =
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.ip.includes(search)

    const matchLevel = levelFilter === "ALL" || l.level === levelFilter
    const matchCat = catFilter === "ALL" || l.category === catFilter

    return matchSearch && matchLevel && matchCat
  })

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
                color: "#007AFF",
                background: "rgba(0,122,255,0.1)",
                padding: "2px 8px",
                borderRadius: 999,
                textTransform: "uppercase",
              }}
            >
              Immutable Compliance & Security Audit
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
            Activity & Audit Logs
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#48484A",
              margin: "4px 0 0",
              fontWeight: 500,
            }}
          >
            Cryptographically timestamped telemetry of system actions,
            administrator interventions, and network events.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExport}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.7)",
            color: "#1D1D1F",
            border: "1px solid rgba(0,0,0,0.12)",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <Download size={15} /> Export Audit Log (JSON)
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div
        className="glass-card"
        style={{ padding: "16px 20px", marginBottom: 20 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          {/* Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(0,0,0,0.04)",
              borderRadius: 10,
              padding: "9px 14px",
              minWidth: 260,
              flex: 1,
            }}
          >
            <Search size={15} color="#6E6E73" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit trail by actor, IP address, action..."
              style={{
                background: "none",
                border: "none",
                outline: "none",
                fontSize: 13,
                color: "#1D1D1F",
                width: "100%",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Level Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6E6E73" }}>
              Severity:
            </span>
            {["ALL", "info", "warn", "error"].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevelFilter(lvl)}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  padding: "5px 10px",
                  borderRadius: 8,
                  border: "none",
                  background:
                    levelFilter === lvl ? "#1D1D1F" : "rgba(0,0,0,0.05)",
                  color: levelFilter === lvl ? "white" : "#6E6E73",
                  cursor: "pointer",
                }}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6E6E73" }}>
              Category:
            </span>
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.1)",
                background: "rgba(255,255,255,0.7)",
                color: "#1D1D1F",
                outline: "none",
              }}
            >
              <option value="ALL">All Categories</option>
              <option value="AUTH">Authentication</option>
              <option value="SECURITY">Security Firewalls</option>
              <option value="DEVICE">Hardware & Mesh</option>
              <option value="SYSTEM">Platform System</option>
              <option value="USER_MGMT">User Management</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-card" style={{ padding: 22 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <h2
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: "#1D1D1F",
              margin: 0,
            }}
          >
            Audit Log Entries ({filtered.length} matched)
          </h2>
          <span style={{ fontSize: 12, color: "#6E6E73" }}>
            Retention: 365 Days
          </span>
        </div>

        <div
          style={{
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            width: "100%",
          }}
        >
          <table
            style={{
              width: "100%",
              minWidth: 780,
              borderCollapse: "collapse",
              fontFamily: "monospace",
            }}
          >
            <thead>
              <tr>
                {[
                  "Timestamp",
                  "Severity",
                  "Category",
                  "Actor / Origin",
                  "Action",
                  "Event Details",
                  "IP / Node",
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
              {filtered.map((log) => {
                const color =
                  log.level === "error"
                    ? "#FF3B30"
                    : log.level === "warn"
                      ? "#FF9500"
                      : "#007AFF"

                return (
                  <tr
                    key={log.id}
                    style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
                  >
                    <td
                      style={{
                        padding: "10px 8px",
                        fontSize: 11,
                        color: "#6E6E73",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {log.timestamp}
                    </td>
                    <td style={{ padding: "10px 8px" }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          textTransform: "uppercase",
                          color,
                          background: `${color}15`,
                          padding: "2px 6px",
                          borderRadius: 4,
                        }}
                      >
                        {log.level}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "10px 8px",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#1D1D1F",
                      }}
                    >
                      {log.category}
                    </td>
                    <td
                      style={{
                        padding: "10px 8px",
                        fontSize: 12,
                        color: "#1D1D1F",
                      }}
                    >
                      {log.actor}
                    </td>
                    <td
                      style={{
                        padding: "10px 8px",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#007AFF",
                      }}
                    >
                      {log.action}
                    </td>
                    <td
                      style={{
                        padding: "10px 8px",
                        fontSize: 12,
                        color: "#48484A",
                        maxWidth: 280,
                      }}
                    >
                      {log.details}
                    </td>
                    <td
                      style={{
                        padding: "10px 8px",
                        fontSize: 11,
                        color: "#6E6E73",
                      }}
                    >
                      {log.ip}
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
