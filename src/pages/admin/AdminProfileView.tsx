import { useState } from "react"
import { ShieldCheck, Key } from "lucide-react"
import type { AuthUser } from "../../services/auth"

interface Props {
  user: AuthUser | null
}

export default function AdminProfileView({ user }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopyKey = () => {
    navigator.clipboard?.writeText(
      "SHA256:4f8e91d03b22e19a8c049d91f28b3401c3821a99",
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="account-page"
      style={{
        padding: "clamp(16px, 3vw, 32px)",
        minHeight: "100vh",
        maxWidth: 840,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
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
              color: "#FF3B30",
              background: "rgba(255,59,48,0.1)",
              padding: "2px 8px",
              borderRadius: 999,
              textTransform: "uppercase",
            }}
          >
            Root Operator Credentials
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
          Administrator Profile
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "#48484A",
            margin: "4px 0 0",
            fontWeight: 500,
          }}
        >
          Security identity, cryptographic credentials, and active operator
          sessions.
        </p>
      </div>

      {/* Profile Card */}
      <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FF3B30, #FF9500)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 26,
              color: "white",
              boxShadow: "0 8px 20px rgba(255,59,48,0.28)",
            }}
          >
            A
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#1D1D1F",
                  margin: 0,
                }}
              >
                {user?.name || "Admin Root"}
              </h2>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  padding: "3px 9px",
                  borderRadius: 6,
                  background: "rgba(255,59,48,0.12)",
                  color: "#FF3B30",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                LEVEL 4 SUPERADMIN
              </span>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "#6E6E73",
                margin: "4px 0 0",
                fontWeight: 500,
              }}
            >
              {user?.email || "admin@smarthome.io"} · SmartHome+ Platform
              Operations HQ
            </p>
          </div>
        </div>
      </div>

      {/* Security Credentials & Clearance */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
          marginBottom: 20,
        }}
      >
        <div className="glass-card" style={{ padding: 22 }}>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: "#1D1D1F",
              margin: "0 0 14px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <ShieldCheck size={18} color="#34C759" /> Security Clearance & RBAC
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              fontSize: 13,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#6E6E73" }}>Assigned Role</span>
              <strong style={{ color: "#1D1D1F" }}>ROLE_ADMIN</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#6E6E73" }}>Privilege Scope</span>
              <strong style={{ color: "#FF3B30" }}>Global Cluster Root</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#6E6E73" }}>Hardware Passkey</span>
              <strong style={{ color: "#34C759" }}>FIDO2 YubiKey Active</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#6E6E73" }}>Account Enrolled</span>
              <strong style={{ color: "#1D1D1F" }}>Jan 2024</strong>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 22 }}>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: "#1D1D1F",
              margin: "0 0 14px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Key size={18} color="#007AFF" /> Platform Fingerprint
          </h3>
          <p style={{ fontSize: 12, color: "#6E6E73", margin: "0 0 10px" }}>
            Public administrative TLS certificate thumbprint:
          </p>
          <div
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.04)",
              fontFamily: "monospace",
              fontSize: 11,
              color: "#1D1D1F",
              wordBreak: "break-all",
              marginBottom: 10,
            }}
          >
            SHA256:4f8e91d03b22e19a8c049d91f28b3401c3821a99
          </div>
          <button
            type="button"
            onClick={handleCopyKey}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              background: "rgba(0,122,255,0.1)",
              color: "#007AFF",
              border: "none",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {copied ? "✓ Copied Thumbprint" : "Copy Public Thumbprint"}
          </button>
        </div>
      </div>

      {/* Active Admin Sessions */}
      <div className="glass-card" style={{ padding: 24 }}>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "#1D1D1F",
            margin: "0 0 14px",
          }}
        >
          Active Admin Sessions
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 14px",
              borderRadius: 12,
              background: "rgba(52,199,89,0.06)",
              border: "1px solid rgba(52,199,89,0.2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#34C759",
                }}
              />
              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#1D1D1F",
                  }}
                >
                  Current Management Console (Windows Chrome 130)
                </p>
                <p
                  style={{ margin: "2px 0 0", fontSize: 11, color: "#6E6E73" }}
                >
                  IP: 10.0.12.4 · Last active: Just now
                </p>
              </div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#34C759" }}>
              Active Now
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
