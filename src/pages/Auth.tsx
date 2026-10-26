import { useState } from "react"
import room from "../Assets/room5.jpg"
import {
  Home,
  Eye,
  EyeOff,
  ArrowLeft,
  Fingerprint,
  Mail,
  Lock,
  User,
  Shield,
  ShieldAlert,
  AlertCircle,
  Sparkles,
} from "lucide-react"
import type { Page } from "../App"
import {
  authenticate,
  registerHomeowner,
  type AuthUser,
  type UserRole,
} from "../services/auth"

interface Props {
  onNavigate: (p: Page) => void
  onLogin: (user?: AuthUser) => void
  initialRole?: UserRole
}

export default function Auth({
  onNavigate,
  onLogin,
  initialRole = "ROLE_USER",
}: Props) {
  const [role, setRole] = useState<UserRole>(initialRole)
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login")
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole)
    setError(null)
    if (newRole === "ROLE_ADMIN" && mode === "register") {
      setMode("login")
    }
  }

  const handleQuickFill = () => {
    setError(null)
    if (role === "ROLE_USER") {
      setEmail("user@smarthome.io")
      setPassword("user123")
    } else {
      setEmail("admin@smarthome.io")
      setPassword("admin123")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError("Please enter your email address.")
      return
    }

    if (mode !== "forgot" && !password) {
      setError("Please enter your password.")
      return
    }

    setLoading(true)

    setTimeout(
      () => {
        if (mode === "forgot") {
          setLoading(false)
          setError(null)
          alert(`Password reset instructions have been dispatched to ${email}.`)
          setMode("login")
          return
        }

        if (mode === "register") {
          const res = registerHomeowner(name, email, password)
          setLoading(false)
          if (!res.success) {
            setError(res.error || "Registration failed.")
          } else {
            onLogin(res.user)
          }
          return
        }

        // Login validation with Role Verification
        const res = authenticate(email, password, role)
        setLoading(false)

        if (!res.success) {
          setError(res.error || "Authentication failed.")
        } else {
          onLogin(res.user)
        }
      },
      450,
    )
  }

  return (
    <div
      className="auth-page"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${room})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        position: "relative",
      }}
    >
      {/* Background blobs */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "10%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            role === "ROLE_ADMIN"
              ? "radial-gradient(circle, rgba(255,59,48,0.12) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(0,122,255,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          transition: "background 0.4s ease",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "10%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            role === "ROLE_ADMIN"
              ? "radial-gradient(circle, rgba(255,149,0,0.12) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(90,200,250,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          transition: "background 0.4s ease",
        }}
      />

      {/* Back button */}
      <button
        type="button"
        className="auth-back-button auth-button"
        onClick={() => onNavigate("landing")}
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          padding: "10px 18px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 14,
          fontWeight: 600,
          color: "#1D1D1F",
          cursor: "pointer",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.55)",
          background: "rgba(255,255,255,0.4)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
          zIndex: 10,
        }}
      >
        <ArrowLeft size={15} /> Back
      </button>

      {/* Card */}
      <div
        className={`auth-card auth-card--${mode} animate-scale-in`}
        style={{
          width: "100%",
          borderRadius: 28,
          background: "rgba(255, 255, 255, 0.72)",
          backdropFilter: "blur(30px) saturate(190%)",
          WebkitBackdropFilter: "blur(30px) saturate(190%)",
          border: "1px solid rgba(255, 255, 255, 0.85)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.16)",
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* Role Segmented Switch */}
        <div
          role="tablist"
          className="auth-role-switch"
          aria-label="User role selection"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            background: "rgba(0, 0, 0, 0.06)",
            padding: 4,
            borderRadius: 14,
            marginBottom: 24,
            position: "relative",
          }}
        >
          <button
            type="button"
            role="tab"
            aria-selected={role === "ROLE_USER"}
            onClick={() => handleRoleChange("ROLE_USER")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "9px 14px",
              fontSize: 13,
              fontWeight: 700,
              color: role === "ROLE_USER" ? "#007AFF" : "#1D1D1F",
              background: role === "ROLE_USER" ? "#FFFFFF" : "transparent",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              boxShadow:
                role === "ROLE_USER"
                  ? "0 4px 12px rgba(0, 0, 0, 0.08)"
                  : "none",
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <User size={15} /> Homeowner
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={role === "ROLE_ADMIN"}
            onClick={() => handleRoleChange("ROLE_ADMIN")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "9px 14px",
              fontSize: 13,
              fontWeight: 700,
              color: role === "ROLE_ADMIN" ? "#FF3B30" : "#1D1D1F",
              background: role === "ROLE_ADMIN" ? "#FFFFFF" : "transparent",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              boxShadow:
                role === "ROLE_ADMIN"
                  ? "0 4px 12px rgba(0, 0, 0, 0.08)"
                  : "none",
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <Shield size={15} /> Administrator
          </button>
        </div>

        {/* Logo & Header */}
        <div className="auth-header" style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            className="auth-logo-mark"
            style={{
              width: 54,
              height: 54,
              borderRadius: 16,
              background:
                role === "ROLE_ADMIN"
                  ? "linear-gradient(135deg, #FF3B30, #FF9500)"
                  : "linear-gradient(135deg, #007AFF, #5AC8FA)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
              boxShadow:
                role === "ROLE_ADMIN"
                  ? "0 12px 24px rgba(255, 59, 48, 0.28)"
                  : "0 12px 24px rgba(0, 122, 255, 0.25)",
              transition: "all 0.3s ease",
            }}
          >
            {role === "ROLE_ADMIN" ? (
              <Shield size={26} color="white" />
            ) : (
              <Home size={26} color="white" />
            )}
          </div>

          {role === "ROLE_ADMIN" && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 12px",
                background: "rgba(255, 59, 48, 0.1)",
                border: "1px solid rgba(255, 59, 48, 0.25)",
                borderRadius: 999,
                color: "#FF3B30",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              <ShieldAlert size={13} /> Administrator Portal — Restricted Access
            </div>
          )}

          <h1
            style={{
              fontSize: 25,
              fontWeight: 800,
              color: "#1D1D1F",
              margin: "0 0 6px",
              letterSpacing: "-0.5px",
            }}
          >
            {role === "ROLE_ADMIN"
              ? "Admin Console"
              : mode === "login"
                ? "Welcome back"
                : mode === "register"
                  ? "Create homeowner account"
                  : "Reset password"}
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "#48484A",
              margin: 0,
              fontWeight: 500,
            }}
          >
            {role === "ROLE_ADMIN"
              ? "Sign in to access infrastructure, telemetry, and platform management."
              : mode === "login"
                ? "Sign in to monitor and control your smart home."
                : mode === "register"
                  ? "Get started with SmartHome+ today."
                  : "Enter your email to receive recovery instructions."}
          </p>
        </div>

        {/* Quick Demo Fill Helper */}
        <div className="auth-quickfill" style={{ marginBottom: 18 }}>
          <button
            type="button"
            onClick={handleQuickFill}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "8px 12px",
              fontSize: 12,
              fontWeight: 600,
              color: role === "ROLE_ADMIN" ? "#D70015" : "#007AFF",
              background:
                role === "ROLE_ADMIN"
                  ? "rgba(255, 59, 48, 0.08)"
                  : "rgba(0, 122, 255, 0.08)",
              border: `1px dashed ${
                role === "ROLE_ADMIN"
                  ? "rgba(255, 59, 48, 0.35)"
                  : "rgba(0, 122, 255, 0.35)"
              }`,
              borderRadius: 10,
              cursor: "pointer",
              transition: "background 0.2s ease",
            }}
          >
            <Sparkles size={14} />
            <span>
              {role === "ROLE_ADMIN"
                ? "Quick Fill Admin (admin@smarthome.io)"
                : "Quick Fill Homeowner (user@smarthome.io)"}
            </span>
          </button>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div
            className="animate-fade-in"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "12px 14px",
              borderRadius: 12,
              background: "rgba(255, 59, 48, 0.1)",
              border: "1px solid rgba(255, 59, 48, 0.3)",
              marginBottom: 16,
              color: "#D70015",
              fontSize: 13,
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form
          className="auth-form"
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          {role === "ROLE_USER" && mode === "register" && (
            <InputField
              icon={<User size={16} />}
              placeholder="Full name"
              value={name}
              onChange={setName}
              type="text"
            />
          )}

          <InputField
            icon={<Mail size={16} />}
            placeholder={
              role === "ROLE_ADMIN" ? "admin@smarthome.io" : "user@smarthome.io"
            }
            value={email}
            onChange={(val) => {
              setEmail(val)
              setError(null)
            }}
            type="email"
          />

          {mode !== "forgot" && (
            <div style={{ position: "relative" }}>
              <InputField
                icon={<Lock size={16} />}
                placeholder="Password"
                value={password}
                onChange={(val) => {
                  setPassword(val)
                  setError(null)
                }}
                type={showPass ? "text" : "password"}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                }}
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? (
                  <EyeOff size={16} color="#6E6E73" />
                ) : (
                  <Eye size={16} color="#6E6E73" />
                )}
              </button>
            </div>
          )}

          {mode === "login" && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => {
                  setMode("forgot")
                  setError(null)
                }}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 12,
                  fontWeight: 600,
                  color: role === "ROLE_ADMIN" ? "#FF3B30" : "#007AFF",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Biometrics for User */}
          {role === "ROLE_USER" && mode === "login" && (
            <div
              className="auth-bio-panel"
              style={{
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                borderRadius: 14,
                background: "rgba(255,255,255,0.4)",
                border: "1px solid rgba(255,255,255,0.5)",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  flexShrink: 0,
                  borderRadius: 11,
                  background: "rgba(255,255,255,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Fingerprint size={22} color="#007AFF" strokeWidth={1.8} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#1D1D1F",
                  }}
                >
                  Fast Biometrics
                </p>
                <p
                  style={{ margin: "2px 0 0", fontSize: 11, color: "#6E6E73" }}
                >
                  Instant Face ID / Touch ID
                </p>
              </div>
              <button
                type="button"
                style={{
                  background: "rgba(0,122,255,0.92)",
                  border: "none",
                  borderRadius: 9,
                  padding: "6px 12px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setEmail("user@smarthome.io")
                  setPassword("user123")
                  const res = authenticate(
                    "user@smarthome.io",
                    "user123",
                    "ROLE_USER",
                  )
                  if (res.success) onLogin(res.user)
                }}
              >
                Use
              </button>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary auth-button auth-primary-button"
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "14px",
              marginTop: 4,
              borderRadius: 14,
              background: role === "ROLE_ADMIN" ? "#FF3B30" : "#007AFF",
              boxShadow:
                role === "ROLE_ADMIN"
                  ? "0 12px 24px rgba(255,59,48,0.25)"
                  : "0 12px 24px rgba(0,122,255,0.22)",
              fontSize: 14,
              fontWeight: 700,
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
            }}
            disabled={loading}
          >
            {loading ? (
              <span className="animate-pulse-soft">
                Verifying credentials...
              </span>
            ) : mode === "login" ? (
              role === "ROLE_ADMIN" ? (
                "Sign In as Administrator"
              ) : (
                "Sign In as Homeowner"
              )
            ) : mode === "register" ? (
              "Create Homeowner Account"
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {/* Social buttons — only available for User portal */}
        {role === "ROLE_USER" && mode === "register" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginTop: 22,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
              }}
            >
              <div
                style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: "#6E6E73",
                  whiteSpace: "nowrap",
                  fontWeight: 600,
                }}
              >
                OR SIGN UP WITH
              </span>
              <div
                style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }}
              />
            </div>
            <SocialButton
              label="Continue with Apple"
              onClick={() => {
                const res = authenticate(
                  "user@smarthome.io",
                  "user123",
                  "ROLE_USER",
                )
                if (res.success) onLogin(res.user)
              }}
              variant="apple"
              icon={<AppleIcon />}
            />
            <SocialButton
              label="Continue with Google"
              onClick={() => {
                const res = authenticate(
                  "user@smarthome.io",
                  "user123",
                  "ROLE_USER",
                )
                if (res.success) onLogin(res.user)
              }}
              variant="google"
              icon={<GoogleIcon />}
            />
          </div>
        )}

        {/* Switch mode */}
        <div className="auth-mode-switch" style={{ textAlign: "center", marginTop: 20 }}>
          {role === "ROLE_ADMIN" ? (
            <p
              style={{
                fontSize: 12,
                color: "#6E6E73",
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              Admin accounts are restricted. For account creation, please
              contact{" "}
              <span style={{ color: "#1D1D1F", fontWeight: 600 }}>
                ops@smarthome.io
              </span>
              .
            </p>
          ) : mode === "login" ? (
            <p style={{ fontSize: 13, color: "#6E6E73", margin: 0 }}>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register")
                  setError(null)
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#007AFF",
                  fontWeight: 700,
                  cursor: "pointer",
                  padding: 0,
                  fontSize: 13,
                }}
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p style={{ fontSize: 13, color: "#6E6E73", margin: 0 }}>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login")
                  setError(null)
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#007AFF",
                  fontWeight: 700,
                  cursor: "pointer",
                  padding: 0,
                  fontSize: 13,
                }}
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function SocialButton({
  label,
  onClick,
  variant,
  icon,
}: {
  label: string
  onClick: () => void
  variant: "apple" | "google"
  icon: React.ReactNode
}) {
  const isApple = variant === "apple"

  return (
    <button
      type="button"
      className="auth-button"
      onClick={onClick}
      style={{
        width: "100%",
        minHeight: 44,
        background: isApple ? "rgba(29,29,31,0.94)" : "rgba(255,255,255,0.76)",
        color: isApple ? "white" : "#1D1D1F",
        border: isApple
          ? "1px solid rgba(255,255,255,0.12)"
          : "1px solid rgba(255,255,255,0.8)",
        borderRadius: 14,
        padding: "10px 16px",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        transition:
          "transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease",
        boxShadow: isApple
          ? "0 10px 24px rgba(0,0,0,0.12)"
          : "0 10px 20px rgba(0,0,0,0.06)",
      }}
    >
      <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
      {label}
    </button>
  )
}

function AppleIcon() {
  return (
    <svg
      width="17"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.1.8 1.21-.25 2.37-.94 3.66-.84 1.56.13 2.73.74 3.5 1.8-3.22 1.93-2.46 6.18.5 7.36-.59 1.55-1.36 3.08-2.76 3.86ZM12.05 7.24C11.9 4.94 13.76 3.06 15.9 2.88c.3 2.65-2.4 4.62-3.85 4.36Z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.71-.06-1.4-.18-2.06H12v3.9h5.23a4.47 4.47 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.92-4.18 2.92-7.2Z"
      />
      <path
        fill="#34A853"
        d="M12 21.6c2.63 0 4.84-.87 6.45-2.36l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.29v2.51A9.75 9.75 0 0 0 12 21.6Z"
      />
      <path
        fill="#FBBC05"
        d="M6.53 13.7a5.86 5.86 0 0 1 0-3.4V7.79H3.29a9.76 9.76 0 0 0 0 8.42l3.24-2.51Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.27c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.83 3.37 14.63 2.4 12 2.4a9.75 9.75 0 0 0-8.71 5.39l3.24 2.51C7.3 7.99 9.46 6.27 12 6.27Z"
      />
    </svg>
  )
}

function InputField({
  icon,
  placeholder,
  value,
  onChange,
  type,
}: {
  icon: React.ReactNode
  placeholder: string
  value: string
  onChange: (v: string) => void
  type: string
}) {
  return (
    <div
      className="auth-input"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "rgba(255,255,255,0.5)",
        borderRadius: 14,
        padding: "13px 16px",
        border: "1px solid rgba(255,255,255,0.65)",
        transition:
          "border-color 0.2s ease, background 0.2s ease, transform 0.2s ease",
      }}
    >
      <span style={{ color: "#6E6E73", display: "flex" }}>{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          flex: 1,
          background: "none",
          border: "none",
          outline: "none",
          fontSize: 14,
          color: "#1D1D1F",
          fontFamily: "inherit",
          fontWeight: 500,
        }}
      />
    </div>
  )
}
