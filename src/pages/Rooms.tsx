import * as React from "react"
import {
  Thermometer,
  Droplets,
  Lightbulb,
  Wind,
  Plus,
  ChevronRight,
  Trash2,
  X,
  Tv,
  Zap,
  Flame,
  Power,
} from "lucide-react"
import roomLiving from "../Assets/room.png"
import roomBedroom from "../Assets/room5.jpg"
import roomGarden from "../Assets/garden.jpg"
import roomBathroom from "../Assets/bathroom.jpg"
import roomKitchen from "../Assets/kitchen.jpg"
import roomNeutral from "../Assets/garage.jpg"
import {
  getStoredDevices,
  getStoredRooms,
  saveStoredDevices,
  saveStoredRooms,
  type DeviceState,
} from "../utils/aiCommandParser"

const roomTypes = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Garage",
  "Garden",
  "Office",
  "Other",
] as const
type RoomType = typeof roomTypes[number]

const roomImages = [
  { label: "Living room", src: roomLiving },
  { label: "Bedroom", src: roomBedroom },
  { label: "Kitchen", src: roomKitchen },
  { label: "Bathroom", src: roomBathroom },
  { label: "Garage", src: roomNeutral },
  { label: "Garden", src: roomGarden },
]

type Room = {
  id: number
  name: string
  temp: number
  humidity: number
  devices: number
  activeDevices: number
  status: string
  img: string
  lights: boolean
  ac: boolean
  type?: RoomType
  isCustom?: boolean
}

export default function Rooms() {
  const [rooms, setRooms] = React.useState<Room[]>(() => {
    const imageForRoom = (name: string) =>
      roomImages.find((image) =>
        name.toLowerCase().includes(image.label.toLowerCase()),
      )?.src ?? roomNeutral
    return getStoredRooms().map((room) => ({
      ...room,
      img: imageForRoom(room.name),
    }))
  })
  const [devices, setDevices] = React.useState<DeviceState[]>(() =>
    getStoredDevices(),
  )
  const [selected, setSelected] = React.useState<number | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
  const [newRoomName, setNewRoomName] = React.useState("")
  const [newRoomType, setNewRoomType] = React.useState<RoomType>("Other")
  const [newRoomImage, setNewRoomImage] = React.useState(roomImages[0].src)
  const [nameError, setNameError] = React.useState("")

  React.useEffect(() => {
    saveStoredRooms(rooms.map(({ img: _img, ...room }) => room))
  }, [rooms])

  React.useEffect(() => {
    const refresh = () => {
      setRooms((prev) => {
        const stored = getStoredRooms()
        const current = prev.map(({ img: _img, ...room }) => room)
        if (JSON.stringify(stored) === JSON.stringify(current)) return prev
        const currentImages = new Map(prev.map((room) => [room.id, room.img]))
        return stored.map((room) => ({
          ...room,
          img: currentImages.get(room.id) ?? roomNeutral,
        }))
      })
    }
    window.addEventListener("smarthome_rooms_change", refresh)
    return () => window.removeEventListener("smarthome_rooms_change", refresh)
  }, [])

  React.useEffect(() => {
    const refreshDevices = () => setDevices(getStoredDevices())
    window.addEventListener("smarthome_devices_change", refreshDevices)
    return () =>
      window.removeEventListener("smarthome_devices_change", refreshDevices)
  }, [])

  React.useEffect(() => {
    if (selected === null) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null)
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [selected])

  const closeAddModal = () => {
    setIsAddModalOpen(false)
    setNewRoomName("")
    setNewRoomType("Other")
    setNewRoomImage(roomImages[0].src)
    setNameError("")
  }

  const addRoom = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = newRoomName.trim()
    if (!trimmedName) {
      setNameError("Please enter a room name.")
      return
    }
    if (
      rooms.some(
        (room) => room.name.toLowerCase() === trimmedName.toLowerCase(),
      )
    ) {
      setNameError("A room with this name already exists.")
      return
    }

    const nextRoom: Room = {
      id: Date.now(),
      name: trimmedName,
      type: newRoomType,
      img: newRoomImage,
      devices: 0,
      activeDevices: 0,
      temp: 22,
      humidity: 50,
      status: "idle",
      lights: false,
      ac: false,
      isCustom: true,
    }
    setRooms((prev) => [...prev, nextRoom])
    closeAddModal()
  }

  const removeRoom = (room: Room) => {
    if (!room.isCustom || !window.confirm(`Remove ${room.name}?`)) return
    setRooms((prev) => prev.filter((item) => item.id !== room.id))
    setSelected((current) => (current === room.id ? null : current))
  }

  const toggleLight = (id: number) => {
    const room = rooms.find((item) => item.id === id)
    if (!room) return
    const nextState = !room.lights
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, lights: !r.lights } : r)),
    )
    setDevices((prev) => {
      const next = prev.map((device) =>
        device.room === room.name && device.type === "light"
          ? { ...device, on: nextState }
          : device,
      )
      if (JSON.stringify(next) !== JSON.stringify(prev)) saveStoredDevices(next)
      return next
    })
  }

  const toggleAc = (id: number) => {
    const room = rooms.find((item) => item.id === id)
    if (!room) return
    const nextState = !room.ac
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, ac: !r.ac } : r)))
    setDevices((prev) => {
      const next = prev.map((device) =>
        device.room === room.name && device.type === "ac"
          ? { ...device, on: nextState }
          : device,
      )
      if (JSON.stringify(next) !== JSON.stringify(prev)) saveStoredDevices(next)
      return next
    })
  }

  const toggleRoomDevice = (deviceId: number) => {
    const device = devices.find((item) => item.id === deviceId)
    if (!device) return
    const changed = { ...device, on: !device.on }
    const next = devices.map((item) => (item.id === deviceId ? changed : item))
    setDevices(next)
    saveStoredDevices(next)
    if (changed.type === "light" || changed.type === "ac") {
      setRooms((currentRooms) =>
        currentRooms.map((room) => {
          if (room.name !== changed.room) return room
          return changed.type === "light"
            ? { ...room, lights: changed.on }
            : { ...room, ac: changed.on }
        }),
      )
    }
  }

  const selectedRoom =
    selected === null
      ? null
      : (rooms.find((room) => room.id === selected) ?? null)
  const selectedRoomDevices = selectedRoom
    ? devices.filter((device) => device.room === selectedRoom.name)
    : []

  return (
    <div
      className="rooms-page"
      style={{
        padding: 32,
        minHeight: "100vh",
        background: "rgba(255,255,255,0.04)",
      }}
    >
      {/* Header */}
      <div
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
            Rooms
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#6E6E73",
              margin: 0,
              fontWeight: 500,
            }}
          >
            {rooms.filter((r) => r.status === "active").length} rooms active ·{" "}
            {rooms.reduce((a, r) => a + r.activeDevices, 0)} devices on
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          style={{
            padding: "10px 18px",
            fontSize: 14,
            background: "rgba(255,255,255,0.36)",
            border: "1px solid rgba(255,255,255,0.65)",
            borderRadius: 18,
            color: "#1D1D1F",
            backdropFilter: "blur(18px) saturate(160%)",
            WebkitBackdropFilter: "blur(18px) saturate(160%)",
            boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Plus size={16} /> Add Room
        </button>
      </div>

      {/* Grid */}
      <div
        className="rooms-grid"
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
          gap: 20,
        }}
      >
        {rooms.map((room) => (
          <div
            key={room.id}
            className="glass-card dashboard-card"
            style={{ overflow: "hidden", padding: 0, cursor: "pointer" }}
            onClick={() => setSelected(selected === room.id ? null : room.id)}
          >
            {/* Room photo */}
            <div style={{ position: "relative", height: 160 }}>
              <img
                src={room.img}
                alt={room.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  background: "#E5E5EA",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.4) 100%)",
                }}
              />
              {/* Status badge */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background:
                    room.status === "active"
                      ? "rgba(52,199,89,0.9)"
                      : "rgba(142,142,147,0.9)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 20,
                  padding: "4px 10px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "white",
                }}
              >
                {room.activeDevices} on
              </div>
              {/* Room name on photo */}
              <div style={{ position: "absolute", bottom: 12, left: 16 }}>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#FFFFFF",
                    margin: 0,
                  }}
                >
                  {room.name}
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.75)",
                    margin: 0,
                  }}
                >
                  {room.type ? `${room.type} · ` : ""}
                  {room.devices} devices total
                </p>
              </div>
            </div>

            {/* Stats */}
            <div style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Thermometer size={14} color="#FF9F0A" />
                  <span
                    style={{ fontSize: 13, color: "#1D1D1F", fontWeight: 600 }}
                  >
                    {room.temp}°C
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Droplets size={14} color="#5AC8FA" />
                  <span
                    style={{ fontSize: 13, color: "#1D1D1F", fontWeight: 600 }}
                  >
                    {room.humidity}%
                  </span>
                </div>
              </div>

              {/* Quick controls */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  minHeight: 48,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <QuickControl
                    icon={<Lightbulb size={16} />}
                    label="Lights"
                    active={room.lights}
                    color="#FF9F0A"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleLight(room.id)
                    }}
                  />
                  {!["Bathroom", "Garage", "Garden"].includes(room.name) && (
                    <QuickControl
                      icon={<Wind size={16} />}
                      label="AC"
                      active={room.ac}
                      color="#5AC8FA"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleAc(room.id)
                      }}
                    />
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    justifyContent: "flex-end",
                    flexShrink: 0,
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelected(room.id)
                    }}
                    style={{
                      background: "rgba(0,122,255,0.12)",
                      border: "1px solid rgba(0,122,255,0.18)",
                      borderRadius: 12,
                      padding: "0 14px",
                      height: 38,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#007AFF",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      transition: "all 0.2s ease",
                    }}
                  >
                    Details <ChevronRight size={14} />
                  </button>
                  {room.isCustom && (
                    <button
                      type="button"
                      aria-label={`Remove ${room.name}`}
                      title="Remove room"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeRoom(room)
                      }}
                      style={{
                        flexShrink: 0,
                        background: "rgba(255,59,48,0.1)",
                        border: "1px solid rgba(255,59,48,0.18)",
                        borderRadius: 12,
                        width: 38,
                        height: 38,
                        display: "grid",
                        placeItems: "center",
                        color: "#FF3B30",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedRoom && (
        <div
          role="presentation"
          onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            display: "flex",
            justifyContent: "flex-end",
            background: "rgba(29,29,31,0.16)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            pointerEvents: "none",
          }}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="room-details-title"
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              width: "min(420px, 100vw)",
              height: "100%",
              overflowY: "auto",
              padding: 24,
              background: "rgba(255,255,255,0.42)",
              borderLeft: "1px solid rgba(255,255,255,0.58)",
              boxShadow:
                "-20px 0 60px rgba(26,50,65,0.14), inset 1px 0 0 rgba(255,255,255,0.55)",
              backdropFilter: "blur(30px) saturate(180%)",
              WebkitBackdropFilter: "blur(30px) saturate(180%)",
              animation: "room-details-slide-in 0.24s ease both",
              pointerEvents: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 16,
                marginBottom: 18,
              }}
            >
              <div>
                <h2
                  id="room-details-title"
                  style={{
                    margin: 0,
                    color: "#1D1D1F",
                    fontSize: 24,
                    fontWeight: 700,
                  }}
                >
                  {selectedRoom.name}
                </h2>
                <p
                  style={{ margin: "5px 0 0", color: "#6E6E73", fontSize: 13 }}
                >
                  {selectedRoom.devices} devices · {selectedRoom.activeDevices}{" "}
                  active
                </p>
              </div>
              <button
                type="button"
                aria-label="Close room details"
                onClick={() => setSelected(null)}
                style={detailsCloseButtonStyle}
              >
                <X size={18} />
              </button>
            </div>

            <img
              src={selectedRoom.img}
              alt={selectedRoom.name}
              style={{
                width: "100%",
                height: 180,
                objectFit: "cover",
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.58)",
                boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
              }}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                margin: "18px 0",
              }}
            >
              <DetailMetric
                icon={<Thermometer size={16} color="#FF9F0A" />}
                label="Temperature"
                value={`${selectedRoom.temp}°C`}
              />
              <DetailMetric
                icon={<Droplets size={16} color="#5AC8FA" />}
                label="Humidity"
                value={`${selectedRoom.humidity}%`}
              />
            </div>

            <h3 style={detailsSectionHeadingStyle}>Devices</h3>
            <div style={{ display: "grid", gap: 8 }}>
              {selectedRoomDevices.length > 0 ? (
                selectedRoomDevices.map((device) => (
                  <DeviceRow
                    key={device.id}
                    device={device}
                    onToggle={() => toggleRoomDevice(device.id)}
                  />
                ))
              ) : (
                <p style={emptyDetailsTextStyle}>
                  No devices registered for this room yet.
                </p>
              )}
            </div>

            <h3 style={{ ...detailsSectionHeadingStyle, marginTop: 22 }}>
              Room controls
            </h3>
            <div style={{ display: "grid", gap: 8 }}>
              <RoomStatusRow
                label="Lights"
                active={selectedRoom.lights}
                color="#FF9F0A"
                onClick={() => toggleLight(selectedRoom.id)}
              />
              {selectedRoom.ac ||
              !["Bathroom", "Garage", "Garden"].includes(selectedRoom.name) ? (
                <RoomStatusRow
                  label="Air Conditioning"
                  active={selectedRoom.ac}
                  color="#5AC8FA"
                  onClick={() => toggleAc(selectedRoom.id)}
                />
              ) : null}
            </div>
          </aside>
        </div>
      )}

      {isAddModalOpen && (
        <div
          role="presentation"
          onMouseDown={(e) => e.target === e.currentTarget && closeAddModal()}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            background: "rgba(29,29,31,0.26)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <form
            onSubmit={addRoom}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-room-title"
            style={{
              width: "100%",
              maxWidth: 460,
              maxHeight: "calc(100vh - 40px)",
              overflowY: "auto",
              padding: 28,
              borderRadius: 26,
              background: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(255,255,255,0.78)",
              boxShadow: "0 24px 70px rgba(0,0,0,0.2)",
              backdropFilter: "blur(30px) saturate(160%)",
              WebkitBackdropFilter: "blur(30px) saturate(160%)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 22,
              }}
            >
              <div>
                <h2
                  id="add-room-title"
                  style={{ margin: 0, fontSize: 22, color: "#1D1D1F" }}
                >
                  Add Room
                </h2>
                <p
                  style={{ margin: "5px 0 0", fontSize: 13, color: "#6E6E73" }}
                >
                  Create a new space for your home.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={closeAddModal}
                style={modalIconButtonStyle}
              >
                <X size={17} />
              </button>
            </div>

            <label style={fieldLabelStyle}>
              Room Name
              <input
                autoFocus
                value={newRoomName}
                onChange={(e) => {
                  setNewRoomName(e.target.value)
                  if (nameError) setNameError("")
                }}
                placeholder="e.g. Guest Room"
                style={modalInputStyle}
              />
            </label>
            {nameError && (
              <p
                style={{
                  margin: "-10px 0 14px",
                  fontSize: 12,
                  color: "#FF3B30",
                }}
              >
                {nameError}
              </p>
            )}

            <label style={fieldLabelStyle}>
              Room Type
              <select
                value={newRoomType}
                onChange={(e) => setNewRoomType(e.target.value as RoomType)}
                style={modalInputStyle}
              >
                {roomTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label style={fieldLabelStyle}>
              Room Image
              <select
                value={newRoomImage}
                onChange={(e) => setNewRoomImage(e.target.value)}
                style={modalInputStyle}
              >
                {roomImages.map((image) => (
                  <option key={image.src} value={image.src}>
                    {image.label}
                  </option>
                ))}
              </select>
            </label>

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button
                type="button"
                onClick={closeAddModal}
                style={{
                  ...modalButtonStyle,
                  background: "rgba(255,255,255,0.48)",
                  color: "#1D1D1F",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  ...modalButtonStyle,
                  background: "#007AFF",
                  color: "white",
                  boxShadow: "0 10px 22px rgba(0,122,255,0.2)",
                }}
              >
                Add Room
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

const modalInputStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 8,
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.72)",
  background: "rgba(255,255,255,0.5)",
  color: "#1D1D1F",
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none",
}

const fieldLabelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 16,
  color: "#1D1D1F",
  fontSize: 13,
  fontWeight: 600,
}

const modalButtonStyle: React.CSSProperties = {
  flex: 1,
  border: "1px solid rgba(255,255,255,0.6)",
  borderRadius: 12,
  padding: "12px 16px",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
}

const modalIconButtonStyle: React.CSSProperties = {
  width: 34,
  height: 34,
  display: "grid",
  placeItems: "center",
  border: "1px solid rgba(255,255,255,0.7)",
  borderRadius: 10,
  background: "rgba(255,255,255,0.42)",
  color: "#6E6E73",
  cursor: "pointer",
}

function QuickControl({
  icon,
  label,
  active,
  color,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  color: string
  onClick: (e: React.MouseEvent) => void
}) {
  const styledIcon = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement, {
        color: active ? "#FFFFFF" : "#6E6E73",
        size: 21,
      } as any)
    : icon

  return (
    <button
      type="button"
      className="room-quick-control"
      onClick={onClick}
      aria-label={label === "AC" ? "Air Conditioning" : label}
      title={label === "AC" ? "Air Conditioning" : label}
      style={{
        width: 38,
        height: 38,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: active ? `${color}22` : "rgba(255,255,255,0.18)",
        border: active
          ? `1px solid ${color}40`
          : "1px solid rgba(255,255,255,0.25)",
        borderRadius: 12,
        padding: 0,
        color: active ? "#1D1D1F" : "#6E6E73",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      <span
        style={{
          width: 26,
          height: 26,
          borderRadius: 8,
          display: "grid",
          placeItems: "center",
          background: active ? color : "rgba(0,0,0,0.08)",
          color: active ? "#FFFFFF" : "#6E6E73",
          flexShrink: 0,
        }}
      >
        {styledIcon}
      </span>
    </button>
  )
}

function deviceIcon(type: string) {
  if (type === "light") return <Lightbulb size={19} />
  if (type === "ac") return <Thermometer size={19} />
  if (type === "tv") return <Tv size={19} />
  if (type === "heater") return <Flame size={19} />
  if (type === "fridge") return <Zap size={19} />
  if (type === "plug") return <Power size={19} />
  return <Wind size={19} />
}

function DetailMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div
      style={{
        padding: "12px 14px",
        border: "1px solid rgba(255,255,255,0.48)",
        borderRadius: 14,
        background: "rgba(255,255,255,0.32)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          color: "#6E6E73",
          fontSize: 11,
        }}
      >
        {icon}
        {label}
      </div>
      <strong
        style={{
          display: "block",
          marginTop: 4,
          color: "#1D1D1F",
          fontSize: 17,
        }}
      >
        {value}
      </strong>
    </div>
  )
}

function DeviceRow({
  device,
  onToggle,
}: {
  device: DeviceState
  onToggle: () => void
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 11,
        padding: "10px 12px",
        border: "1px solid rgba(255,255,255,0.48)",
        borderRadius: 14,
        background: "rgba(255,255,255,0.32)",
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          borderRadius: 10,
          background: device.on ? device.color : "rgba(120,120,128,0.2)",
          color: device.on ? "#FFFFFF" : device.color,
        }}
      >
        {deviceIcon(device.type)}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p
          style={{
            overflow: "hidden",
            margin: 0,
            color: "#1D1D1F",
            fontSize: 13,
            fontWeight: 600,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {device.name}
        </p>
        <span style={{ color: "#6E6E73", fontSize: 11 }}>
          {device.on ? "On" : "Off"} · {device.type}
        </span>
      </div>
      <button
        type="button"
        aria-label={`${device.on ? "Turn off" : "Turn on"} ${device.name}`}
        aria-pressed={device.on}
        onClick={onToggle}
        style={{
          minWidth: 52,
          padding: "6px 9px",
          border: `1px solid ${
            device.on ? `${device.color}55` : "rgba(255,255,255,0.42)"
          }`,
          borderRadius: 10,
          background: device.on ? `${device.color}22` : "rgba(255,255,255,0.2)",
          color: device.on ? device.color : "#6E6E73",
          cursor: "pointer",
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        {device.on ? "ON" : "OFF"}
      </button>
    </div>
  )
}

function RoomStatusRow({
  label,
  active,
  color,
  onClick,
}: {
  label: string
  active: boolean
  color: string
  onClick: () => void
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "11px 12px",
        border: "1px solid rgba(255,255,255,0.48)",
        borderRadius: 14,
        background: "rgba(255,255,255,0.32)",
      }}
    >
      <span style={{ color: "#1D1D1F", fontSize: 13, fontWeight: 600 }}>
        {label}
      </span>
      <button
        type="button"
        aria-pressed={active}
        onClick={onClick}
        style={{
          minWidth: 58,
          padding: "7px 10px",
          border: `1px solid ${
            active ? `${color}55` : "rgba(255,255,255,0.42)"
          }`,
          borderRadius: 10,
          background: active ? `${color}22` : "rgba(255,255,255,0.2)",
          color: active ? color : "#6E6E73",
          cursor: "pointer",
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        {active ? "ON" : "OFF"}
      </button>
    </div>
  )
}

const detailsCloseButtonStyle: React.CSSProperties = {
  width: 34,
  height: 34,
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
  border: "1px solid rgba(255,255,255,0.6)",
  borderRadius: 10,
  background: "rgba(255,255,255,0.3)",
  color: "#1D1D1F",
  cursor: "pointer",
}

const detailsSectionHeadingStyle: React.CSSProperties = {
  margin: "0 0 9px",
  color: "#1D1D1F",
  fontSize: 15,
  fontWeight: 700,
}

const emptyDetailsTextStyle: React.CSSProperties = {
  margin: 0,
  padding: 14,
  border: "1px solid rgba(255,255,255,0.42)",
  borderRadius: 14,
  background: "rgba(255,255,255,0.18)",
  color: "#6E6E73",
  fontSize: 12,
}
