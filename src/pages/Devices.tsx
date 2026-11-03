import * as React from "react"
import {
  Lightbulb,
  Wind,
  Tv,
  Zap,
  Thermometer,
  RefrigeratorIcon,
  WashingMachine,
  Flame,
  Power,
  Clock,
  X,
  Bot,
  Battery,
  Search,
} from "lucide-react"
import {
  getStoredDevices,
  getStoredRooms,
  saveStoredDevices,
  type RoomState,
} from "../utils/aiCommandParser"
import { getCurrentUser } from "../services/auth"
import CleaningRobotPanel from "../components/CleaningRobotPanel"
import {
  getCleaningRobotData,
  type CleaningRobotData,
} from "../services/cleaningRobot"

const allDevices = [
  {
    id: 1,
    name: "Living Room Light",
    type: "light",
    room: "Living Room",
    on: true,
    brightness: 100,
    energy: 0.06,
    icon: <Lightbulb size={26} />,
    color: "#FF9F0A",
    schedule: "Auto off 11pm",
  },
  {
    id: 2,
    name: "Bedroom Ceiling",
    type: "light",
    room: "Bedroom",
    on: false,
    brightness: 100,
    energy: 0,
    icon: <Lightbulb size={26} />,
    color: "#FF9F0A",
    schedule: "Sunrise",
  },
  {
    id: 3,
    name: "Kitchen Fan",
    type: "fan",
    room: "Kitchen",
    on: true,
    speed: 3,
    energy: 0.05,
    icon: <Wind size={26} />,
    color: "#5AC8FA",
    schedule: "Manual",
  },
  {
    id: 4,
    name: "Living AC",
    type: "ac",
    room: "Living Room",
    on: true,
    temp: 22,
    energy: 1.2,
    icon: <Thermometer size={26} />,
    color: "#007AFF",
    schedule: "Auto",
  },
  {
    id: 5,
    name: "Samsung TV",
    type: "tv",
    room: "Living Room",
    on: false,
    energy: 0,
    icon: <Tv size={26} />,
    color: "#1D1D1F",
    schedule: "None",
  },
  {
    id: 6,
    name: "Smart Plug A",
    type: "plug",
    room: "Office",
    on: true,
    energy: 0.3,
    icon: <Power size={26} />,
    color: "#34C759",
    schedule: "None",
  },
  {
    id: 7,
    name: "Refrigerator",
    type: "fridge",
    room: "Kitchen",
    on: true,
    temp: 4,
    energy: 0.15,
    icon: <RefrigeratorIcon size={26} />,
    color: "#5AC8FA",
    schedule: "Always on",
  },
  {
    id: 8,
    name: "Washing Machine",
    type: "washer",
    room: "Utility",
    on: false,
    energy: 0,
    icon: <WashingMachine size={26} />,
    color: "#AF52DE",
    schedule: "8:00 AM",
  },
  {
    id: 9,
    name: "Water Heater",
    type: "heater",
    room: "Bathroom",
    on: true,
    temp: 55,
    energy: 2.1,
    icon: <Flame size={26} />,
    color: "#FF3B30",
    schedule: "6am - 8am",
  },
  {
    id: 10,
    name: "Bedroom AC",
    type: "ac",
    room: "Bedroom",
    on: true,
    temp: 21,
    energy: 0.9,
    icon: <Thermometer size={26} />,
    color: "#007AFF",
    schedule: "Night mode",
  },
  {
    id: 11,
    name: "Garden Light",
    type: "light",
    room: "Garden",
    on: true,
    brightness: 100,
    energy: 0.04,
    icon: <Lightbulb size={26} />,
    color: "#FF9F0A",
    schedule: "Dusk to dawn",
  },
  {
    id: 12,
    name: "Office Fan",
    type: "fan",
    room: "Office",
    on: false,
    speed: 0,
    energy: 0,
    icon: <Wind size={26} />,
    color: "#5AC8FA",
    schedule: "Manual",
  },
]

const categories = [
  "All",
  "Lights",
  "Climate",
  "Entertainment",
  "Security",
  "Appliances",
  "Robot Vacuum",
]

export default function Devices() {
  const [devices, setDevices] = React.useState(() => {
    const stored = getStoredDevices()
    return allDevices.map((device) => ({
      ...device,
      ...(stored.find((item) => item.id === device.id) ?? {}),
    }))
  })
  const [category, setCategory] = React.useState("All")
  const [roomFilter, setRoomFilter] = React.useState("All rooms")
  const [deviceSearch, setDeviceSearch] = React.useState("")
  const [selected, setSelected] = React.useState<number | null>(null)
  const [robotOpen, setRobotOpen] = React.useState(false)
  const [rooms, setRooms] = React.useState<RoomState[]>(() => getStoredRooms())
  const ownerId = getCurrentUser()?.id ?? "homeowner"
  const [robotData, setRobotData] = React.useState<CleaningRobotData>(() =>
    getCleaningRobotData(ownerId),
  )
  const [showScheduleModal, setShowScheduleModal] = React.useState(false)
  const [schedules, setSchedules] = React.useState<Record<number, any>>({})
  const [toast, setToast] = React.useState<{
    message: string
    type: "success" | "error"
  } | null>(null)

  const toggleDevice = (id: number) => {
    setDevices((prev) => {
      const next = prev.map((d) => (d.id === id ? { ...d, on: !d.on } : d))
      saveStoredDevices(next.map(({ icon: _icon, ...device }) => device))
      return next
    })
  }

  React.useEffect(() => {
    const refresh = () => {
      const stored = getStoredDevices()
      setDevices((prev) =>
        prev.map((device) => ({
          ...device,
          ...(stored.find((item) => item.id === device.id) ?? {}),
        })),
      )
    }
    window.addEventListener("smarthome_devices_change", refresh)
    return () => window.removeEventListener("smarthome_devices_change", refresh)
  }, [])

  React.useEffect(() => {
    const refreshRooms = () => setRooms(getStoredRooms())
    window.addEventListener("smarthome_rooms_change", refreshRooms)
    return () => window.removeEventListener("smarthome_rooms_change", refreshRooms)
  }, [])

  React.useEffect(() => {
    const refreshRobot = (event: Event) => {
      const detail = (event as CustomEvent<{ ownerId: string; data: CleaningRobotData }>).detail
      if (detail?.ownerId === ownerId) setRobotData(detail.data)
    }
    window.addEventListener("smarthome_cleaning_robot_change", refreshRobot)
    return () => window.removeEventListener("smarthome_cleaning_robot_change", refreshRobot)
  }, [ownerId])

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const filtered = devices.filter((d) => {
    if (roomFilter !== "All rooms" && d.room !== roomFilter) return false
    const query = deviceSearch.trim().toLowerCase()
    if (
      query &&
      !`${d.name} ${d.room} ${d.type}`.toLowerCase().includes(query)
    ) {
      return false
    }
    if (category === "All") return true
    if (category === "Lights") return d.type === "light"
    if (category === "Climate") return ["ac", "fan", "heater"].includes(d.type)
    if (category === "Entertainment") return d.type === "tv"
    if (category === "Appliances")
      return ["fridge", "washer", "plug"].includes(d.type)
    if (category === "Robot Vacuum") return false
    return true
  })
  const robotQuery = "smart cleaning robot robot vacuum"
  const robotSearchMatches =
    !deviceSearch.trim() ||
    robotQuery.includes(deviceSearch.trim().toLowerCase())
  const showRobotCard =
    (category === "All" || category === "Robot Vacuum") &&
    roomFilter === "All rooms" &&
    robotSearchMatches

  const selectedDevice = selected
    ? devices.find((d) => d.id === selected)
    : null

  function hexToRgba(hex: string, alpha: number) {
    const c = hex.replace("#", "")
    const r = parseInt(c.substring(0, 2), 16)
    const g = parseInt(c.substring(2, 4), 16)
    const b = parseInt(c.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  if (robotOpen) {
    return (
      <CleaningRobotPanel
        ownerId={ownerId}
        rooms={rooms}
        onBack={() => setRobotOpen(false)}
      />
    )
  }

  return (
    <div
      className={`devices-page ${selected ? "has-selection" : ""}`}
      style={{
        padding: 32,
        minHeight: "100%",
        display: "grid",
        gap: 20,
        transition: "grid-template-columns 0.3s ease",
      }}
    >
      {/* Left panel */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
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
              Devices
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "#6E6E73",
                margin: 0,
                fontWeight: 500,
              }}
            >
              {devices.filter((d) => d.on).length} active ·{" "}
              {devices.reduce((a, d) => a + d.energy, 0).toFixed(1)} kW total
            </p>
          </div>
        </div>

        {/* Category filter */}
        <div className="segmented-control" style={{ marginBottom: 24 }}>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={category === c ? "active" : ""}
              onClick={() => setCategory(c)}
            >
              {c === "All" ? (
                <>
                  <span className="device-category-desktop-label">All</span>
                  <span className="device-category-mobile-label">All Devices</span>
                </>
              ) : (
                c
              )}
            </button>
          ))}
        </div>

        <div className="mobile-device-filters">
          <label className="mobile-device-search">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              value={deviceSearch}
              onChange={(event) => setDeviceSearch(event.target.value)}
              placeholder="Search devices or rooms"
              aria-label="Search devices or rooms"
            />
          </label>
          <div className="mobile-room-filters" role="group" aria-label="Filter devices by room">
            {["All rooms", ...rooms.map((room) => room.name)].map((room) => (
              <button
                key={room}
                type="button"
                className={roomFilter === room ? "active" : ""}
                aria-pressed={roomFilter === room}
                onClick={() => setRoomFilter(room)}
              >
                {room}
              </button>
            ))}
          </div>
        </div>

        {/* Device grid */}
        <div
          className="device-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 14,
          }}
        >
          {filtered.map((device) => (
            <div
              key={device.id}
              onClick={() =>
                setSelected(selected === device.id ? null : device.id)
              }
              className="glass-card dashboard-card"
              style={{
                padding: "20px",
                cursor: "pointer",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                position: "relative",
                background: device.on
                  ? `linear-gradient(135deg, ${hexToRgba(device.color, 0.12)}, var(--glass-surface-soft))`
                  : undefined,
                boxShadow: device.on
                  ? `0 16px 40px ${hexToRgba(device.color, 0.12)}`
                  : undefined,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)"
                e.currentTarget.style.boxShadow = device.on
                  ? `0 18px 48px ${hexToRgba(device.color, 0.14)}`
                  : "0 18px 45px rgba(0,0,0,0.14)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = device.on
                  ? `0 16px 40px ${hexToRgba(device.color, 0.12)}`
                  : ""
              }}
            >
              {/* Toggle */}
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleDevice(device.id)
                }}
              >
                <Toggle
                  on={device.on}
                  color={device.on ? "white" : device.color}
                />
              </div>

              {/* Icon */}
              <div
                className="device-icon"
                style={{
                  marginBottom: 12,
                  width: 52,
                  height: 52,
                  borderRadius: 15,
                  display: "grid",
                  placeItems: "center",
                  background: device.on
                    ? device.color
                    : "rgba(120,120,128,0.25)",
                  color: "#FFFFFF",
                  boxShadow: device.on
                    ? `0 16px 30px ${hexToRgba(device.color, 0.22)}`
                    : "none",
                  border: "1px solid rgba(255,255,255,0.24)",
                  flexShrink: 0,
                }}
              >
                {React.isValidElement(device.icon)
                  ? React.cloneElement(device.icon as React.ReactElement, {
                      color: device.on ? "#FFFFFF" : device.color,
                      size: 26,
                    } as any)
                  : device.icon}
              </div>

              <p
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#1D1D1F",
                  margin: "0 0 3px",
                  paddingRight: 40,
                }}
              >
                {device.name}
              </p>
              <p style={{ fontSize: 12, color: "#6E6E73", margin: "0 0 10px" }}>
                {device.room}
              </p>

              {/* Energy */}
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Zap size={12} color="#6E6E73" />
                <span style={{ fontSize: 12, color: "#6E6E73" }}>
                  {device.on ? `${device.energy} kW` : "Off"}
                </span>
              </div>

              {/* Schedule */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 4,
                }}
              >
                <Clock size={12} color="#86868B" />
                <span style={{ fontSize: 11, color: "#86868B" }}>
                  {device.schedule}
                </span>
              </div>
            </div>
          ))}
          {showRobotCard && (
            <article
              className="glass-card dashboard-card robot-device-card"
              aria-label="Smart Cleaning Robot device"
            >
              <div className="robot-device-card-top">
                <div className="robot-device-icon"><Bot size={26} /></div>
                <span className="robot-device-online"><i /> Online</span>
              </div>
              <div className="robot-device-title-row">
                <div>
                  <h3>Smart Cleaning Robot</h3>
                  <p>Robot Vacuum · Simulated</p>
                </div>
              </div>
              <div className="robot-device-metrics">
                <span><Battery size={15} /> Battery</span>
                <strong>{robotData.battery}%</strong>
              </div>
              <div className="robot-device-metrics">
                <span>Status</span>
                <strong>{robotData.status}</strong>
              </div>
              <div className="robot-device-metrics">
                <span>Cleaning mode</span>
                <strong>{robotData.mode}</strong>
              </div>
              <button
                type="button"
                className="robot-manage-button"
                onClick={() => {
                  setSelected(null)
                  setRobotOpen(true)
                }}
              >
                Manage Robot
              </button>
            </article>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selectedDevice && (
        <div
          className="glass-card animate-slide-in"
          style={{
            padding: 24,
            height: "fit-content",
            position: "sticky",
            top: 120,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                background: selectedDevice.on
                  ? selectedDevice.color
                  : "rgba(120,120,128,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                boxShadow: selectedDevice.on
                  ? `0 16px 30px ${hexToRgba(selectedDevice.color, 0.22)}`
                  : "none",
                border: "1px solid rgba(255,255,255,0.24)",
                flexShrink: 0,
              }}
            >
              {React.isValidElement(selectedDevice.icon)
                ? React.cloneElement(
                    selectedDevice.icon as React.ReactElement,
                    {
                      size: 28,
                      color: "#FFFFFF",
                    } as any,
                  )
                : selectedDevice.icon}
            </div>
            <button
              type="button"
              aria-label="Close device details"
              onClick={() => setSelected(null)}
              style={{
                width: 34,
                height: 34,
                display: "grid",
                placeItems: "center",
                border: "1px solid rgba(255,255,255,0.6)",
                borderRadius: 10,
                background: "rgba(255,255,255,0.3)",
                color: "#1D1D1F",
                cursor: "pointer",
              }}
            >
              <X size={18} />
            </button>
          </div>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#1D1D1F",
              margin: "0 0 4px",
            }}
          >
            {selectedDevice.name}
          </h2>
          <p style={{ fontSize: 13, color: "#6E6E73", margin: "0 0 24px" }}>
            {selectedDevice.room} · {selectedDevice.on ? "On" : "Off"}
          </p>

          {/* Toggle */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 0",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, color: "#1D1D1F" }}>
              Power
            </span>
            <Toggle
              on={selectedDevice.on}
              color={selectedDevice.color}
              onClick={() => toggleDevice(selectedDevice.id)}
              large
            />
          </div>

          {/* Brightness slider */}
          {"brightness" in selectedDevice && (
            <div
              style={{
                padding: "14px 0",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{ fontSize: 14, fontWeight: 600, color: "#1D1D1F" }}
                >
                  Brightness
                </span>
                <span
                  style={{ fontSize: 14, color: "#007AFF", fontWeight: 600 }}
                >
                  {(selectedDevice as { brightness?: number }).brightness ?? 0}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                defaultValue={
                  (selectedDevice as { brightness?: number }).brightness ?? 80
                }
                style={{ width: "100%", accentColor: selectedDevice.color }}
              />
            </div>
          )}

          {/* Temperature */}
          {"temp" in selectedDevice && selectedDevice.type !== "fridge" && (
            <div
              style={{
                padding: "14px 0",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{ fontSize: 14, fontWeight: 600, color: "#1D1D1F" }}
                >
                  Temperature
                </span>
                <span
                  style={{ fontSize: 14, color: "#007AFF", fontWeight: 600 }}
                >
                  {(selectedDevice as { temp?: number }).temp ?? 22}°C
                </span>
              </div>
              <input
                type="range"
                min={16}
                max={30}
                defaultValue={(selectedDevice as { temp?: number }).temp ?? 22}
                style={{ width: "100%", accentColor: selectedDevice.color }}
              />
            </div>
          )}

          {/* Energy */}
          <div
            style={{
              padding: "14px 0",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1D1D1F" }}>
                Energy Usage
              </span>
              <span style={{ fontSize: 14, color: "#FF9F0A", fontWeight: 600 }}>
                {selectedDevice.on ? `${selectedDevice.energy} kW` : "0 W"}
              </span>
            </div>
          </div>

          {/* Schedule */}
          <div
            style={{
              padding: "14px 0",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1D1D1F" }}>
                Schedule
              </span>
              {schedules[selectedDevice.id] ? (
                <span
                  style={{ fontSize: 13, color: "#007AFF", fontWeight: 600 }}
                >
                  {schedules[selectedDevice.id].time} ·{" "}
                  {schedules[selectedDevice.id].repeat}
                </span>
              ) : (
                <span style={{ fontSize: 13, color: "#6E6E73" }}>
                  {selectedDevice.schedule}
                </span>
              )}
            </div>
          </div>

          {/* Automation */}
          <div style={{ padding: "14px 0" }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#1D1D1F",
                display: "block",
                marginBottom: 8,
              }}
            >
              Automation
            </span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["Good Morning", "Good Night"].map((a) => (
                <span
                  key={a}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    background: "rgba(0,122,255,0.1)",
                    color: "#007AFF",
                    borderRadius: 6,
                    padding: "3px 8px",
                  }}
                >
                  {a}
                </span>
              ))}
            </div>
          </div>

          <button
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
            onClick={() => setShowScheduleModal(true)}
          >
            <Clock size={15} /> Schedule
          </button>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && selectedDevice && (
        <ScheduleModal
          device={selectedDevice}
          schedule={schedules[selectedDevice.id]}
          onClose={() => setShowScheduleModal(false)}
          onSave={(schedule) => {
            setSchedules((prev) => ({ ...prev, [selectedDevice.id]: schedule }))
            showToast("Schedule saved successfully")
            setShowScheduleModal(false)
          }}
          onDelete={() => {
            setSchedules((prev) => {
              const updated = { ...prev }
              delete updated[selectedDevice.id]
              return updated
            })
            showToast("Schedule removed")
            setShowScheduleModal(false)
          }}
          hexToRgba={hexToRgba}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: 24,
            background:
              toast.type === "success"
                ? "rgba(52, 199, 89, 0.95)"
                : "rgba(255, 59, 48, 0.95)",
            color: "white",
            padding: "12px 16px",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
            animation: "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            zIndex: 9999,
          }}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}

interface Schedule {
  time: string
  repeat: "once" | "daily" | "weekdays" | "weekends"
  action: "on" | "off"
  brightness?: number
  temperature?: number
  speed?: number
  enabled: boolean
}

function ScheduleModal({
  device,
  schedule,
  onClose,
  onSave,
  onDelete,
  hexToRgba,
}: {
  device: any
  schedule?: Schedule
  onClose: () => void
  onSave: (schedule: Schedule) => void
  onDelete: () => void
  hexToRgba: (hex: string, alpha: number) => string
}) {
  const [time, setTime] = React.useState(schedule?.time || "08:00")
  const [repeat, setRepeat] =
    React.useState<"once" | "daily" | "weekdays" | "weekends">(
      schedule?.repeat || "daily",
    )
  const [action, setAction] = React.useState<"on" | "off">(
    schedule?.action || "on",
  )
  const [brightness, setBrightness] = React.useState(
    schedule?.brightness || 100,
  )
  const [temperature, setTemperature] = React.useState(
    schedule?.temperature || 22,
  )
  const [speed, setSpeed] = React.useState(schedule?.speed || 1)
  const [enabled, setEnabled] = React.useState(schedule?.enabled !== false)

  const handleSave = () => {
    const newSchedule: Schedule = {
      time,
      repeat,
      action,
      brightness: "brightness" in device ? brightness : undefined,
      temperature: ["ac", "heater"].includes(device.type)
        ? temperature
        : undefined,
      speed: device.type === "fan" ? speed : undefined,
      enabled,
    }
    onSave(newSchedule)
  }

  return (
    <>
      {/* Modal Backdrop */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: 1000,
          animation: "fadeIn 0.2s ease",
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="portal-glass-surface"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          border: "1px solid rgba(255, 255, 255, 0.55)",
          borderRadius: 24,
          boxShadow:
            "0 20px 60px rgba(0, 0, 0, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.8)",
          padding: 32,
          maxWidth: 420,
          width: "calc(100% - 32px)",
          maxHeight: "calc(100vh - 80px)",
          overflowY: "auto",
          zIndex: 1001,
          animation: "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }
        `}</style>

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: device.on ? device.color : "rgba(120,120,128,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              boxShadow: device.on
                ? `0 12px 24px ${hexToRgba(device.color, 0.22)}`
                : "none",
              border: "1px solid rgba(255,255,255,0.24)",
            }}
          >
            {React.isValidElement(device.icon)
              ? React.cloneElement(device.icon as React.ReactElement, {
                  size: 24,
                  color: "#FFFFFF",
                } as any)
              : device.icon}
          </div>
          <div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#1D1D1F",
                margin: 0,
              }}
            >
              {device.name}
            </h3>
            <p style={{ fontSize: 12, color: "#6E6E73", margin: "2px 0 0" }}>
              {schedule ? "Edit schedule" : "Create new schedule"}
            </p>
          </div>
        </div>

        {/* Time Picker */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#1D1D1F",
              display: "block",
              marginBottom: 8,
            }}
          >
            Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.08)",
              fontSize: 14,
              fontWeight: 500,
              background: "rgba(255,255,255,0.5)",
              color: "#1D1D1F",
              cursor: "pointer",
            }}
          />
        </div>

        {/* Repeat Options */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#1D1D1F",
              display: "block",
              marginBottom: 8,
            }}
          >
            Repeat
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 8,
            }}
          >
            {(["once", "daily", "weekdays", "weekends"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRepeat(r)}
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: `2px solid ${
                    repeat === r ? "#007AFF" : "rgba(0,0,0,0.08)"
                  }`,
                  background:
                    repeat === r
                      ? "rgba(0,122,255,0.1)"
                      : "rgba(255,255,255,0.5)",
                  fontSize: 12,
                  fontWeight: 600,
                  color: repeat === r ? "#007AFF" : "#1D1D1F",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textTransform: "capitalize",
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Action */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#1D1D1F",
              display: "block",
              marginBottom: 8,
            }}
          >
            Action
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 8,
            }}
          >
            {(["on", "off"] as const).map((a) => (
              <button
                key={a}
                onClick={() => setAction(a)}
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: `2px solid ${
                    action === a ? "#007AFF" : "rgba(0,0,0,0.08)"
                  }`,
                  background:
                    action === a
                      ? "rgba(0,122,255,0.1)"
                      : "rgba(255,255,255,0.5)",
                  fontSize: 12,
                  fontWeight: 600,
                  color: action === a ? "#007AFF" : "#1D1D1F",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textTransform: "uppercase",
                }}
              >
                Turn {a}
              </button>
            ))}
          </div>
        </div>

        {/* Device-Specific Controls */}
        {"brightness" in device && (
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <label
                style={{ fontSize: 13, fontWeight: 600, color: "#1D1D1F" }}
              >
                Brightness
              </label>
              <span style={{ fontSize: 12, color: "#007AFF", fontWeight: 600 }}>
                {brightness}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: "#007AFF",
              }}
            />
          </div>
        )}

        {["ac", "heater"].includes(device.type) && (
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <label
                style={{ fontSize: 13, fontWeight: 600, color: "#1D1D1F" }}
              >
                Temperature
              </label>
              <span style={{ fontSize: 12, color: "#007AFF", fontWeight: 600 }}>
                {temperature}°C
              </span>
            </div>
            <input
              type="range"
              min={16}
              max={30}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: "#007AFF",
              }}
            />
          </div>
        )}

        {device.type === "fan" && (
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#1D1D1F",
                display: "block",
                marginBottom: 8,
              }}
            >
              Speed Level: {speed}
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 8,
              }}
            >
              {[1, 2, 3].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: `2px solid ${
                      speed === s ? "#007AFF" : "rgba(0,0,0,0.08)"
                    }`,
                    background:
                      speed === s
                        ? "rgba(0,122,255,0.1)"
                        : "rgba(255,255,255,0.5)",
                    fontSize: 12,
                    fontWeight: 600,
                    color: speed === s ? "#007AFF" : "#1D1D1F",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Enable/Disable Toggle */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 0",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            marginBottom: 20,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1D1D1F" }}>
            Enable Schedule
          </span>
          <SmallToggle on={enabled} color="#007AFF" onChange={setEnabled} />
        </div>

        {/* Buttons */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "rgba(255,255,255,0.5)",
              fontSize: 14,
              fontWeight: 600,
              color: "#1D1D1F",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0,0,0,0.05)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.5)"
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "none",
              background: "#007AFF",
              fontSize: 14,
              fontWeight: 600,
              color: "white",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 8px 24px rgba(0,122,255,0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#0051CC"
              e.currentTarget.style.boxShadow =
                "0 12px 32px rgba(0,122,255,0.4)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#007AFF"
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,122,255,0.3)"
            }}
          >
            Save Schedule
          </button>
        </div>

        {/* Delete Button */}
        {schedule && (
          <button
            onClick={onDelete}
            style={{
              width: "100%",
              padding: "10px 16px",
              borderRadius: 12,
              border: "1px solid rgba(255,59,48,0.3)",
              background: "rgba(255,59,48,0.1)",
              fontSize: 13,
              fontWeight: 600,
              color: "#D70015",
              cursor: "pointer",
              transition: "all 0.2s ease",
              marginTop: 12,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,59,48,0.2)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,59,48,0.1)"
            }}
          >
            Remove Schedule
          </button>
        )}
      </div>
    </>
  )
}

function SmallToggle({
  on,
  color,
  onChange,
}: {
  on: boolean
  color: string
  onChange?: (value: boolean) => void
}) {
  const [active, setActive] = React.useState(on)

  const handleChange = (newValue: boolean) => {
    setActive(newValue)
    onChange?.(newValue)
  }

  return (
    <div
      onClick={() => handleChange(!active)}
      style={{
        width: 38,
        height: 22,
        borderRadius: 11,
        background: active ? color : "rgba(120,120,128,0.25)",
        position: "relative",
        cursor: "pointer",
        transition: "background 0.2s ease",
        flexShrink: 0,
        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 2,
          left: 2,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "white",
          transition: "left 0.2s ease",
          transform: active ? "translateX(16px)" : "translateX(0)",
          boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
        }}
      />
    </div>
  )
}

function Toggle({
  on,
  color,
  onClick,
  large = false,
}: {
  on: boolean
  color: string
  onClick?: () => void
  large?: boolean
}) {
  const w = large ? 51 : 44
  const h = large ? 31 : 26
  const thumb = large ? 27 : 20
  const offset = large ? 2 : 3

  return (
    <div
      onClick={onClick}
      style={{
        width: w,
        height: h,
        borderRadius: 999,
        background: on ? color : "rgba(120,120,128,0.25)",
        position: "relative",
        cursor: "pointer",
        transition: "background 0.25s ease",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: offset,
          left: offset,
          width: thumb,
          height: thumb,
          borderRadius: "50%",
          background: "white",
          boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
          transform: on
            ? `translateX(${w - thumb - offset * 2}px)`
            : "translateX(0)",
          transition: "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </div>
  )
}
