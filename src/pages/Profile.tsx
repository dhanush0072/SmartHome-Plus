import { useState } from "react"
import { Home, Users, Bell, Camera, ChevronRight, Edit } from "lucide-react"

const homes = [
  {
    name: "Main Home",
    address: "Mumbai, Maharashtra",
    devices: 24,
    active: true,
  },
  { name: "Holiday Cottage", address: "Goa, India", devices: 8, active: false },
]

const family = [
  {
    name: "Member 1",
    role: "Member",
    avatar: "M1",
    color: "#FF9F0A",
    access: "Full",
  },
  {
    name: "Member 2",
    role: "Child",
    avatar: "M2",
    color: "#34C759",
    access: "Limited",
  },
  {
    name: "Member 3",
    role: "Guest",
    avatar: "M3",
    color: "#AF52DE",
    access: "View only",
  },
]

export default function Profile() {
  const [notifSettings, setNotifSettings] = useState({
    security: true,
    energy: true,
    automation: true,
    updates: false,
  })

  return (
    <div
      className="account-page"
      style={{
        padding: "clamp(16px, 3vw, 32px)",
        minHeight: "100vh",
        maxWidth: 800,
        width: "100%",
      }}
    >
      <h1
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: "#1D1D1F",
          margin: "0 0 28px",
          letterSpacing: "-0.8px",
        }}
      >
        Profile
      </h1>

      {/* Profile card */}
      <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
        <div
          className="profile-header"
          style={{ display: "flex", alignItems: "center", gap: 20 }}
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #007AFF, #5AC8FA)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 26,
                color: "white",
              }}
            >
              D
            </div>
            <button
              type="button"
              aria-label="Change profile photo"
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "#007AFF",
                border: "2px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Camera size={12} color="white" />
            </button>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2
              style={{
                margin: "0 0 4px",
                fontSize: 22,
                fontWeight: 700,
                color: "#1D1D1F",
                letterSpacing: "-0.3px",
              }}
            >
              USER
            </h2>
            <p style={{ margin: "0 0 4px", fontSize: 14, color: "#6E6E73" }}>
              user@example.com
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(0,122,255,0.1)",
                borderRadius: 8,
                padding: "3px 10px",
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#007AFF",
                }}
              />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#007AFF" }}>
                Pro Plan
              </span>
            </div>
          </div>
          <button
            type="button"
            style={{
              background: "rgba(0,0,0,0.05)",
              border: "none",
              borderRadius: 10,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              color: "#1D1D1F",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Edit size={14} /> Edit
          </button>
        </div>

        {/* Personal info */}
        <div
          className="profile-info-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginTop: 24,
            paddingTop: 24,
            borderTop: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          {[
            { label: "Full Name", value: "USER" },
            { label: "Phone", value: "+91 98765 43210" },
            { label: "Email", value: "user@example.com" },
            { label: "Location", value: "Mumbai, India" },
            { label: "Member since", value: "January 2023" },
            { label: "Account type", value: "Pro Plan" },
          ].map((f) => (
            <div key={f.label}>
              <p
                style={{
                  fontSize: 11,
                  color: "#6E6E73",
                  margin: "0 0 3px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {f.label}
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: "#1D1D1F",
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                {f.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Connected homes */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
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
          <Home size={16} /> Connected Homes
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {homes.map((h) => (
            <div
              key={h.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 14px",
                background: h.active
                  ? "rgba(0,122,255,0.05)"
                  : "rgba(0,0,0,0.02)",
                borderRadius: 12,
                border: h.active
                  ? "1px solid rgba(0,122,255,0.15)"
                  : "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: h.active
                    ? "rgba(0,122,255,0.12)"
                    : "rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Home size={18} color={h.active ? "#007AFF" : "#6E6E73"} />
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#1D1D1F",
                  }}
                >
                  {h.name}
                </p>
                <p style={{ margin: 0, fontSize: 12, color: "#6E6E73" }}>
                  {h.address} · {h.devices} devices
                </p>
              </div>
              {h.active && (
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    background: "rgba(52,199,89,0.1)",
                    color: "#34C759",
                    borderRadius: 6,
                    padding: "3px 8px",
                  }}
                >
                  Active
                </div>
              )}
              <ChevronRight size={16} color="#6E6E73" />
            </div>
          ))}
          <button
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "12px",
              background: "none",
              border: "1px dashed rgba(0,122,255,0.3)",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
              color: "#007AFF",
              cursor: "pointer",
            }}
          >
            + Add Home
          </button>
        </div>
      </div>

      {/* Family members */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
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
          <Users size={16} /> Family Members
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {family.map((f) => (
            <div
              key={f.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 0",
                borderBottom: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: `${f.color}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 14,
                  color: f.color,
                }}
              >
                {f.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#1D1D1F",
                  }}
                >
                  {f.name}
                </p>
                <p style={{ margin: 0, fontSize: 12, color: "#6E6E73" }}>
                  {f.role}
                </p>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  background: "rgba(0,0,0,0.05)",
                  color: "#6E6E73",
                  borderRadius: 6,
                  padding: "3px 8px",
                }}
              >
                {f.access}
              </span>
              <ChevronRight size={16} color="#6E6E73" />
            </div>
          ))}
        </div>
      </div>

      {/* Notification preferences */}
      <div className="glass-card" style={{ padding: 24 }}>
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
          <Bell size={16} /> Notification Preferences
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {(Object.entries(
            notifSettings,
          ) as [keyof typeof notifSettings, boolean][]).map(([key, val]) => (
            <div
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "14px 0",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <span
                style={{
                  flex: 1,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#1D1D1F",
                  textTransform: "capitalize",
                }}
              >
                {key} alerts
              </span>
              <SmallToggle
                on={val}
                label={`${key} alerts`}
                onToggle={() =>
                  setNotifSettings((p) => ({ ...p, [key]: !p[key] }))
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SmallToggle({
  on,
  onToggle,
  label,
}: {
  on: boolean
  onToggle: () => void
  label?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label ?? "Toggle setting"}
      onClick={onToggle}
      style={{
        width: 44,
        height: 26,
        borderRadius: 13,
        background: on ? "#34C759" : "rgba(120,120,128,0.2)",
        position: "relative",
        cursor: "pointer",
        transition: "background 0.2s ease",
        border: "none",
        padding: 0,
        outline: "none",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 3,
          left: 3,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "white",
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          transform: on ? "translateX(18px)" : "none",
          transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      />
    </button>
  )
}
