import { useState } from "react"
import {
  Wifi,
  Cpu,
  Home,
  ShoppingBag,
  Mic,
  Globe,
  Shield,
  HardDrive,
  Code,
  ChevronRight,
  Check,
  ExternalLink,
} from "lucide-react"

const sections = [
  {
    title: "Connectivity",
    items: [
      {
        icon: <Wifi size={18} />,
        label: "Wi-Fi",
        value: "SmartHome_5G",
        color: "#007AFF",
      },
      {
        icon: <Cpu size={18} />,
        label: "Matter Devices",
        value: "8 paired",
        color: "#5AC8FA",
      },
    ],
  },
  {
    title: "Integrations",
    items: [
      {
        icon: <Home size={18} />,
        label: "Apple Home",
        value: "Connected",
        color: "#1D1D1F",
        connected: true,
      },
      {
        icon: <ShoppingBag size={18} />,
        label: "Google Home",
        value: "Connected",
        color: "#34A853",
        connected: true,
      },
      {
        icon: <ShoppingBag size={18} />,
        label: "Amazon Alexa",
        value: "Not connected",
        color: "#FF9F0A",
        connected: false,
      },
    ],
  },
  {
    title: "Assistant",
    items: [
      {
        icon: <Mic size={18} />,
        label: "Voice Assistant",
        value: "Hey SmartHome",
        color: "#AF52DE",
      },
      {
        icon: <Globe size={18} />,
        label: "Language",
        value: "English (India)",
        color: "#007AFF",
      },
    ],
  },
  {
    title: "Security & Privacy",
    items: [
      {
        icon: <Shield size={18} />,
        label: "Security",
        value: "2FA enabled",
        color: "#34C759",
      },
      {
        icon: <Shield size={18} />,
        label: "Data Privacy",
        value: "All local",
        color: "#34C759",
      },
    ],
  },
  {
    title: "Data",
    items: [
      {
        icon: <HardDrive size={18} />,
        label: "Backup",
        value: "Last backup: Today",
        color: "#5AC8FA",
      },
      {
        icon: <Code size={18} />,
        label: "API Access",
        value: "Developer mode",
        color: "#6E6E73",
      },
    ],
  },
]

export default function Settings() {
  const [activeItem, setActiveItem] = useState<string | null>(null)

  return (
    <div
      className="account-page"
      style={{
        padding: "clamp(16px, 3vw, 32px)",
        minHeight: "100vh",
        maxWidth: 700,
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
        Settings
      </h1>

      {sections.map((section) => (
        <div key={section.title} style={{ marginBottom: 24 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#6E6E73",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              marginBottom: 8,
              paddingLeft: 4,
            }}
          >
            {section.title}
          </p>
          <div
            className="glass-card"
            style={{ padding: 0, overflow: "hidden" }}
          >
            {section.items.map((item, i) => (
              <div key={item.label}>
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={activeItem === item.label}
                  aria-label={`${item.label}, ${item.value}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      setActiveItem(
                        activeItem === item.label ? null : item.label,
                      )
                    }
                  }}
                  onClick={() =>
                    setActiveItem(activeItem === item.label ? null : item.label)
                  }
                  className="settings-row"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 20px",
                    borderBottom:
                      i < section.items.length - 1 || activeItem === item.label
                        ? "1px solid rgba(0,0,0,0.05)"
                        : "none",
                    cursor: "pointer",
                    transition: "background 0.15s ease",
                    background:
                      activeItem === item.label
                        ? "rgba(0,122,255,0.06)"
                        : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (activeItem !== item.label)
                      e.currentTarget.style.background = "rgba(0,0,0,0.02)"
                  }}
                  onMouseLeave={(e) => {
                    if (activeItem !== item.label)
                      e.currentTarget.style.background = "transparent"
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: `${item.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: item.color,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 600,
                        fontSize: 14,
                        color: "#1D1D1F",
                      }}
                    >
                      {item.label}
                    </p>
                  </div>
                  <span
                    className="settings-value"
                    style={{ fontSize: 13, color: "#6E6E73" }}
                  >
                    {item.value}
                  </span>
                  {"connected" in item && (
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: item.connected
                          ? "rgba(52,199,89,0.1)"
                          : "rgba(0,0,0,0.05)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {item.connected ? (
                        <Check size={13} color="#34C759" />
                      ) : (
                        <ExternalLink size={12} color="#6E6E73" />
                      )}
                    </div>
                  )}
                  <ChevronRight
                    size={15}
                    color="#6E6E73"
                    style={{
                      transform:
                        activeItem === item.label ? "rotate(90deg)" : "none",
                      transition: "transform 0.2s ease",
                      flexShrink: 0,
                    }}
                  />
                </div>

                {/* Expanded detail cleanly nested inside card under active item */}
                {activeItem === item.label && (
                  <div
                    className="animate-fade-in"
                    style={{
                      background: "rgba(0,122,255,0.03)",
                      borderBottom:
                        i < section.items.length - 1
                          ? "1px solid rgba(0,0,0,0.06)"
                          : "none",
                      padding: "16px 20px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13,
                        color: "#6E6E73",
                        margin: "0 0 12px",
                      }}
                    >
                      Configure settings for{" "}
                      <span style={{ fontWeight: 600, color: "#1D1D1F" }}>
                        {activeItem}
                      </span>
                    </p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        style={{
                          background: "#007AFF",
                          color: "white",
                          border: "none",
                          borderRadius: 8,
                          padding: "7px 14px",
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Configure
                      </button>
                      <button
                        type="button"
                        style={{
                          background: "rgba(255,59,48,0.1)",
                          color: "#FF3B30",
                          border: "none",
                          borderRadius: 8,
                          padding: "7px 14px",
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                        onClick={() => setActiveItem(null)}
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Version info */}
      <div style={{ textAlign: "center", paddingTop: 24 }}>
        <p style={{ fontSize: 12, color: "#6E6E73", margin: "0 0 4px" }}>
          SmartHome+ v3.2.1
        </p>
        <p style={{ fontSize: 11, color: "#6E6E73", margin: 0 }}>
          © 2024 SmartHome+. All rights reserved.
        </p>
      </div>
    </div>
  )
}
