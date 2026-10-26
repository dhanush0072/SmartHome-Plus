import {
  BarChart3,
  Users,
  Cpu,
  Activity,
  Zap,
  GitBranch,
  Bell,
  MessageSquare,
  FileText,
  Sliders,
  ShieldCheck,
  Shield,
} from "lucide-react"
import { useState, useEffect } from "react"
import pageBackground from "../Assets/room.png"
import FloatingPortalSidebar from "./FloatingPortalSidebar"
import {
  MobilePortalBottomNavigation,
  MobilePortalHeader,
  MobilePortalMenu,
} from "./MobilePortalNavigation"
import type { Page } from "../App"
import type { AuthUser } from "../services/auth"

const adminNavItems: {
  icon: React.ReactNode
  label: string
  page: Page
  badgeKey?: string
}[] = [
  { icon: <BarChart3 size={18} />, label: "Dashboard", page: "admin" },
  { icon: <Users size={18} />, label: "User Management", page: "admin-users" },
  {
    icon: <Cpu size={18} />,
    label: "Device Management",
    page: "admin-devices",
  },
  {
    icon: <Activity size={18} />,
    label: "System Monitoring",
    page: "admin-monitoring",
  },
  { icon: <Zap size={18} />, label: "Energy Overview", page: "admin-energy" },
  {
    icon: <GitBranch size={18} />,
    label: "Automation Management",
    page: "admin-automation",
  },
  {
    icon: <Bell size={18} />,
    label: "Notifications",
    page: "admin-notifications",
  },
  {
    icon: <MessageSquare size={18} />,
    label: "Feedback Management",
    page: "admin-feedback",
    badgeKey: "feedback",
  },
  { icon: <FileText size={18} />, label: "Activity Logs", page: "admin-logs" },
  {
    icon: <Sliders size={18} />,
    label: "System Settings",
    page: "admin-settings",
  },
  {
    icon: <ShieldCheck size={18} />,
    label: "Admin Profile",
    page: "admin-profile",
  },
]

interface AdminLayoutProps {
  currentPage: Page
  onNavigate: (p: Page) => void
  onLogout: () => void
  user: AuthUser | null
  children: React.ReactNode
}

export default function AdminLayout({
  currentPage,
  onNavigate,
  onLogout,
  user,
  children,
}: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [feedbackCount, setFeedbackCount] = useState(0)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("smarthome_feedback")
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          setFeedbackCount(parsed.length)
        }
      }
    } catch {
      // Ignore storage error
    }
  }, [currentPage])

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 768px)")
    const closeMobileMenu = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileMenuOpen(false)
    }
    desktopQuery.addEventListener("change", closeMobileMenu)
    return () => desktopQuery.removeEventListener("change", closeMobileMenu)
  }, [])

  const navigate = (page: Page) => {
    onNavigate(page)
    setMobileMenuOpen(false)
  }

  return (
    <div
      className="app-shell admin-portal-shell"
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "transparent",
        backgroundImage: `linear-gradient(180deg, rgba(233, 242, 246, 0.06), rgba(226, 237, 235, 0.1) 48%, rgba(244, 244, 239, 0.12)), url(${pageBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <FloatingPortalSidebar
        admin
        brand={
          <div className="portal-brand-lockup">
            <span className="portal-brand-mark admin">
              <Shield size={19} color="white" />
            </span>
            <span className="portal-brand-copy">
              <strong>
                SmartHome<span>+</span>
              </strong>
              <small>Admin Console</small>
            </span>
            <span className="portal-brand-status">
              <span className="animate-pulse-soft" />
              Cluster Online (99.98%)
            </span>
          </div>
        }
        groups={[
          {
            label: "Platform Operations",
            items: adminNavItems.map((item) => ({
              icon: item.icon,
              label: item.label,
              page: item.page,
              active: currentPage === item.page,
              admin: true,
              badge:
                item.badgeKey === "feedback" && feedbackCount > 0 ? (
                  <span className="floating-sidebar-badge">{feedbackCount}</span>
                ) : undefined,
              onSelect: navigate,
            })),
          },
        ]}
        initial="A"
        name={user?.name || "Admin Root"}
        subtitle="Root Privileges"
        onLogout={onLogout}
      />

      <MobilePortalHeader
        admin
        currentPage={currentPage}
        menuOpen={mobileMenuOpen}
        user={user}
        onNavigate={navigate}
      />

      {/* Main Container */}
      <main
        className="app-main"
        style={{
          flex: 1,
          minWidth: 0,
          overflowY: "auto",
          height: "100vh",
        }}
      >
        {mobileMenuOpen ? (
          <MobilePortalMenu
            admin
            user={user}
            feedbackCount={feedbackCount}
            onNavigate={navigate}
            onLogout={onLogout}
          />
        ) : (
          children
        )}
      </main>
      <MobilePortalBottomNavigation
        admin
        currentPage={currentPage}
        menuOpen={mobileMenuOpen}
        onNavigate={navigate}
        onMenuOpen={() => setMobileMenuOpen((open) => !open)}
      />
    </div>
  )
}
