import { useState } from "react"
import { Bell, Send, CheckCircle2, Trash2 } from "lucide-react"

interface BroadcastItem {
  id: string
  title: string
  body: string
  audience: string
  priority: "normal" | "urgent" | "critical"
  deliveredCount: number
  readPct: string
  sentAt: string
}

const mockBroadcasts: BroadcastItem[] = [
  {
    id: "BC-201",
    title: "Matter 1.3 OTA Firmware Upgrade Rolled Out",
    body: "All Zigbee and Thread bridges received automated over-the-air patches.",
    audience: "All Users",
    priority: "normal",
    deliveredCount: 52847,
    readPct: "88%",
    sentAt: "Today, 10:30 AM",
  },
  {
    id: "BC-202",
    title: "Severe Weather Warning: Wind Alert in Western Zone",
    body: "Automated shutter security recommendations pushed to coastal residences.",
    audience: "Goa & Mumbai Regions",
    priority: "urgent",
    deliveredCount: 18420,
    readPct: "94%",
    sentAt: "Yesterday, 4:15 PM",
  },
  {
    id: "BC-203",
    title: "Scheduled Platform Maintenance Notice",
    body: "API clusters will undergo rolling upgrades on Sunday at 02:00 AM IST.",
    audience: "All Users",
    priority: "normal",
    deliveredCount: 52847,
    readPct: "76%",
    sentAt: "Oct 22, 2024",
  },
]

export default function AdminNotificationsView() {
  const [broadcasts, setBroadcasts] = useState<BroadcastItem[]>(mockBroadcasts)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [audience, setAudience] = useState("All Users")
  const [priority, setPriority] = useState<"normal" | "urgent" | "critical">(
    "normal",
  )
  const [successNotice, setSuccessNotice] = useState<string | null>(null)

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return

    const newBC: BroadcastItem = {
      id: `BC-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      body: body.trim(),
      audience,
      priority,
      deliveredCount: audience === "All Users" ? 52847 : 18400,
      readPct: "0% (dispatching)",
      sentAt: "Just now",
    }

    setBroadcasts([newBC, ...broadcasts])
    setSuccessNotice(
      `Broadcast "${title}" queued and sent to ${newBC.deliveredCount.toLocaleString()} devices.`,
    )
    setTitle("")
    setBody("")
  }

  const handleDelete = (id: string) => {
    setBroadcasts((prev) => prev.filter((b) => b.id !== id))
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
                color: "#007AFF",
                background: "rgba(0,122,255,0.1)",
                padding: "2px 8px",
                borderRadius: 999,
                textTransform: "uppercase",
              }}
            >
              Broadcast Dispatch Hub
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
            Notification Center
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#48484A",
              margin: "4px 0 0",
              fontWeight: 500,
            }}
          >
            Dispatch real-time push alerts, emergency notifications, and
            platform maintenance broadcasts.
          </p>
        </div>
      </div>

      {/* Success Notice */}
      {successNotice && (
        <div
          className="animate-fade-in"
          style={{
            padding: "12px 16px",
            borderRadius: 12,
            background: "rgba(52,199,89,0.1)",
            border: "1px solid rgba(52,199,89,0.25)",
            marginBottom: 20,
            color: "#248A3D",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle2 size={16} />
            <span>{successNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessNotice(null)}
            style={{
              background: "none",
              border: "none",
              color: "#248A3D",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Grid: Compose + History */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 20,
        }}
      >
        {/* Composer */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h2
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: "#1D1D1F",
              margin: "0 0 4px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Bell size={18} color="#007AFF" /> Compose Global Push Broadcast
          </h2>
          <p style={{ fontSize: 12, color: "#6E6E73", margin: "0 0 18px" }}>
            Sends instant notifications to all connected homeowner apps and
            dashboards.
          </p>

          <form
            onSubmit={handleSend}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <label className="feedback-field-group">
              <span className="feedback-field-label">Announcement Title</span>
              <input
                type="text"
                placeholder="e.g. System Security Patch & Routine Optimization"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
              <span className="feedback-field-label">Target Audience</span>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(0,0,0,0.12)",
                  fontSize: 13,
                  background: "rgba(255,255,255,0.7)",
                  outline: "none",
                }}
              >
                <option value="All Users">
                  All Connected Homeowners (52,847)
                </option>
                <option value="Pro Plan Users">
                  Pro Tier Subscribers (34,100)
                </option>
                <option value="Enterprise Clients">
                  Enterprise / Multi-home Owners (4,200)
                </option>
                <option value="Western Zone Hubs">
                  Western Grid Clusters (Goa & Mumbai)
                </option>
              </select>
            </label>

            <label className="feedback-field-group">
              <span className="feedback-field-label">Urgency Priority</span>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 8,
                }}
              >
                {[
                  { key: "normal", label: "Normal", color: "#007AFF" },
                  { key: "urgent", label: "Urgent", color: "#FF9500" },
                  {
                    key: "critical",
                    label: "Critical Alert",
                    color: "#FF3B30",
                  },
                ].map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setPriority(p.key as any)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: `1px solid ${
                        priority === p.key ? p.color : "rgba(0,0,0,0.1)"
                      }`,
                      background:
                        priority === p.key
                          ? `${p.color}15`
                          : "rgba(255,255,255,0.6)",
                      color: priority === p.key ? p.color : "#6E6E73",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </label>

            <label className="feedback-field-group">
              <span className="feedback-field-label">Notification Body</span>
              <textarea
                rows={3}
                placeholder="Enter details visible in homeowner notification feeds..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
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

            <button
              type="submit"
              className="feedback-primary-button"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px",
                borderRadius: 12,
                marginTop: 4,
              }}
            >
              <Send size={15} /> Send Broadcast Now
            </button>
          </form>
        </div>

        {/* Broadcast History */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h2
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: "#1D1D1F",
              margin: "0 0 4px",
            }}
          >
            Dispatch History & Metrics
          </h2>
          <p style={{ fontSize: 12, color: "#6E6E73", margin: "0 0 16px" }}>
            Audited records of system broadcasts dispatched through MQTT / Apple
            APNs
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {broadcasts.map((b) => {
              const color =
                b.priority === "critical"
                  ? "#FF3B30"
                  : b.priority === "urgent"
                    ? "#FF9500"
                    : "#007AFF"

              return (
                <div
                  key={b.id}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.5)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
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
                        }}
                      >
                        {b.priority}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#6E6E73",
                        }}
                      >
                        {b.audience}
                      </span>
                    </div>

                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span style={{ fontSize: 11, color: "#8E8E93" }}>
                        {b.sentAt}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(b.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#8E8E93",
                          cursor: "pointer",
                          padding: 2,
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <h3
                    style={{
                      margin: "0 0 4px",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#1D1D1F",
                    }}
                  >
                    {b.title}
                  </h3>
                  <p
                    style={{
                      margin: "0 0 10px",
                      fontSize: 12,
                      color: "#48484A",
                      lineHeight: 1.4,
                    }}
                  >
                    {b.body}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      fontSize: 11,
                      color: "#6E6E73",
                      fontWeight: 600,
                    }}
                  >
                    <span>
                      Delivered:{" "}
                      <strong style={{ color: "#1D1D1F" }}>
                        {b.deliveredCount.toLocaleString()}
                      </strong>{" "}
                      devices
                    </span>
                    <span>
                      Read Rate:{" "}
                      <strong style={{ color: "#34C759" }}>{b.readPct}</strong>
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
