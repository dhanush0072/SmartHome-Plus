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
  Home,
} from "lucide-react"
import { useEffect, useState } from "react"
import pageBackground from "../Assets/room.png"
import FloatingPortalSidebar from "./FloatingPortalSidebar"
import {
  MobilePortalBottomNavigation,
  MobilePortalHeader,
  MobilePortalMenu,
} from "./MobilePortalNavigation"
import type { Page } from "../App"
import type { AuthUser } from "../services/auth"

const primaryNavItems: { icon: React.ReactNode; label: string; page: Page }[] = [
  {
    icon: <LayoutDashboard size={18} />,
    label: "Dashboard",
    page: "dashboard",
  },
  { icon: <DoorOpen size={18} />, label: "Rooms", page: "rooms" },
  { icon: <Cpu size={18} />, label: "Smart Devices", page: "devices" },
  { icon: <Shield size={18} />, label: "Security", page: "security" },
  { icon: <Zap size={18} />, label: "Energy", page: "energy" },
  { icon: <GitBranch size={18} />, label: "Automations", page: "automation" },
  { icon: <Bell size={18} />, label: "Notifications", page: "notifications" },
]

const secondaryNavItems: { icon: React.ReactNode; label: string; page: Page }[] =
  [
    { icon: <User size={18} />, label: "Profile", page: "profile" },
    { icon: <Settings size={18} />, label: "Settings", page: "settings" },
  ]

interface UserLayoutProps {
  currentPage: Page
  onNavigate: (p: Page) => void
  onLogout: () => void
  user: AuthUser | null
  children: React.ReactNode
}

export default function UserLayout({
  currentPage,
  onNavigate,
  onLogout,
  user,
  children,
}: UserLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigate = (page: Page) => {
    onNavigate(page)
    setMobileMenuOpen(false)
  }

  const initial = (user?.name?.trim()?.[0] || "U").toUpperCase()

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 768px)")
    const closeMobileMenu = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileMenuOpen(false)
    }
    desktopQuery.addEventListener("change", closeMobileMenu)
    return () => desktopQuery.removeEventListener("change", closeMobileMenu)
  }, [])

  return (
    <div
      className="app-shell user-portal-shell"
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
        brand={
          <button
            type="button"
            className="portal-brand-button"
            onClick={() => navigate("landing")}
          >
            <span className="portal-brand-mark">
              <Home size={19} color="white" />
            </span>
            <span className="portal-brand-copy">
              <strong>
                SmartHome<span>+</span>
              </strong>
              <small>Homeowner Portal</small>
            </span>
          </button>
        }
        groups={[
          {
            label: "Home Controls",
            items: primaryNavItems.map((item) => ({
              ...item,
              active: currentPage === item.page,
              onSelect: navigate,
            })),
          },
          {
            label: "Account & System",
            items: secondaryNavItems.map((item) => ({
              ...item,
              active: currentPage === item.page,
              onSelect: navigate,
            })),
          },
        ]}
        initial={initial}
        name={user?.name || "USER"}
        subtitle={user?.homeName || "USER Villa"}
        onLogout={onLogout}
      />

      <MobilePortalHeader
        admin={false}
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
            admin={false}
            user={user}
            onNavigate={navigate}
            onLogout={onLogout}
          />
        ) : (
          children
        )}
      </main>
      <MobilePortalBottomNavigation
        admin={false}
        currentPage={currentPage}
        menuOpen={mobileMenuOpen}
        onNavigate={navigate}
        onMenuOpen={() => setMobileMenuOpen((open) => !open)}
      />
    </div>
  )
}
