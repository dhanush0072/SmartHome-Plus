import type { Page } from "../App"
import type { AuthUser } from "../services/auth"
import AdminDashboardView from "./admin/AdminDashboardView"
import AdminUsersView from "./admin/AdminUsersView"
import AdminDevicesView from "./admin/AdminDevicesView"
import AdminMonitoringView from "./admin/AdminMonitoringView"
import AdminEnergyView from "./admin/AdminEnergyView"
import AdminAutomationView from "./admin/AdminAutomationView"
import AdminNotificationsView from "./admin/AdminNotificationsView"
import AdminFeedbackView from "./admin/AdminFeedbackView"
import AdminLogsView from "./admin/AdminLogsView"
import AdminSettingsView from "./admin/AdminSettingsView"
import AdminProfileView from "./admin/AdminProfileView"

interface AdminProps {
  subpage?: Page
  onNavigate?: (p: Page) => void
  user?: AuthUser | null
}

export default function Admin({
  subpage = "admin",
  onNavigate = () => {},
  user = null,
}: AdminProps) {
  switch (subpage) {
    case "admin-users":
      return <AdminUsersView />
    case "admin-devices":
      return <AdminDevicesView />
    case "admin-monitoring":
      return <AdminMonitoringView />
    case "admin-energy":
      return <AdminEnergyView />
    case "admin-automation":
      return <AdminAutomationView />
    case "admin-notifications":
      return <AdminNotificationsView />
    case "admin-feedback":
      return <AdminFeedbackView />
    case "admin-logs":
      return <AdminLogsView />
    case "admin-settings":
      return <AdminSettingsView />
    case "admin-profile":
      return <AdminProfileView user={user} />
    case "admin":
    default:
      return <AdminDashboardView onNavigate={onNavigate} />
  }
}
