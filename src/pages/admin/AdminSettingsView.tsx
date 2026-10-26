import { useState } from "react"
import { Shield, HardDrive, CheckCircle2, Save } from "lucide-react"

export default function AdminSettingsView() {
  const [enforce2FA, setEnforce2FA] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState("60")
  const [maxAttempts, setMaxAttempts] = useState("5")
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [backupSchedule, setBackupSchedule] = useState("Daily at 03:00 UTC")
  const [retentionDays, setRetentionDays] = useState("365")
  const [saveNotice, setSaveNotice] = useState<string | null>(null)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaveNotice(
      "Platform configuration saved and synchronized with operational cluster.",
    )
    setTimeout(() => setSaveNotice(null), 3000)
  }

  return (
    <div
      className="account-page"
      style={{
        padding: "clamp(16px, 3vw, 32px)",
        minHeight: "100vh",
        maxWidth: 900,
      }}
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
              Cluster Parameters
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
            System Settings & Security Policies
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#48484A",
              margin: "4px 0 0",
              fontWeight: 500,
            }}
          >
            Configure global authentication security, cryptographic
            certificates, backups, and operational throttles.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            borderRadius: 12,
            background: "#007AFF",
            color: "white",
            border: "none",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(0,122,255,0.28)",
          }}
        >
          <Save size={15} /> Save Platform Settings
        </button>
      </div>

      {/* Save Notice */}
      {saveNotice && (
        <div
          className="animate-fade-in"
          style={{
            padding: "12px 18px",
            borderRadius: 12,
            background: "rgba(52,199,89,0.1)",
            border: "1px solid rgba(52,199,89,0.25)",
            marginBottom: 20,
            color: "#248A3D",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <CheckCircle2 size={16} />
          <span>{saveNotice}</span>
        </div>
      )}

      <form
        onSubmit={handleSave}
        style={{ display: "flex", flexDirection: "column", gap: 20 }}
      >
        {/* Section: Security Policies */}
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
            <Shield size={18} color="#FF3B30" /> Global Security &
            Authentication Policies
          </h2>
          <p style={{ fontSize: 12, color: "#6E6E73", margin: "0 0 18px" }}>
            Enforce mandatory account hardening across all homeowner and
            administrator logins.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* 2FA Toggle */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#1D1D1F",
                  }}
                >
                  Mandatory Two-Factor Authentication (2FA)
                </p>
                <p
                  style={{ margin: "2px 0 0", fontSize: 12, color: "#6E6E73" }}
                >
                  Require TOTP authenticator or hardware passkey on all admin
                  accounts and homeowner portals.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEnforce2FA(!enforce2FA)}
                style={{
                  width: 50,
                  height: 28,
                  borderRadius: 999,
                  background: enforce2FA ? "#34C759" : "#D1D1D6",
                  border: "none",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "white",
                    position: "absolute",
                    top: 3,
                    left: enforce2FA ? 25 : 3,
                    transition: "left 0.2s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                />
              </button>
            </div>

            <div style={{ height: 1, background: "rgba(0,0,0,0.06)" }} />

            {/* Session Timeout */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#1D1D1F",
                  }}
                >
                  Inactivity Session Expiration
                </p>
                <p
                  style={{ margin: "2px 0 0", fontSize: 12, color: "#6E6E73" }}
                >
                  Automatically terminate idle sessions and prompt for
                  credential re-verification.
                </p>
              </div>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(0,0,0,0.12)",
                  fontSize: 13,
                  fontWeight: 600,
                  background: "rgba(255,255,255,0.8)",
                  outline: "none",
                }}
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">60 Minutes (Default)</option>
                <option value="1440">24 Hours</option>
              </select>
            </div>

            <div style={{ height: 1, background: "rgba(0,0,0,0.06)" }} />

            {/* Max attempts */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#1D1D1F",
                  }}
                >
                  Max Failed Logins Before IP Quarantine
                </p>
                <p
                  style={{ margin: "2px 0 0", fontSize: 12, color: "#6E6E73" }}
                >
                  Temporarily lock out addresses after repeated invalid password
                  attempts.
                </p>
              </div>
              <select
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(e.target.value)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(0,0,0,0.12)",
                  fontSize: 13,
                  fontWeight: 600,
                  background: "rgba(255,255,255,0.8)",
                  outline: "none",
                }}
              >
                <option value="3">3 Attempts</option>
                <option value="5">5 Attempts (Recommended)</option>
                <option value="10">10 Attempts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section: Operational Controls */}
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
            <HardDrive size={18} color="#007AFF" /> Data Backups & Maintenance
          </h2>
          <p style={{ fontSize: 12, color: "#6E6E73", margin: "0 0 18px" }}>
            Configure database snapshot frequencies and global maintenance
            gating.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Maintenance Mode */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#1D1D1F",
                  }}
                >
                  Global Maintenance Gate
                </p>
                <p
                  style={{ margin: "2px 0 0", fontSize: 12, color: "#6E6E73" }}
                >
                  When enabled, non-administrator logins are temporarily paused
                  with a scheduled downtime notice.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                style={{
                  width: 50,
                  height: 28,
                  borderRadius: 999,
                  background: maintenanceMode ? "#FF3B30" : "#D1D1D6",
                  border: "none",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "white",
                    position: "absolute",
                    top: 3,
                    left: maintenanceMode ? 25 : 3,
                    transition: "left 0.2s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                />
              </button>
            </div>

            <div style={{ height: 1, background: "rgba(0,0,0,0.06)" }} />

            {/* Backup Schedule */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#1D1D1F",
                  }}
                >
                  Automated Database Snapshot
                </p>
                <p
                  style={{ margin: "2px 0 0", fontSize: 12, color: "#6E6E73" }}
                >
                  Point-in-time recovery images stored in encrypted multi-region
                  storage buckets.
                </p>
              </div>
              <select
                value={backupSchedule}
                onChange={(e) => setBackupSchedule(e.target.value)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(0,0,0,0.12)",
                  fontSize: 13,
                  fontWeight: 600,
                  background: "rgba(255,255,255,0.8)",
                  outline: "none",
                }}
              >
                <option value="Every 6 Hours">Every 6 Hours</option>
                <option value="Every 12 Hours">Every 12 Hours</option>
                <option value="Daily at 03:00 UTC">
                  Daily at 03:00 UTC (Recommended)
                </option>
              </select>
            </div>

            <div style={{ height: 1, background: "rgba(0,0,0,0.06)" }} />

            {/* Retention */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#1D1D1F",
                  }}
                >
                  Telemetry Log Retention
                </p>
                <p
                  style={{ margin: "2px 0 0", fontSize: 12, color: "#6E6E73" }}
                >
                  Historical telemetry and audit trail retention window before
                  cold archiving.
                </p>
              </div>
              <select
                value={retentionDays}
                onChange={(e) => setRetentionDays(e.target.value)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(0,0,0,0.12)",
                  fontSize: 13,
                  fontWeight: 600,
                  background: "rgba(255,255,255,0.8)",
                  outline: "none",
                }}
              >
                <option value="90">90 Days</option>
                <option value="180">180 Days</option>
                <option value="365">365 Days (1 Year)</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
