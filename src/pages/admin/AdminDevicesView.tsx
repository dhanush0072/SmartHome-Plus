import { useState } from "react"
import { Cpu, Search, CheckCircle2, Lightbulb, Wind, Lock } from "lucide-react"

interface DeviceItem {
  id: string
  name: string
  type: "Light" | "Climate" | "Security" | "Appliance" | "Sensor"
  owner: string
  home: string
  protocol: "Matter" | "Zigbee" | "Wi-Fi" | "Thread"
  ip: string
  firmware: string
  status: "online" | "offline" | "updating"
  signal: string
}

const mockDevices: DeviceItem[] = [
  {
    id: "DEV-101",
    name: "Living Room Philips Hue Halo",
    type: "Light",
    owner: "USER",
    home: "USER Villa",
    protocol: "Matter",
    ip: "192.168.1.42",
    firmware: "v4.2.1-rel",
    status: "online",
    signal: "-45 dBm",
  },
  {
    id: "DEV-102",
    name: "Daikin Inverter Smart AC",
    type: "Climate",
    owner: "USER",
    home: "USER Villa",
    protocol: "Wi-Fi",
    ip: "192.168.1.55",
    firmware: "v2.8.0",
    status: "online",
    signal: "-52 dBm",
  },
  {
    id: "DEV-103",
    name: "Yale Assure Smart Lock V2",
    type: "Security",
    owner: "USER",
    home: "USER Villa",
    protocol: "Thread",
    ip: "192.168.1.60",
    firmware: "v3.1.4",
    status: "online",
    signal: "-38 dBm",
  },
  {
    id: "DEV-104",
    name: "Nest Cam IQ Outdoor 4K",
    type: "Security",
    owner: "Priya Sharma",
    home: "Skyline Palms",
    protocol: "Wi-Fi",
    ip: "192.168.2.14",
    firmware: "v5.0.1",
    status: "online",
    signal: "-62 dBm",
  },
  {
    id: "DEV-105",
    name: "Bosch Smart Dishwasher",
    type: "Appliance",
    owner: "Ananya Nair",
    home: "Greenwood Estate",
    protocol: "Matter",
    ip: "192.168.3.88",
    firmware: "v1.4.2",
    status: "offline",
    signal: "N/A",
  },
  {
    id: "DEV-106",
    name: "Aqara Motion & Lux Sensor",
    type: "Sensor",
    owner: "Rahul Mehta",
    home: "Mehta Haven",
    protocol: "Zigbee",
    ip: "192.168.4.19",
    firmware: "v2.0.0",
    status: "online",
    signal: "-58 dBm",
  },
  {
    id: "DEV-107",
    name: "Lutron Caseta Dimmer Hub",
    type: "Light",
    owner: "Vikram Singh",
    home: "Singh Residency",
    protocol: "Thread",
    ip: "192.168.5.21",
    firmware: "v3.4.1",
    status: "updating",
    signal: "-49 dBm",
  },
]

export default function AdminDevicesView() {
  const [devices, setDevices] = useState<DeviceItem[]>(mockDevices)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("ALL")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [actionNotice, setActionNotice] = useState<string | null>(null)

  const handleReboot = (id: string, name: string) => {
    setActionNotice(`Sent remote reboot telemetry command to "${name}"...`)
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "updating" } : d)),
    )
    setTimeout(() => {
      setDevices((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: "online" } : d)),
      )
      setActionNotice(
        `Device "${name}" rebooted successfully and reported back online.`,
      )
    }, 1500)
  }

  const handleDiagnostics = (name: string) => {
    setActionNotice(
      `Running Matter diagnostic handshake on "${name}"... All packets returned in 18ms (0% loss).`,
    )
  }

  const filtered = devices.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.owner.toLowerCase().includes(search.toLowerCase()) ||
      d.home.toLowerCase().includes(search.toLowerCase()) ||
      d.ip.includes(search)

    const matchType = typeFilter === "ALL" || d.type === typeFilter
    const matchStatus = statusFilter === "ALL" || d.status === statusFilter

    return matchSearch && matchType && matchStatus
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
                color: "#34C759",
                background: "rgba(52,199,89,0.1)",
                padding: "2px 8px",
                borderRadius: 999,
                textTransform: "uppercase",
              }}
            >
              Connected Hardware Mesh
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
            Device Inventory & Management
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#48484A",
              margin: "4px 0 0",
              fontWeight: 500,
            }}
          >
            Fleet management across Matter, Zigbee, Thread, and Wi-Fi smart
            accessories.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(0,0,0,0.05)",
              padding: "6px 14px",
              borderRadius: 10,
            }}
          >
            <span style={{ fontSize: 12, color: "#6E6E73" }}>
              Fleet Health:
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#34C759" }}>
              98.4% Connected
            </span>
          </div>
        </div>
      </div>

      {/* Action Notice */}
      {actionNotice && (
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
            <span>{actionNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
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
              placeholder="Search by device name, owner, IP address..."
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

          {/* Type Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6E6E73" }}>
              Category:
            </span>
            {["ALL", "Light", "Climate", "Security", "Appliance", "Sensor"].map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setTypeFilter(cat)}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "5px 10px",
                    borderRadius: 8,
                    border: "none",
                    background:
                      typeFilter === cat ? "#007AFF" : "rgba(0,0,0,0.05)",
                    color: typeFilter === cat ? "white" : "#6E6E73",
                    cursor: "pointer",
                  }}
                >
                  {cat}
                </button>
              ),
            )}
          </div>

          {/* Status Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6E6E73" }}>
              Status:
            </span>
            {["ALL", "online", "offline", "updating"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "capitalize",
                  padding: "5px 10px",
                  borderRadius: 8,
                  border: "none",
                  background:
                    statusFilter === st ? "#1D1D1F" : "rgba(0,0,0,0.05)",
                  color: statusFilter === st ? "white" : "#6E6E73",
                  cursor: "pointer",
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Devices Table */}
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
            Devices ({filtered.length} matched)
          </h2>
          <span style={{ fontSize: 12, color: "#6E6E73" }}>
            Auto-polling OTA cluster status
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
            style={{ width: "100%", minWidth: 740, borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                {[
                  "Device Name",
                  "Owner / Residence",
                  "Protocol",
                  "IP / Address",
                  "Firmware",
                  "Signal",
                  "Status",
                  "Remote Actions",
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
              {filtered.map((d) => {
                const isOnline = d.status === "online"
                const isUpdating = d.status === "updating"

                const typeIcon =
                  d.type === "Light" ? (
                    <Lightbulb size={14} color="#FF9500" />
                  ) : d.type === "Climate" ? (
                    <Wind size={14} color="#007AFF" />
                  ) : d.type === "Security" ? (
                    <Lock size={14} color="#FF3B30" />
                  ) : (
                    <Cpu size={14} color="#34C759" />
                  )

                return (
                  <tr
                    key={d.id}
                    style={{
                      transition: "background 0.15s ease",
                      borderBottom: "1px solid rgba(0,0,0,0.04)",
                    }}
                  >
                    {/* Device Name */}
                    <td style={{ padding: "12px 8px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: "rgba(0,0,0,0.04)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {typeIcon}
                        </div>
                        <div>
                          <p
                            style={{
                              margin: 0,
                              fontWeight: 700,
                              fontSize: 13,
                              color: "#1D1D1F",
                            }}
                          >
                            {d.name}
                          </p>
                          <span style={{ fontSize: 11, color: "#8E8E93" }}>
                            {d.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Owner */}
                    <td style={{ padding: "12px 8px" }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#1D1D1F",
                        }}
                      >
                        {d.owner}
                      </p>
                      <span style={{ fontSize: 11, color: "#6E6E73" }}>
                        {d.home}
                      </span>
                    </td>

                    {/* Protocol */}
                    <td style={{ padding: "12px 8px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: 6,
                          background: "rgba(0,122,255,0.08)",
                          color: "#007AFF",
                        }}
                      >
                        {d.protocol}
                      </span>
                    </td>

                    {/* IP */}
                    <td
                      style={{
                        padding: "12px 8px",
                        fontSize: 12,
                        fontFamily: "monospace",
                        color: "#1D1D1F",
                      }}
                    >
                      {d.ip}
                    </td>

                    {/* Firmware */}
                    <td
                      style={{
                        padding: "12px 8px",
                        fontSize: 12,
                        color: "#6E6E73",
                      }}
                    >
                      {d.firmware}
                    </td>

                    {/* Signal */}
                    <td
                      style={{
                        padding: "12px 8px",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#1D1D1F",
                      }}
                    >
                      {d.signal}
                    </td>

                    {/* Status */}
                    <td style={{ padding: "12px 8px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: 6,
                          background: isOnline
                            ? "rgba(52,199,89,0.1)"
                            : isUpdating
                              ? "rgba(255,149,0,0.1)"
                              : "rgba(255,59,48,0.1)",
                          color: isOnline
                            ? "#34C759"
                            : isUpdating
                              ? "#FF9500"
                              : "#FF3B30",
                          textTransform: "capitalize",
                        }}
                      >
                        {d.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "12px 8px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleReboot(d.id, d.name)}
                          title="Reboot Unit"
                          style={{
                            padding: "4px 8px",
                            borderRadius: 6,
                            background: "rgba(0,122,255,0.08)",
                            color: "#007AFF",
                            border: "none",
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Reboot
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDiagnostics(d.name)}
                          title="Run Diagnostics"
                          style={{
                            padding: "4px 8px",
                            borderRadius: 6,
                            background: "rgba(0,0,0,0.05)",
                            color: "#1D1D1F",
                            border: "none",
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Diagnose
                        </button>
                      </div>
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
