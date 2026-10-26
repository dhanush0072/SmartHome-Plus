import { useEffect, useState } from "react"
import {
  Plus,
  Play,
  ChevronRight,
  Zap,
  Clock,
  MapPin,
  GitBranch,
  ArrowDown,
} from "lucide-react"
import {
  getStoredAutomations,
  saveStoredAutomations,
} from "../utils/aiCommandParser"

const automations = [
  {
    id: 1,
    name: "Good Morning",
    icon: "☀️",
    trigger: "Time: 7:00 AM",
    actions: [
      "Turn on kitchen lights",
      "Set AC to 24°C",
      "Start coffee maker",
      "Open blinds",
    ],
    active: true,
    lastRan: "Today 7:00 AM",
    color: "#FF9F0A",
    runs: 127,
  },
  {
    id: 2,
    name: "Good Night",
    icon: "🌙",
    trigger: "Time: 10:30 PM",
    actions: [
      "Turn off all lights",
      "Lock all doors",
      "Set AC to 21°C",
      "Arm security",
    ],
    active: true,
    lastRan: "Yesterday 10:30 PM",
    color: "#5AC8FA",
    runs: 124,
  },
  {
    id: 3,
    name: "Away Mode",
    icon: "🔒",
    trigger: "When I leave home",
    actions: [
      "Lock all doors",
      "Turn off lights",
      "Arm cameras",
      "Lower AC",
      "Pause appliances",
      "Enable perimeter alert",
      "Notify Member 1",
      "Enable guest lock",
    ],
    active: true,
    lastRan: "Today 9:05 AM",
    color: "#FF3B30",
    runs: 89,
  },
  {
    id: 4,
    name: "Vacation",
    icon: "✈️",
    trigger: "Manual / Schedule",
    actions: [
      "Full security mode",
      "Random lights schedule",
      "Minimal energy mode",
    ],
    active: false,
    lastRan: "Oct 12",
    color: "#34C759",
    runs: 8,
  },
  {
    id: 5,
    name: "Movie Mode",
    icon: "🎬",
    trigger: 'Voice: "Hey, movie time"',
    actions: [
      "Dim living room lights 20%",
      "Close blinds",
      "Set surround sound",
      'Set TV to 55" mode',
      "Turn off kitchen lights",
      "Set AC to 22°C",
    ],
    active: true,
    lastRan: "Yesterday 8:30 PM",
    color: "#AF52DE",
    runs: 43,
  },
  {
    id: 6,
    name: "Party Mode",
    icon: "🎉",
    trigger: "Voice / Manual",
    actions: ["Color lights to party theme", "Max music", "Open all areas"],
    active: false,
    lastRan: "Nov 5",
    color: "#FF3B30",
    runs: 12,
  },
]

const ifOptions = [
  "Time of day",
  "Location (arrive/leave)",
  "Temperature",
  "Motion detected",
  "Door opened",
  "Sunrise/Sunset",
  "Voice command",
  "App widget",
]
const thenOptions = [
  "Turn on/off light",
  "Set temperature",
  "Lock/unlock door",
  "Send notification",
  "Play music",
  "Run scene",
  "Start appliance",
  "Arm/Disarm security",
]
const whenOptions = [
  "Every day",
  "Weekdays only",
  "Weekends only",
  "Once",
  "Repeating",
]

interface BuilderStep {
  type: "IF" | "THEN" | "WHEN" | "DEVICE"
  selected: string | null
}

export default function Automation() {
  const [items, setItems] = useState(() => {
    const stored = getStoredAutomations()
    return automations.map((item) => ({
      ...item,
      ...(stored.find((saved) => saved.id === item.id) ?? {}),
    }))
  })
  const [building, setBuilding] = useState(false)
  const [builderError, setBuilderError] = useState("")
  const [steps, setSteps] = useState<BuilderStep[]>([
    { type: "IF", selected: null },
    { type: "THEN", selected: null },
    { type: "WHEN", selected: null },
    { type: "DEVICE", selected: null },
  ])

  const toggle = (id: number) => {
    setItems((prev) => {
      const next = prev.map((a) =>
        a.id === id ? { ...a, active: !a.active } : a,
      )
      saveStoredAutomations(
        next.map(
          ({
            icon: _icon,
            lastRan: _lastRan,
            color: _color,
            runs: _runs,
            ...automation
          }) => automation,
        ),
      )
      return next
    })
  }

  useEffect(() => {
    const refresh = () => {
      const stored = getStoredAutomations()
      setItems((prev) =>
        prev.map((item) => ({
          ...item,
          ...(stored.find((saved) => saved.id === item.id) ?? {}),
        })),
      )
    }
    window.addEventListener("smarthome_automations_change", refresh)
    return () =>
      window.removeEventListener("smarthome_automations_change", refresh)
  }, [])

  const selectStep = (idx: number, val: string) => {
    setBuilderError("")
    setSteps((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, selected: val } : s)),
    )
  }

  const resetBuilder = () => {
    setSteps([
      { type: "IF", selected: null },
      { type: "THEN", selected: null },
      { type: "WHEN", selected: null },
      { type: "DEVICE", selected: null },
    ])
    setBuilderError("")
  }

  const saveAutomation = () => {
    if (steps.some((step) => !step.selected)) {
      setBuilderError("Please select one option in each section.")
      return
    }

    const selected = steps.map((step) => step.selected as string)
    setItems((prev) => [
      ...prev,
      {
        id: Math.max(...prev.map((item) => item.id), 0) + 1,
        name: "Custom Automation",
        icon: "⚡",
        trigger: `${selected[0]}: ${selected[2]}`,
        actions: [selected[1], `Device: ${selected[3]}`],
        active: true,
        lastRan: "Not yet run",
        color: "#007AFF",
        runs: 0,
      },
    ])
    resetBuilder()
    setBuilding(false)
  }

  return (
    <div style={{ padding: "clamp(16px, 3vw, 32px)", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 16,
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
            Automation
          </h1>
          <p style={{ fontSize: 14, color: "#6E6E73", margin: 0 }}>
            {items.filter((a) => a.active).length} active ·{" "}
            {items.reduce((a, i) => a + i.runs, 0)} total runs
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
          style={{ padding: "10px 18px", fontSize: 14 }}
          onClick={() => {
            resetBuilder()
            setBuilding(true)
          }}
        >
          <Plus size={16} /> New Automation
        </button>
      </div>

      {/* Builder panel */}
      {building && (
        <div
          className="glass-card dashboard-card animate-fade-in"
          style={{ padding: 28, marginBottom: 24 }}
        >
          <h2
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#1D1D1F",
              margin: "0 0 20px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <GitBranch size={18} color="#007AFF" />
            Automation Builder
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {steps.map((step, idx) => (
              <div key={step.type}>
                <BuilderStep
                  type={step.type}
                  selected={step.selected}
                  options={
                    step.type === "IF"
                      ? ifOptions
                      : step.type === "THEN"
                        ? thenOptions
                        : step.type === "WHEN"
                          ? whenOptions
                          : ["Living Room", "Bedroom", "Kitchen", "All rooms"]
                  }
                  onSelect={(val) => selectStep(idx, val)}
                />
                {idx < steps.length - 1 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      margin: "4px 0",
                    }}
                  >
                    <ArrowDown size={16} color="#6E6E73" />
                  </div>
                )}
              </div>
            ))}
          </div>
          {builderError && (
            <p
              role="alert"
              style={{ color: "#FF3B30", fontSize: 12, margin: "16px 0 0" }}
            >
              {builderError}
            </p>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button
              type="button"
              className="btn-primary"
              style={{ padding: "10px 20px", fontSize: 14 }}
              onClick={saveAutomation}
            >
              Save Automation
            </button>
            <button
              type="button"
              className="btn-ghost"
              style={{ padding: "10px 20px", fontSize: 14 }}
              onClick={() => {
                resetBuilder()
                setBuilding(false)
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Automation cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        {items.map((a) => (
          <div
            key={a.id}
            className="glass-card dashboard-card automation-card"
            style={{
              padding: 24,
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.25s ease",
              opacity: a.active ? 1 : 0.65,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-2px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            {/* Header row */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: `${a.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                  }}
                >
                  {a.icon}
                </div>
                <div>
                  <h3
                    style={{
                      margin: "0 0 2px",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#1D1D1F",
                    }}
                  >
                    {a.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: 12, color: "#6E6E73" }}>
                    {a.runs} runs · Last: {a.lastRan}
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={a.active}
                aria-label={`Toggle ${a.name}`}
                onClick={() => toggle(a.id)}
                style={{
                  width: 44,
                  height: 26,
                  borderRadius: 13,
                  background: a.active ? a.color : "rgba(120,120,128,0.2)",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                  flexShrink: 0,
                  border: "none",
                  padding: 0,
                  outline: "none",
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
                    transform: a.active ? "translateX(18px)" : "none",
                    transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                />
              </button>
            </div>

            {/* Trigger */}
            <div
              style={{
                background: "rgba(0,0,0,0.03)",
                borderRadius: 10,
                padding: "8px 12px",
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Clock size={13} color="#6E6E73" />
              <span style={{ fontSize: 12, color: "#6E6E73" }}>
                {a.trigger}
              </span>
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                marginBottom: 16,
              }}
            >
              {a.actions.slice(0, 3).map((action, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <div
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: a.color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 13, color: "#1D1D1F" }}>
                    {action}
                  </span>
                </div>
              ))}
              {a.actions.length > 3 && (
                <span
                  style={{ fontSize: 12, color: "#6E6E73", marginLeft: 13 }}
                >
                  +{a.actions.length - 3} more actions
                </span>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: "auto",
                paddingTop: 8,
              }}
            >
              <button
                type="button"
                style={{
                  flex: 1,
                  background: "rgba(0,0,0,0.04)",
                  border: "none",
                  borderRadius: 10,
                  padding: "8px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#1D1D1F",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <Play size={13} color="#007AFF" /> Run Now
              </button>
              <button
                type="button"
                style={{
                  flex: 1,
                  background: "rgba(0,0,0,0.04)",
                  border: "none",
                  borderRadius: 10,
                  padding: "8px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#1D1D1F",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                Edit <ChevronRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BuilderStep({
  type,
  selected,
  options,
  onSelect,
}: {
  type: string
  selected: string | null
  options: string[]
  onSelect: (val: string) => void
}) {
  const colors: Record<string, string> = {
    IF: "#007AFF",
    THEN: "#34C759",
    WHEN: "#FF9F0A",
    DEVICE: "#AF52DE",
  }

  const icons: Record<string, React.ReactNode> = {
    IF: <Zap size={14} />,
    THEN: <GitBranch size={14} />,
    WHEN: <Clock size={14} />,
    DEVICE: <MapPin size={14} />,
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        padding: "12px 16px",
        background: selected ? `${colors[type]}08` : "rgba(0,0,0,0.03)",
        borderRadius: 14,
        border: `1px solid ${selected ? `${colors[type]}20` : "transparent"}`,
        alignItems: "center",
      }}
    >
      <div
        style={{
          minWidth: 76,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: colors[type],
          fontWeight: 700,
          fontSize: 13,
        }}
      >
        {icons[type]}
        {type}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, flex: 1 }}>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onSelect(o)}
            style={{
              background: selected === o ? colors[type] : "rgba(0,0,0,0.06)",
              color: selected === o ? "white" : "#1D1D1F",
              border: "none",
              borderRadius: 8,
              padding: "5px 12px",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}
