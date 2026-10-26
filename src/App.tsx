import { useEffect, useState } from "react"
import Landing from "./pages/Landing"
import Auth from "./pages/Auth"
import Dashboard from "./pages/Dashboard"
import Rooms from "./pages/Rooms"
import Devices from "./pages/Devices"
import Security from "./pages/Security"
import Energy from "./pages/Energy"
import Automation from "./pages/Automation"
import Notifications from "./pages/Notifications"
import Profile from "./pages/Profile"
import Settings from "./pages/Settings"
import Admin from "./pages/Admin"
import UserLayout from "./components/UserLayout"
import AdminLayout from "./components/AdminLayout"
import PageTransition from "./components/PageTransition"
import SmartHomeLoader from "./components/SmartHomeLoader"
import { runDueCleaningSchedule } from "./services/cleaningRobot"
import {
  getCurrentUser,
  getCurrentRole,
  isAuthenticated,
  logout as performLogout,
  type AuthUser,
  type UserRole,
} from "./services/auth"

export type Page = "landing" | "auth" | "dashboard" | "rooms" | "devices" | "security" | "energy" | "automation" | "notifications" | "profile" | "settings" | "admin" | "admin-users" | "admin-devices" | "admin-monitoring" | "admin-energy" | "admin-automation" | "admin-notifications" | "admin-feedback" | "admin-logs" | "admin-settings" | "admin-profile"

const adminPages: Page[] = [
  "admin",
  "admin-users",
  "admin-devices",
  "admin-monitoring",
  "admin-energy",
  "admin-automation",
  "admin-notifications",
  "admin-feedback",
  "admin-logs",
  "admin-settings",
  "admin-profile",
]

const homeownerPages: Page[] = [
  "dashboard",
  "rooms",
  "devices",
  "security",
  "energy",
  "automation",
  "notifications",
  "profile",
  "settings",
]

export default function App() {
  const [authed, setAuthed] = useState(() => isAuthenticated())
  const [user, setUser] = useState<AuthUser | null>(() => getCurrentUser())
  const [role, setRole] = useState<UserRole | null>(() => getCurrentRole())

  const [page, setPage] = useState<Page>(() => {
    if (typeof window === "undefined") return "landing"

    const savedAuth = window.localStorage.getItem("smarthome-auth") === "true"
    const savedRole = window.localStorage.getItem(
      "smarthome-auth-role",
    ) as UserRole | null
    const savedPage = window.localStorage.getItem(
      "smarthome-page",
    ) as Page | null

    if (!savedAuth) {
      if (savedPage === "auth" || savedPage === "landing") return savedPage
      return "landing"
    }

    if (savedPage) {
      // Guard against role-mismatch in saved page
      if (savedRole === "ROLE_USER" && adminPages.includes(savedPage)) {
        return "dashboard"
      }
      if (savedRole === "ROLE_ADMIN" && homeownerPages.includes(savedPage)) {
        return "admin"
      }
      return savedPage
    }

    return savedRole === "ROLE_ADMIN" ? "admin" : "dashboard"
  })

  const [initialLoading, setInitialLoading] = useState(true)
  const [navigating, setNavigating] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setInitialLoading(false), 600)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!authed || role !== "ROLE_USER" || !user) return
    const checkSchedules = () => runDueCleaningSchedule(user.id)
    checkSchedules()
    const timer = window.setInterval(checkSchedules, 15_000)
    return () => window.clearInterval(timer)
  }, [authed, role, user])

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("smarthome-page", page)
    }
  }, [page])

  const navigate = (nextPage: Page) => {
    if (nextPage === page) return

    // Route Guarding (RBAC)
    if (!authed && nextPage !== "landing" && nextPage !== "auth") {
      setNavigating(true)
      window.setTimeout(() => {
        setPage("auth")
        window.setTimeout(() => setNavigating(false), 200)
      }, 100)
      return
    }

    if (authed) {
      if (role === "ROLE_USER" && adminPages.includes(nextPage)) {
        // Prevent homeowner from accessing admin routes
        alert("Access Denied: You do not have administrator permissions.")
        return
      }
      if (role === "ROLE_ADMIN" && homeownerPages.includes(nextPage)) {
        // Prevent admin from getting stuck in homeowner controls without portal switch
        alert(
          "Notice: You are in Administrator mode. Use the Admin Console to manage system operations.",
        )
        return
      }
    }

    setNavigating(true)
    window.setTimeout(() => {
      setPage(nextPage)
      window.setTimeout(() => setNavigating(false), 240)
    }, 120)
  }

  const handleLoginSuccess = (loggedInUser?: AuthUser) => {
    const u = loggedInUser || getCurrentUser()
    setUser(u)
    const r = u?.role || "ROLE_USER"
    setRole(r)
    setAuthed(true)

    setNavigating(true)
    window.setTimeout(() => {
      if (r === "ROLE_ADMIN") {
        setPage("admin")
      } else {
        setPage("dashboard")
      }
      window.setTimeout(() => setNavigating(false), 240)
    }, 120)
  }

  const handleLogout = () => {
    performLogout()
    setUser(null)
    setRole(null)
    setAuthed(false)
    navigate("landing")
  }

  let content: React.ReactNode

  if (page === "landing") {
    content = <Landing onNavigate={navigate} />
  } else if (page === "auth") {
    content = (
      <Auth
        onNavigate={navigate}
        onLogin={handleLoginSuccess}
        initialRole={role || "ROLE_USER"}
      />
    )
  } else if (adminPages.includes(page)) {
    // If somehow a homeowner accesses this page, render Access Denied guard
    if (role !== "ROLE_ADMIN") {
      content = (
        <UserLayout
          currentPage="dashboard"
          onNavigate={navigate}
          onLogout={handleLogout}
          user={user}
        >
          <div style={{ padding: 40, textAlign: "center" }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#FF3B30" }}>
              403 Access Denied
            </h2>
            <p style={{ color: "#48484A", marginTop: 8 }}>
              This account does not have administrator privileges.
            </p>
            <button
              type="button"
              className="btn-primary"
              style={{ marginTop: 16 }}
              onClick={() => navigate("dashboard")}
            >
              Return to User Dashboard
            </button>
          </div>
        </UserLayout>
      )
    } else {
      content = (
        <AdminLayout
          currentPage={page}
          onNavigate={navigate}
          onLogout={handleLogout}
          user={user}
        >
          <Admin subpage={page} onNavigate={navigate} user={user} />
        </AdminLayout>
      )
    }
  } else {
    // Homeowner pages
    const userAppPages: Record<string, React.ReactNode> = {
      dashboard: <Dashboard onNavigate={navigate} userName={user?.name} />,
      rooms: <Rooms />,
      devices: <Devices />,
      security: <Security />,
      energy: <Energy />,
      automation: <Automation />,
      notifications: <Notifications />,
      profile: <Profile />,
      settings: <Settings />,
    }

    content = (
      <UserLayout
        currentPage={page}
        onNavigate={navigate}
        onLogout={handleLogout}
        user={user}
      >
        {userAppPages[page] ?? <Dashboard onNavigate={navigate} />}
      </UserLayout>
    )
  }

  return (
    <>
      <PageTransition pageKey={page}>{content}</PageTransition>
      {(initialLoading || navigating) && (
        <div
          className={`global-loading-overlay${
            initialLoading ? " is-initial" : ""
          }`}
        >
          <SmartHomeLoader />
        </div>
      )}
    </>
  )
}
