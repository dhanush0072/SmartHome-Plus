import { useEffect, useState } from "react"
import {
  Shield,
  Camera,
  Lock,
  Unlock,
  AlertTriangle,
  Eye,
  UserCheck,
  Activity,
  Bell,
  MapPin,
} from "lucide-react"
import backyardImage from "../Assets/backyard1.jpg"
import frontDoorImage from "../Assets/frontdoor.jpg"
import garageCameraImage from "../Assets/garagecc.jpg"
import livingRoomImage from "../Assets/room.png"
import { LoadingImage } from "../components/LoadingSkeleton"
import { getStoredSecurity, saveStoredSecurity } from "../utils/aiCommandParser"

const cameras = [
  {
    id: 1,
    name: "Front Door",
    location: "Entrance",
    status: "live",
    motion: false,
    img: frontDoorImage,
  },
  {
    id: 2,
    name: "Backyard",
    location: "Garden",
    status: "live",
    motion: true,
    img: backyardImage,
  },
  {
    id: 3,
    name: "Garage",
    location: "Garage",
    status: "live",
    motion: false,
    img: garageCameraImage,
  },
  {
    id: 4,
    name: "Living Room",
    location: "Interior",
    status: "paused",
    motion: false,
    img: livingRoomImage,
  },
]

const timeline = [
  {
    time: "11:20 AM",
    event: "Garage door opened",
    type: "warning",
    who: "Member 1",
  },
  { time: "9:05 AM", event: "Front door locked", type: "success", who: "USER" },
  {
    time: "8:32 AM",
    event: "Motion detected — Backyard",
    type: "alert",
    who: "Camera 2",
  },
  {
    time: "7:00 AM",
    event: "Good Morning routine armed system",
    type: "info",
    who: "Automation",
  },
  {
    time: "Yesterday 10:30 PM",
    event: "All doors secured",
    type: "success",
    who: "Good Night",
  },
  {
    time: "Yesterday 8:14 PM",
    event: "Visitor: unknown person",
    type: "alert",
    who: "Face Rec.",
  },
]

const eventColors: Record<string, string> = {
  success: "#34C759",
  warning: "#FF9F0A",
  alert: "#FF3B30",
  info: "#007AFF",
}

export default function Security() {
  const [security, setSecurity] = useState(getStoredSecurity)
  const { armed, doors } = security

  const toggleDoor = (i: number) => {
    setSecurity((prev) => {
      const next = {
        ...prev,
        doors: prev.doors.map((d, idx) =>
          idx === i
            ? { ...d, locked: !d.locked, lastAction: "Just now", who: "Manual" }
            : d,
        ),
      }
      saveStoredSecurity(next)
      return next
    })
  }

  const toggleSecurity = () => {
    const next = { ...security, armed: !armed }
    saveStoredSecurity(next)
    setSecurity(next)
  }

  useEffect(() => {
    const refresh = () => setSecurity(getStoredSecurity())
    window.addEventListener("smarthome_security_change", refresh)
    return () =>
      window.removeEventListener("smarthome_security_change", refresh)
  }, [])

  return (
    <div className="security-page" style={{ padding: 32, minHeight: "100%" }}>
      {/* Header */}
      <div
        className="security-header"
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
            Security
          </h1>
          <p style={{ fontSize: 14, color: "#6E6E73", margin: 0 }}>
            {cameras.filter((c) => c.status === "live").length} cameras live ·{" "}
            {doors.filter((d) => d.locked).length}/{doors.length} doors locked
          </p>
        </div>

        {/* Arm/Disarm */}
        <button
          type="button"
          className="security-arm-control"
          onClick={toggleSecurity}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: armed ? "rgba(52,199,89,0.1)" : "rgba(255,59,48,0.1)",
            border: `1px solid ${
              armed ? "rgba(52,199,89,0.25)" : "rgba(255,59,48,0.25)"
            }`,
            borderRadius: 14,
            padding: "12px 20px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            backdropFilter: "blur(18px) saturate(160%)",
            WebkitBackdropFilter: "blur(18px) saturate(160%)",
            boxShadow: "0 14px 30px rgba(0,0,0,0.08)",
          }}
        >
          <Shield size={18} color={armed ? "#34C759" : "#FF3B30"} />
          <div style={{ textAlign: "left" }}>
            <p
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: 14,
                color: armed ? "#34C759" : "#FF3B30",
              }}
            >
              {armed ? "System Armed" : "System Disarmed"}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: "#6E6E73" }}>
              Tap to {armed ? "disarm" : "arm"}
            </p>
          </div>
        </button>
      </div>

      {/* Camera grid */}
      <div
        className="glass-card security-cameras-panel"
        style={{
          padding: 24,
          marginBottom: 20,
          border: "1px solid rgba(255, 255, 255, 0.45)",
          boxShadow:
            "0 12px 40px rgba(0, 0, 0, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.35)",
          transition: "all 0.25s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)"
          e.currentTarget.style.boxShadow =
            "0 16px 48px rgba(0, 0, 0, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.35)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)"
          e.currentTarget.style.boxShadow =
            "0 12px 40px rgba(0, 0, 0, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.35)"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
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
            <Camera
              size={16}
              style={{ marginRight: 8, verticalAlign: "middle" }}
            />
            Live Cameras
          </h2>
        </div>
        <div
          className="security-cameras-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 14,
          }}
        >
          {cameras.map((cam) => (
            <div
              key={cam.id}
              style={{
                borderRadius: 16,
                overflow: "hidden",
                background: "rgba(29,29,31,0.72)",
                border: "1px solid rgba(255,255,255,0.22)",
                position: "relative",
                aspectRatio: "16 / 9",
                minWidth: 0,
                boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              <LoadingImage
                src={cam.img}
                alt={cam.name}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  objectFit: "cover",
                  opacity: cam.status === "paused" ? 0.4 : 0.85,
                  background: "#333",
                }}
              />

              {/* Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)",
                }}
              />

              {/* Live badge */}
              {cam.status === "live" ? (
                <div
                  className="animate-pulse-soft"
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    background: "#FF3B30",
                    borderRadius: 6,
                    padding: "3px 8px",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "white",
                    letterSpacing: "0.05em",
                  }}
                >
                  ● LIVE
                </div>
              ) : (
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    background: "rgba(0,0,0,0.6)",
                    borderRadius: 6,
                    padding: "3px 8px",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  PAUSED
                </div>
              )}

              {/* Motion alert */}
              {cam.motion && (
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "rgba(255,159,10,0.9)",
                    borderRadius: 6,
                    padding: "3px 8px",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  MOTION
                </div>
              )}

              {/* Info */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "10px 12px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  {cam.name}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <MapPin size={10} color="rgba(255,255,255,0.6)" />
                  <p
                    style={{
                      margin: 0,
                      fontSize: 11,
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    {cam.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div
        className="security-lower-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 20,
        }}
      >
        {/* Door locks */}
        <div
          className="glass-card security-lower-panel"
          style={{
            padding: 24,
            border: "1px solid rgba(255, 255, 255, 0.38)",
            boxShadow:
              "0 12px 40px rgba(0, 0, 0, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.35)",
            transition: "all 0.25s ease",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)"
            e.currentTarget.style.boxShadow =
              "0 16px 48px rgba(0, 0, 0, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.35)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow =
              "0 12px 40px rgba(0, 0, 0, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.35)"
          }}
        >
          <h2
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#1D1D1F",
              margin: "0 0 16px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "#34C759",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Lock size={16} color="white" />
            </div>
            Door Locks
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {doors.map((d, i) => (
              <div
                key={d.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  background: d.locked
                    ? "rgba(52,199,89,0.15)"
                    : "rgba(255,59,48,0.15)",
                  borderRadius: 12,
                  border: `1px solid ${
                    d.locked ? "rgba(52,199,89,0.28)" : "rgba(255,59,48,0.28)"
                  }`,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: d.locked ? "#34C759" : "#FF3B30",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {d.locked ? (
                    <Lock size={18} color="white" />
                  ) : (
                    <Unlock size={18} color="white" />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 600,
                      fontSize: 13,
                      color: "#1D1D1F",
                    }}
                  >
                    {d.name}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: "#6E6E73" }}>
                    {d.who} · {d.lastAction}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleDoor(i)}
                  style={{
                    background: d.locked ? "#34C759" : "#FF3B30",
                    border: "none",
                    borderRadius: 8,
                    padding: "6px 12px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "white",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)"
                  }}
                >
                  {d.locked ? "Lock" : "Unlock"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security features */}
        <div
          className="glass-card security-lower-panel"
          style={{ padding: 24, cursor: "default" }}
        >
          <h2
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#1D1D1F",
              margin: "0 0 16px",
            }}
          >
            <span className="detection-heading-text">Detection</span>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              {
                icon: <UserCheck size={18} />,
                label: "Face Recognition",
                on: true,
                color: "#007AFF",
              },
              {
                icon: <Activity size={18} />,
                label: "Motion Detection",
                on: true,
                color: "#34C759",
              },
              {
                icon: <Eye size={18} />,
                label: "Perimeter Alert",
                on: true,
                color: "#FF9F0A",
              },
              {
                icon: <Bell size={18} />,
                label: "Sound Detection",
                on: false,
                color: "#AF52DE",
              },
            ].map((f) => (
              <div
                key={f.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 0",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: f.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </div>
                <span
                  className="detection-label"
                  style={{
                    flex: 1,
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#1D1D1F",
                  }}
                >
                  {f.label}
                </span>
                <SmallToggle on={f.on} color={f.color} label={f.label} />
              </div>
            ))}

            {/* Emergency SOS */}
            <button
              type="button"
              style={{
                marginTop: 8,
                width: "100%",
                background: "#FF3B30",
                border: "none",
                borderRadius: 12,
                padding: "12px",
                fontSize: 14,
                fontWeight: 700,
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#E63528"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#FF3B30"
              }}
            >
              <AlertTriangle size={16} />
              Emergency SOS
            </button>
          </div>
        </div>

        {/* Security timeline */}
        <div
          className="glass-card security-lower-panel"
          style={{ padding: 24, cursor: "default" }}
        >
          <h2
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#1D1D1F",
              margin: "0 0 16px",
            }}
          >
            Security Timeline
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {timeline.map((item, i) => (
              <div
                key={i}
                style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
              >
                {/* Icon badge */}
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: eventColors[item.type],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <Shield size={18} color="white" />
                </div>
                <div style={{ flex: 1, paddingTop: 2 }}>
                  <p
                    style={{
                      margin: "0 0 2px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#1D1D1F",
                    }}
                  >
                    {item.event}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: "#6E6E73" }}>
                    {item.time} · {item.who}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SmallToggle({
  on,
  color,
  label,
}: {
  on: boolean
  color: string
  label?: string
}) {
  const [active, setActive] = useState(on)
  return (
    <div
      role="switch"
      aria-checked={active}
      aria-label={label ? `Toggle ${label}` : "Toggle"}
      tabIndex={0}
      onClick={() => setActive(!active)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          setActive(!active)
        }
      }}
      style={{
        width: 36,
        height: 22,
        borderRadius: 11,
        background: active ? color : "rgba(120,120,128,0.2)",
        position: "relative",
        cursor: "pointer",
        transition: "background 0.2s ease",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 3,
          left: 3,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "white",
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          transform: active ? "translateX(14px)" : "none",
          transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      />
    </div>
  )
}
