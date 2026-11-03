import {
  Activity,
  Bell,
  ChevronRight,
  Cpu,
  DoorOpen,
  GitBranch,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Shield,
  Sliders,
  User,
  Users,
  Zap,
} from "lucide-react"
import { useState } from "react"
import type { Page } from "../App"
import type { AuthUser } from "../services/auth"
import FeedbackModal from "./FeedbackModal"

interface MobilePortalNavigationProps {
  admin: boolean
  currentPage: Page
  menuOpen: boolean
  user: AuthUser | null
  onNavigate: (page: Page) => void
  onMenuOpen: () => void
}

interface MobilePortalMenuProps {
  admin: boolean
  user: AuthUser | null
  feedbackCount?: number
  onNavigate: (page: Page) => void
  onLogout: () => void
}

interface MenuItem {
  label: string
  page?: Page
  action?: "feedback"
  icon: React.ReactNode
}

interface MenuGroup {
  title: string
  items: MenuItem[]
}

const userMenuGroups: MenuGroup[] = [
  {
    title: "Your account",
    items: [
      { label: "Profile", page: "profile", icon: <User size={19} /> },
      { label: "Account settings", page: "settings", icon: <Settings size={19} /> },
    ],
  },
  {
    title: "SmartHome+ features",
    items: [
      { label: "Notifications", page: "notifications", icon: <Bell size={19} /> },
      { label: "Security", page: "security", icon: <Shield size={19} /> },
      { label: "Energy reports", page: "energy", icon: <Zap size={19} /> },
      { label: "Device management", page: "devices", icon: <Cpu size={19} /> },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Feedback", action: "feedback", icon: <MessageSquare size={19} /> },
    ],
  },
]

const adminMenuGroups: MenuGroup[] = [
  {
    title: "Platform overview",
    items: [
      { label: "Dashboard", page: "admin", icon: <LayoutDashboard size={19} /> },
      { label: "User management", page: "admin-users", icon: <Users size={19} /> },
      { label: "Device management", page: "admin-devices", icon: <Cpu size={19} /> },
      { label: "System monitoring", page: "admin-monitoring", icon: <Activity size={19} /> },
      { label: "System settings", page: "admin-settings", icon: <Sliders size={19} /> },
    ],
  },
]

function isMenuSectionPage(page: Page, admin: boolean) {
  return admin
    ? ["admin", "admin-users", "admin-devices", "admin-monitoring", "admin-settings"].includes(page)
    : ["security", "energy", "notifications", "profile", "settings"].includes(page)
}

export function MobilePortalHeader({
  admin,
  currentPage,
  menuOpen,
  user,
  onNavigate,
}: Omit<MobilePortalNavigationProps, "onMenuOpen">) {
  const initials = (user?.name?.trim()?.[0] || (admin ? "A" : "U")).toUpperCase()
  const secondaryText = admin ? "ADMIN CONSOLE" : user?.homeName || "MY HOME"

  return (
    <header className={`mobile-topbar mobile-portal-header${admin ? " admin" : ""}`}>
      <button
        type="button"
        className="mobile-header-brand"
        onClick={() => onNavigate(admin ? "admin" : "dashboard")}
        aria-label="Go to home"
      >
        <span className={`mobile-header-mark${admin ? " admin" : ""}`}>
          {admin ? <Shield size={19} /> : <Home size={19} />}
        </span>
        <span className="mobile-header-copy">
          <strong>SmartHome<span>+</span></strong>
          <small>{secondaryText}</small>
        </span>
      </button>
      <div className="mobile-header-actions">
        <button
          type="button"
          aria-label={admin ? "Open admin notifications" : "Open notifications"}
          onClick={() => onNavigate(admin ? "admin-notifications" : "notifications")}
        >
          <Bell size={19} />
        </button>
        <button
          type="button"
          className="mobile-header-avatar"
          aria-label={admin ? "Open admin profile" : "Open profile"}
          onClick={() => onNavigate(admin ? "admin-profile" : "profile")}
        >
          {user?.avatar ? <img src={user.avatar} alt="" /> : <span>{initials}</span>}
        </button>
      </div>
      <span className="sr-only" aria-live="polite">
        {menuOpen ? "Menu" : currentPage}
      </span>
    </header>
  )
}

export function MobilePortalBottomNavigation({
  admin,
  currentPage,
  menuOpen,
  onNavigate,
  onMenuOpen,
}: Omit<MobilePortalNavigationProps, "user">) {
  const items = admin
    ? [
        { label: "Home", page: "admin" as Page, icon: <LayoutDashboard size={20} /> },
        { label: "Users", page: "admin-users" as Page, icon: <Users size={20} /> },
        { label: "Devices", page: "admin-devices" as Page, icon: <Cpu size={20} /> },
        { label: "Monitor", page: "admin-monitoring" as Page, icon: <Activity size={20} /> },
      ]
    : [
        { label: "Home", page: "dashboard" as Page, icon: <Home size={20} /> },
        { label: "Devices", page: "devices" as Page, icon: <Cpu size={20} /> },
        { label: "Rooms", page: "rooms" as Page, icon: <DoorOpen size={20} /> },
        { label: "Automations", page: "automation" as Page, icon: <GitBranch size={20} /> },
      ]
  const menuActive = menuOpen || isMenuSectionPage(currentPage, admin)

  return (
    <div className="mobile-bottom-bar">
      <nav className={`mobile-bottom-nav${admin ? " admin" : ""}`} aria-label="Main navigation">
        {items.map((item) => {
          const active = currentPage === item.page && !menuOpen
          return (
            <button
              type="button"
              key={item.page}
              className={`mobile-bottom-item${active ? " active" : ""}`}
              aria-current={active ? "page" : undefined}
              onClick={() => onNavigate(item.page)}
            >
              <span className="mobile-bottom-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          )
        })}
        <button
          type="button"
          className={`mobile-bottom-item${menuActive ? " active" : ""}`}
          aria-current={menuActive ? "page" : undefined}
          aria-expanded={menuOpen}
          onClick={onMenuOpen}
        >
          <span className="mobile-bottom-icon"><Menu size={20} /></span>
          <span>Menu</span>
        </button>
      </nav>
    </div>
  )
}

export function MobilePortalMenu({
  admin,
  user,
  feedbackCount = 0,
  onNavigate,
  onLogout,
}: MobilePortalMenuProps) {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const groups = admin ? adminMenuGroups : userMenuGroups
  const initials = (user?.name?.trim()?.[0] || (admin ? "A" : "U")).toUpperCase()

  return (
    <section className={`mobile-portal-menu-page${admin ? " admin" : ""}`}>
      <div className="mobile-menu-intro">
        <span>{admin ? "Platform workspace" : "Your smart home"}</span>
        <h1>Menu</h1>
        <p>
          {admin
            ? "Manage SmartHome+ operations and your admin account."
            : "Manage your home, preferences, and account."}
        </p>
      </div>

      <button
        type="button"
        className="mobile-menu-account"
        onClick={() => onNavigate(admin ? "admin-profile" : "profile")}
      >
        <span className={`mobile-menu-account-avatar${admin ? " admin" : ""}`}>
          {user?.avatar ? <img src={user.avatar} alt="" /> : initials}
        </span>
        <span className="mobile-menu-account-copy">
          <strong>{user?.name || (admin ? "Administrator" : "Homeowner")}</strong>
          <small>{user?.email || (admin ? "Admin account" : user?.homeName || "Home account")}</small>
        </span>
        <ChevronRight className="mobile-menu-account-chevron" size={18} aria-hidden="true" />
      </button>

      {groups.map((group) => (
        <section className="mobile-menu-section" key={group.title}>
          <h2>{group.title}</h2>
          <div className="mobile-menu-links">
            {group.items.map((item) => (
              <button
                type="button"
                className="mobile-menu-link"
                key={item.page ?? item.action}
                onClick={() => {
                  if (item.action === "feedback") setFeedbackOpen(true)
                  else if (item.page) onNavigate(item.page)
                }}
              >
                <span className="mobile-menu-link-icon" aria-hidden="true">{item.icon}</span>
                <span className="mobile-menu-link-label">{item.label}</span>
                {admin && item.page === "admin-feedback" && feedbackCount > 0 && (
                  <span className="mobile-menu-badge">{feedbackCount}</span>
                )}
                <ChevronRight className="mobile-menu-link-chevron" size={17} aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>
      ))}

      <button type="button" className="mobile-menu-logout" onClick={onLogout}>
        <LogOut size={19} />
        <span>Log out</span>
      </button>
      {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}
    </section>
  )
}
