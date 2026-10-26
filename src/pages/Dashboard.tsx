import { useState, useRef, useEffect } from "react"
import roomLiving from "../Assets/room.png"
import roomBedroom from "../Assets/room5.jpg"
import roomGarage from "../Assets/garage.jpg"
import roomKitchen from "../Assets/kitchen.jpg"
import { LoadingImage } from "../components/LoadingSkeleton"
import {
  Cloud,
  Zap,
  Shield,
  Camera,
  Bell,
  Sparkles,
  Lightbulb,
  Wind,
  Lock,
  TrendingDown,
  ChevronRight,
  Wifi,
  Sun,
  Moon,
  MessageSquare,
} from "lucide-react"
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  CartesianGrid,
} from "recharts"
import type { Page } from "../App"
import { parseAndExecuteCommand } from "../utils/aiCommandParser"
import FeedbackModal from "../components/FeedbackModal"

const energyData = [
  { time: "6am", kw: 1.2 },
  { time: "8am", kw: 2.1 },
  { time: "10am", kw: 1.8 },
  { time: "12pm", kw: 2.4 },
  { time: "2pm", kw: 2.0 },
  { time: "4pm", kw: 2.8 },
  { time: "6pm", kw: 3.2 },
  { time: "8pm", kw: 2.6 },
  { time: "Now", kw: 2.1 },
]

const rooms = [
  {
    name: "Living Room",
    devices: 6,
    temp: "22°C",
    status: "active",
    img: roomLiving,
  },
  {
    name: "Bedroom",
    devices: 4,
    temp: "21°C",
    status: "active",
    img: roomBedroom,
  },
  {
    name: "Kitchen",
    devices: 5,
    temp: "24°C",
    status: "active",
    img: roomKitchen,
  },
  { name: "Garage", devices: 2, temp: "19°C", status: "idle", img: roomGarage },
]

const recentActivity = [
  {
    icon: <Lock size={18} color="white" />,
    text: "Front door locked",
    time: "2 min ago",
    color: "#3dc942",
  },
  {
    icon: <Lightbulb size={18} color="white" />,
    text: "Kitchen lights turned off",
    time: "15 min ago",
    color: "#FF9F0A",
  },
  {
    icon: <Camera size={18} color="white" />,
    text: "Motion detected — Garden",
    time: "22 min ago",
    color: "#FF3B30",
  },
  {
    icon: <Wind size={18} color="white" />,
    text: "AC set to 22°C",
    time: "1 hr ago",
    color: "#5AC8FA",
  },
  {
    icon: <Zap size={18} color="white" />,
    text: "Good Morning routine ran",
    time: "7:00 AM",
    color: "#007AFF",
  },
]

const todayAutomations = [
  { name: "Good Morning", ran: true, time: "7:00 AM", icon: "☀️" },
  { name: "Leave Home", ran: true, time: "9:05 AM", icon: "🔒" },
  { name: "Movie Mode", ran: false, time: "8:30 PM", icon: "🎬" },
  { name: "Good Night", ran: false, time: "10:30 PM", icon: "🌙" },
]

interface Props {
  onNavigate: (p: Page) => void
  userName?: string
}

export default function Dashboard({ onNavigate, userName = "USER" }: Props) {
  const [aiInput, setAiInput] = useState("")
  const [aiMessages, setAiMessages] = useState([
    {
      from: "ai",
      text: "Good morning, USER! It's 24°C outside with light clouds. Your home is all secure. What can I help you with?",
    },
  ])
  const [isAiTyping, setIsAiTyping] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current
    if (messagesContainer) {
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [aiMessages, isAiTyping])

  const sendAi = () => {
    const trimmed = aiInput.trim()
    if (!trimmed) return
    const userMsg = trimmed
    setAiInput("")

    setAiMessages((prev) => [...prev, { from: "user", text: userMsg }])
    setIsAiTyping(true)
    window.setTimeout(() => {
      const result = parseAndExecuteCommand(userMsg, onNavigate)
      setAiMessages((prev) => [...prev, { from: "ai", text: result.text }])
      setIsAiTyping(false)
    }, 350)
  }

  const now = new Date()
  const hour = now.getHours()
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening"
  const greetIcon =
    hour < 12 ? (
      <Sun size={18} color="#FF9F0A" />
    ) : hour < 20 ? (
      <Sun size={18} color="#FF9F0A" />
    ) : (
      <Moon size={18} color="#5AC8FA" />
    )

  return (
    <div
      className="dashboard-page"
      style={{
        padding: 32,
        minHeight: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 28,
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
            {greetIcon}
            <span style={{ fontSize: 14, color: "#1D1D1F", fontWeight: 600 }}>
              {greeting}
            </span>
          </div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#1D1D1F",
              margin: 0,
              letterSpacing: "-0.8px",
            }}
          >
            <span className="dashboard-name-desktop">USER</span>
            <span className="dashboard-name-mobile">{userName || "Homeowner"}</span>
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#6E6E73",
              margin: "4px 0 0",
              fontWeight: 500,
            }}
          >
            12 devices active · All systems normal
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            className="feedback-trigger"
            type="button"
            onClick={() => setIsFeedbackOpen(true)}
            aria-label="Share feedback"
            title="Share feedback"
          >
            <MessageSquare size={16} />
            <span className="feedback-trigger-label">Feedback</span>
          </button>
          <button
            className="glass-control dashboard-notifications-trigger"
            type="button"
            style={{
              background: "var(--glass-surface-soft)",
              border: "1px solid var(--glass-border)",
              borderRadius: 14,
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
              boxShadow: "var(--glass-shadow)",
              backdropFilter: "var(--glass-blur)",
              WebkitBackdropFilter: "var(--glass-blur)",
            }}
            onClick={() => onNavigate("notifications")}
            aria-label="Notifications"
          >
            <Bell size={18} color="#1D1D1F" />
            <div
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#FF3B30",
                border: "1.5px solid white",
              }}
            />
          </button>
        </div>
      </div>

      {isFeedbackOpen && (
        <FeedbackModal onClose={() => setIsFeedbackOpen(false)} />
      )}

      {/* Status bar */}
      <div
        className="dashboard-stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <StatusCard
          icon={<Cloud size={20} color="white" />}
          bg="linear-gradient(135deg, #007AFF, #5AC8FA)"
          label="Weather"
          value="24°C"
          sub="Partly cloudy · Mumbai"
        />
        <StatusCard
          icon={<Shield size={20} color="white" />}
          bg="rgb(52, 199, 89)"
          label="Security"
          value="Armed"
          sub="All doors & windows locked"
        />
        <StatusCard
          icon={<Zap size={20} color="white" />}
          bg="rgb(255, 157, 10)"
          label="Energy Today"
          value="18.4 kWh"
          sub="↓ 12% vs yesterday"
        />
        <StatusCard
          icon={<Wifi size={20} color="white" />}
          bg="rgb(0, 123, 255)"
          label="Active Devices"
          value="12 / 24"
          sub="9 lights · 3 climate"
        />
      </div>

      {/* Main grid */}
      <div
        className="dashboard-main-grid"
        style={{ display: "grid", gap: 20, marginBottom: 20 }}
      >
        {/* Energy chart */}
        <div className="dashboard-glass dashboard-card" style={{ padding: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 12,
                  color: "#6E6E73",
                  margin: "0 0 4px",
                  fontWeight: 600,
                }}
              >
                Energy Usage
              </p>
              <p
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#1D1D1F",
                  margin: 0,
                  letterSpacing: "-0.5px",
                }}
              >
                2.4{" "}
                <span
                  style={{ fontSize: 14, fontWeight: 500, color: "#6E6E73" }}
                >
                  kW now
                </span>
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "rgba(52,199,89,0.14)",
                border: "1px solid rgba(52,199,89,0.25)",
                borderRadius: 8,
                padding: "4px 10px",
              }}
            >
              <TrendingDown size={13} color="#248A3D" strokeWidth={2.4} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#248A3D" }}>
                -12%
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart
              data={energyData}
              margin={{ top: 6, right: 6, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="energyLiquidGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#007AFF" stopOpacity={0.35} />
                  <stop offset="65%" stopColor="#5AC8FA" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#007AFF" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(0, 0, 0, 0.05)"
              />

              <XAxis
                dataKey="time"
                tick={{ fontSize: 10.5, fill: "#6E6E73", fontWeight: 600 }}
                axisLine={{ stroke: "rgba(0, 0, 0, 0.08)" }}
                tickLine={false}
                dy={3}
              />

              <Tooltip
                cursor={{
                  stroke: "rgba(0, 122, 255, 0.25)",
                  strokeWidth: 1.5,
                  strokeDasharray: "3 3",
                }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const val = payload[0].value
                    return (
                      <div
                        style={{
                          background: "rgba(255, 255, 255, 0.92)",
                          backdropFilter: "blur(16px) saturate(180%)",
                          WebkitBackdropFilter: "blur(16px) saturate(180%)",
                          border: "1px solid rgba(255, 255, 255, 0.85)",
                          borderRadius: 10,
                          padding: "6px 10px",
                          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.12)",
                          pointerEvents: "none",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: 11,
                            color: "#1D1D1F",
                            fontWeight: 600,
                          }}
                        >
                          {label}
                        </p>
                        <p
                          style={{
                            margin: "2px 0 0",
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#007AFF",
                          }}
                        >
                          {val}{" "}
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: "#1D1D1F",
                            }}
                          >
                            kW
                          </span>
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />

              <Area
                type="monotone"
                dataKey="kw"
                stroke="#007AFF"
                strokeWidth={2.4}
                fill="url(#energyLiquidGrad)"
                isAnimationActive={true}
                animationDuration={1100}
                animationEasing="ease-out"
                activeDot={{
                  r: 5,
                  fill: "#FFFFFF",
                  stroke: "#007AFF",
                  strokeWidth: 2.5,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Room overview */}
        <div className="dashboard-glass dashboard-card" style={{ padding: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <p
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#1D1D1F",
                margin: 0,
              }}
            >
              Rooms
            </p>
            <button
              type="button"
              onClick={() => onNavigate("rooms")}
              style={{
                background: "none",
                border: "none",
                fontSize: 13,
                color: "#007AFF",
                cursor: "pointer",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {rooms.map((r) => (
              <div
                key={r.name}
                onClick={() => onNavigate("rooms")}
                className="dashboard-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  cursor: "pointer",
                  background: "rgba(255, 255, 255, 0.32)",
                }}
              >
                <LoadingImage
                  src={r.img}
                  alt={r.name}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    objectFit: "cover",
                    background: "#ddd",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 600,
                      fontSize: 14,
                      color: "#1D1D1F",
                    }}
                  >
                    {r.name}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "#6E6E73" }}>
                    {r.devices} devices · {r.temp}
                  </p>
                </div>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: r.status === "active" ? "#34C759" : "#D1D1D6",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* AI Assistant */}
        <div
          className="dashboard-glass dashboard-assistant-card"
          style={{ padding: 24, display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #1D1D1F, #3a3a3c)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={16} color="#5AC8FA" />
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#1D1D1F",
                }}
              >
                AI Assistant
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "#34C759" }}>
                ● Online
              </p>
            </div>
          </div>

          <div
            ref={messagesContainerRef}
            style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 12,
              maxHeight: 200,
            }}
          >
            {aiMessages.map((m, i) => (
              <div
                key={i}
                className={`dashboard-message ${
                  m.from === "user" ? "user" : "ai"
                }`}
                style={{
                  alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                  borderRadius:
                    m.from === "user"
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                  padding: "10px 14px",
                  fontSize: 13,
                  lineHeight: 1.5,
                  maxWidth: "85%",
                }}
              >
                {m.text}
              </div>
            ))}
            {isAiTyping && (
              <div
                className="dashboard-message ai"
                style={{
                  alignSelf: "flex-start",
                  borderRadius: "16px 16px 16px 4px",
                  padding: "10px 14px",
                  fontSize: 13,
                }}
              >
                <span style={{ opacity: 0.45 }}>●</span>{" "}
                <span style={{ opacity: 0.65 }}>●</span>{" "}
                <span style={{ opacity: 0.85 }}>●</span>
              </div>
            )}
          </div>

          <div
            className="dashboard-input"
            style={{
              display: "flex",
              gap: 8,
              borderRadius: 18,
              padding: "10px 14px",
            }}
          >
            <input
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendAi()}
              placeholder="Ask anything..."
              style={{
                flex: 1,
                background: "none",
                border: "none",
                outline: "none",
                fontSize: 13,
                color: "#1D1D1F",
                fontFamily: "inherit",
              }}
            />
            <button
              type="button"
              onClick={sendAi}
              aria-label="Send message to AI assistant"
              style={{
                background: "#007AFF",
                border: "none",
                borderRadius: 12,
                width: 34,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Sparkles size={13} color="white" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div
        className="dashboard-bottom-grid"
        style={{ display: "grid", gap: 20 }}
      >
        {/* Today's automations */}
        <div
          className="dashboard-glass dashboard-bottom-card"
          style={{ padding: 24, display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <p
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#1D1D1F",
                margin: 0,
              }}
            >
              Today's Automations
            </p>
            <button
              type="button"
              onClick={() => onNavigate("automation")}
              style={{
                background: "none",
                border: "none",
                fontSize: 13,
                color: "#007AFF",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Manage
            </button>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              flex: 1,
            }}
          >
            {todayAutomations.map((a) => (
              <div
                key={a.name}
                className="dashboard-automation-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  background: "var(--glass-surface-soft)",
                  borderRadius: 12,
                  border: a.ran
                    ? "1px solid rgba(52,199,89,0.15)"
                    : "1px solid transparent",
                }}
              >
                <span style={{ fontSize: 20 }}>{a.icon}</span>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 600,
                      fontSize: 14,
                      color: "#1D1D1F",
                    }}
                  >
                    {a.name}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "#6E6E73" }}>
                    {a.time}
                  </p>
                </div>
                {a.ran ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#34C759",
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#34C759",
                      }}
                    />
                    Done
                  </div>
                ) : (
                  <div
                    style={{ fontSize: 11, fontWeight: 600, color: "#6E6E73" }}
                  >
                    Pending
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div
          className="dashboard-glass dashboard-bottom-card readable-activity"
          style={{ padding: 24, display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <p
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#1D1D1F",
                margin: 0,
              }}
            >
              Recent Activity
            </p>
            <button
              type="button"
              onClick={() => onNavigate("notifications")}
              style={{
                background: "none",
                border: "none",
                fontSize: 13,
                color: "#007AFF",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              See all
            </button>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              flex: 1,
            }}
          >
            {recentActivity.map((a, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom:
                    i < recentActivity.length - 1
                      ? "1px solid rgba(0,0,0,0.05)"
                      : "none",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 12,
                    background: a.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    flexShrink: 0,
                    boxShadow: `0 16px 30px ${a.color}22`,
                    border: "1px solid rgba(255, 255, 255, 0.28)",
                  }}
                >
                  {a.icon}
                </div>
                <p
                  style={{ flex: 1, margin: 0, fontSize: 13, color: "#1D1D1F" }}
                >
                  {a.text}
                </p>
                <span
                  style={{
                    fontSize: 11,
                    color: "#86868B",
                    whiteSpace: "nowrap",
                  }}
                >
                  {a.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusCard({
  icon,
  bg,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode
  bg: string
  label: string
  value: string
  sub: string
}) {
  return (
    <div
      className="dashboard-glass dashboard-status-card"
      style={{ padding: "20px 22px" }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        {icon}
      </div>
      <p
        style={{
          fontSize: 12,
          color: "#6E6E73",
          margin: "0 0 4px",
          fontWeight: 500,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#1D1D1F",
          margin: "0 0 4px",
          letterSpacing: "-0.5px",
        }}
      >
        {value}
      </p>
      <p style={{ fontSize: 12, color: "#86868B", margin: 0 }}>{sub}</p>
    </div>
  )
}
