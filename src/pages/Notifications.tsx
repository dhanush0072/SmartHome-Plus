import { useState } from "react"
import {
  Camera,
  Lock,
  Zap,
  AlertTriangle,
  Activity,
  Bell,
  Check,
  X,
} from "lucide-react"

const notifData = [
  {
    id: 1,
    group: "Security",
    icon: <Camera size={16} />,
    color: "#FF3B30",
    title: "Motion detected",
    body: "Backyard camera detected movement at 11:22 AM",
    time: "11:22 AM",
    unread: true,
  },
  {
    id: 2,
    group: "Security",
    icon: <Lock size={16} />,
    color: "#34C759",
    title: "Front door locked",
    body: "USER locked the front door via app",
    time: "9:05 AM",
    unread: false,
  },
  {
    id: 3,
    group: "Automation",
    icon: <Zap size={16} />,
    color: "#007AFF",
    title: "Good Morning routine completed",
    body: "4 actions executed successfully · 7:00 AM",
    time: "7:00 AM",
    unread: false,
  },
  {
    id: 4,
    group: "Energy",
    icon: <AlertTriangle size={16} />,
    color: "#FF9F0A",
    title: "High energy usage",
    body: "Current draw is 3.5 kW — 40% above your daily average",
    time: "Yesterday",
    unread: true,
  },
  {
    id: 5,
    group: "Devices",
    icon: <Activity size={16} />,
    color: "#AF52DE",
    title: "Washing Machine finished",
    body: "Your laundry cycle is complete. Please collect your clothes.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 6,
    group: "Security",
    icon: <Camera size={16} />,
    color: "#FF3B30",
    title: "Visitor at front door",
    body: "Unknown visitor detected. View camera feed?",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 7,
    group: "Automation",
    icon: <Zap size={16} />,
    color: "#007AFF",
    title: "Good Night routine completed",
    body: "5 actions executed · All doors locked · Security armed",
    time: "2 days ago",
    unread: false,
  },
  {
    id: 8,
    group: "Energy",
    icon: <Zap size={16} />,
    color: "#34C759",
    title: "Energy milestone reached",
    body: "You've saved 127 kWh this month! That's ₹1,840 saved.",
    time: "2 days ago",
    unread: false,
  },
]

const groups = ["All", "Security", "Automation", "Energy", "Devices"]

export default function Notifications() {
  const [filter, setFilter] = useState("All")
  const [notifs, setNotifs] = useState(notifData)

  const filtered =
    filter === "All" ? notifs : notifs.filter((n) => n.group === filter)
  const unreadCount = notifs.filter((n) => n.unread).length

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })))
  const dismiss = (id: number) =>
    setNotifs((prev) => prev.filter((n) => n.id !== id))
  const markRead = (id: number) =>
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    )

  // Group by day
  const grouped: Record<string, typeof notifData> = {}
  filtered.forEach((n) => {
    const key =
      ["Today", "Yesterday", "2 days ago"].includes(n.time) &&
      !n.time.match(/:\d\d/)
        ? n.time
        : n.time.match(/:\d\d/)
          ? "Today"
          : n.time
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(n)
  })

  return (
    <div
      style={{
        padding: "clamp(16px, 3vw, 32px)",
        minHeight: "100vh",
        maxWidth: 800,
        width: "100%",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 24,
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
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p style={{ fontSize: 14, color: "#6E6E73", margin: 0 }}>
              {unreadCount} unread
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            style={{
              background: "rgba(0,122,255,0.1)",
              border: "none",
              borderRadius: 10,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              color: "#007AFF",
              cursor: "pointer",
              transition: "background 0.2s ease",
            }}
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="segmented-control" style={{ marginBottom: 24 }}>
        {groups.map((g) => (
          <button
            key={g}
            type="button"
            className={filter === g ? "active" : ""}
            onClick={() => setFilter(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Notifications */}
      {Object.entries(grouped).map(([day, items]) => (
        <div key={day} style={{ marginBottom: 24 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#6E6E73",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            {day}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {items.map((n) => (
              <div
                key={n.id}
                className="glass-card dashboard-card notifications-card"
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  border: n.unread
                    ? "1px solid rgba(0,122,255,0.3)"
                    : "1px solid var(--glass-border)",
                  background: n.unread
                    ? "var(--glass-surface-strong)"
                    : "var(--glass-bg)",
                  borderRadius: 16,
                  transition: "all 0.2s ease",
                  position: "relative",
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: n.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    flexShrink: 0,
                  }}
                >
                  {n.icon}
                </div>

                {/* Content */}
                <div
                  className="notification-content"
                  style={{ flex: 1, minWidth: 0 }}
                >
                  <div
                    className="notification-heading"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        minWidth: 0,
                      }}
                    >
                      {n.unread && (
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "#007AFF",
                            display: "inline-block",
                            flexShrink: 0,
                          }}
                          aria-label="Unread notification"
                        />
                      )}
                      <p
                        style={{
                          margin: "0 0 3px",
                          fontWeight: n.unread ? 700 : 600,
                          fontSize: 14,
                          color: "#1D1D1F",
                        }}
                      >
                        {n.title}
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#6E6E73",
                        flexShrink: 0,
                        marginLeft: 12,
                      }}
                    >
                      {n.time}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: "#6E6E73",
                      lineHeight: 1.5,
                      overflowWrap: "break-word",
                    }}
                  >
                    {n.body}
                  </p>
                  <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        background: `${n.color}12`,
                        color: n.color,
                        borderRadius: 6,
                        padding: "2px 8px",
                      }}
                    >
                      {n.group}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div
                  className="notification-actions"
                  style={{ display: "flex", gap: 6, flexShrink: 0 }}
                >
                  {n.unread && (
                    <button
                      type="button"
                      aria-label="Mark as read"
                      onClick={() => markRead(n.id)}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        background: "rgba(52,199,89,0.12)",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition:
                          "transform 0.15s ease, background 0.15s ease",
                      }}
                    >
                      <Check size={13} color="#34C759" />
                    </button>
                  )}
                  <button
                    type="button"
                    aria-label="Dismiss notification"
                    onClick={() => dismiss(n.id)}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      background: "rgba(0,0,0,0.05)",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "transform 0.15s ease, background 0.15s ease",
                    }}
                  >
                    <X size={13} color="#6E6E73" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <Bell size={40} color="#D1D1D6" style={{ marginBottom: 16 }} />
          <p style={{ fontSize: 16, fontWeight: 600, color: "#6E6E73" }}>
            No notifications
          </p>
          <p style={{ fontSize: 13, color: "#6E6E73", marginTop: 4 }}>
            You're all caught up!
          </p>
        </div>
      )}
    </div>
  )
}
