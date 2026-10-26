import {
  LayoutDashboard,
  DoorOpen,
  Cpu,
  Shield,
  Zap,
  GitBranch,
  Bell,
  User,
  Settings,
  BarChart3,
  Home,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"
import pageBackground from "../Assets/room.png"
import type { Page } from "../App"

const navItems: { icon: React.ReactNode; label: string; page: Page }[] = [
  { icon: <Home size={18} />, label: "Landing Page", page: "landing" },
  {
    icon: <LayoutDashboard size={18} />,
    label: "Dashboard",
    page: "dashboard",
  },
  { icon: <DoorOpen size={18} />, label: "Rooms", page: "rooms" },
  { icon: <Cpu size={18} />, label: "Devices", page: "devices" },
  { icon: <Shield size={18} />, label: "Security", page: "security" },
  { icon: <Zap size={18} />, label: "Energy", page: "energy" },
  { icon: <GitBranch size={18} />, label: "Automation", page: "automation" },
  { icon: <Bell size={18} />, label: "Notifications", page: "notifications" },
]

const secondaryItems: { icon: React.ReactNode; label: string; page: Page }[] = [
  { icon: <User size={18} />, label: "Profile", page: "profile" },
  { icon: <Settings size={18} />, label: "Settings", page: "settings" },
  { icon: <BarChart3 size={18} />, label: "Admin", page: "admin" },
]

interface LayoutProps {
  currentPage: Page
  onNavigate: (p: Page) => void
  onLogout: () => void
  children: React.ReactNode
}

export default function Layout({
  currentPage,
  onNavigate,
  onLogout,
  children,
}: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = (page: Page) => {
    onNavigate(page)
    setMobileMenuOpen(false)
  }

  return (
    <div
      className="app-shell"
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "transparent",
        backgroundImage: `url(${pageBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Sidebar */}
      <aside
        className="desktop-sidebar"
        style={{
          width: 240,
          minWidth: 240,
          height: "100vh",
          background: "transparent",
          borderRight: "1px solid rgba(255, 255, 255, 0.25)",
          display: "flex",
          flexDirection: "column",
          padding: "0 12px",
          zIndex: 10,
          boxShadow: "none",
        }}
      >
        {/* Logo */}
        <button
          type="button"
          className="sidebar-brand"
          onClick={() => navigate("landing")}
          style={{
            padding: "20px 10px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "linear-gradient(135deg, #007AFF, #5AC8FA)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0, 122, 255, 0.25)",
              flexShrink: 0,
            }}
          >
            <Home size={18} color="white" />
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: 17,
              color: "#1D1D1F",
              letterSpacing: "-0.3px",
            }}
          >
            SmartHome<span style={{ color: "#007AFF" }}>+</span>
          </span>
        </button>

        {/* Main nav */}
        <nav
          className="sidebar-nav"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            overflowX: "hidden",
            paddingTop: 12,
            paddingBottom: 12,
            gap: 6,
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.page}
              className={`sidebar-item${
                currentPage === item.page ? " active" : ""
              }`}
              onClick={() => navigate(item.page)}
              type="button"
            >
              {item.icon}
              <span className="sidebar-label">{item.label}</span>
              {currentPage === item.page && (
                <ChevronRight className="sidebar-chevron" size={14} />
              )}
            </button>
          ))}

          <div
            style={{
              height: 1,
              background: "rgba(0,0,0,0.06)",
              margin: "8px 6px",
            }}
          />

          {secondaryItems.map((item) => (
            <button
              key={item.page}
              className={`sidebar-item${
                currentPage === item.page ? " active" : ""
              }`}
              onClick={() => navigate(item.page)}
              type="button"
            >
              {item.icon}
              <span className="sidebar-label">{item.label}</span>
              {currentPage === item.page && (
                <ChevronRight className="sidebar-chevron" size={14} />
              )}
            </button>
          ))}
        </nav>

        {/* User Card */}
        <div
          style={{
            marginTop: "auto",
            padding: "12px 10px 18px",
            borderTop: "1px solid rgba(255, 255, 255, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #007AFF, #5AC8FA)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              color: "white",
              fontSize: 13,
              flexShrink: 0,
              boxShadow: "0 4px 10px rgba(0, 122, 255, 0.25)",
            }}
          >
            D
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#1D1D1F",
                margin: 0,
                lineHeight: 1.3,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              USER
            </p>
            <p
              style={{
                fontSize: 11,
                color: "#6E6E73",
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Premium Plan
            </p>
          </div>
          <button
            aria-label="Log out"
            title="Log out"
            onClick={onLogout}
            type="button"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 6,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6E6E73",
              transition: "color 0.2s ease, background 0.2s ease",
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <header className="mobile-topbar">
        <button
          className="mobile-menu-button"
          aria-label="Open navigation"
          onClick={() => setMobileMenuOpen(true)}
          type="button"
        >
          <Menu size={22} />
        </button>
        <button
          type="button"
          className="mobile-brand"
          onClick={() => navigate("landing")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          SmartHome<span>+</span>
        </button>
        <div className="mobile-topbar-actions">
          <button
            aria-label="Notifications"
            onClick={() => navigate("notifications")}
            type="button"
          >
            <Bell size={18} />
          </button>
          <button
            aria-label="Profile"
            onClick={() => navigate("profile")}
            type="button"
          >
            <User size={18} />
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          className="mobile-menu-backdrop"
          role="presentation"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setMobileMenuOpen(false)
          }
        >
          <nav
            className="mobile-menu"
            aria-label="Mobile navigation"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mobile-menu-header">
              <span className="mobile-brand">
                SmartHome<span>+</span>
              </span>
              <button
                aria-label="Close navigation"
                onClick={() => setMobileMenuOpen(false)}
                type="button"
              >
                <X size={20} />
              </button>
            </div>
            {[...navItems, ...secondaryItems].map((item) => (
              <button
                key={item.page}
                className={currentPage === item.page ? "active" : ""}
                onClick={() => navigate(item.page)}
                type="button"
              >
                {item.icon}
                <span>{item.label}</span>
                {currentPage === item.page && <ChevronRight size={16} />}
              </button>
            ))}
            <div
              style={{
                marginTop: "auto",
                paddingTop: 16,
                borderTop: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <button
                onClick={onLogout}
                type="button"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "none",
                  background: "rgba(255,59,48,0.08)",
                  color: "#FF3B30",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                <LogOut size={16} />
                <span>Log out</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Main */}
      <main
        className="app-main"
        style={{
          flex: 1,
          minWidth: 0,
          overflowY: "auto",
          height: "100vh",
        }}
      >
        {children}
      </main>
    </div>
  )
}
