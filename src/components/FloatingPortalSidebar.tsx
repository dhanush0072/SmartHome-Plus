import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react"
import type { Page } from "../App"

export interface FloatingSidebarItem {
  icon: React.ReactNode
  label: string
  page: Page
  active: boolean
  badge?: React.ReactNode
  admin?: boolean
  onSelect: (page: Page) => void
}

export interface FloatingSidebarGroup {
  label: string
  items: FloatingSidebarItem[]
}

interface FloatingPortalSidebarProps {
  brand: React.ReactNode
  groups: FloatingSidebarGroup[]
  initial: string
  name: string
  subtitle: string
  admin?: boolean
  onLogout: () => void
}

export default function FloatingPortalSidebar({
  brand,
  groups,
  initial,
  name,
  subtitle,
  admin = false,
  onLogout,
}: FloatingPortalSidebarProps) {
  const [expanded, setExpanded] = useState(false)
  const collapseTimer = useRef<number | null>(null)
  const profileItem = groups
    .flatMap((group) => group.items)
    .find((item) => item.label === (admin ? "Admin Profile" : "Profile"))

  const clearCollapseTimer = () => {
    if (collapseTimer.current !== null) {
      window.clearTimeout(collapseTimer.current)
      collapseTimer.current = null
    }
  }

  const scheduleCollapse = () => {
    clearCollapseTimer()
    collapseTimer.current = window.setTimeout(() => {
      setExpanded(false)
      collapseTimer.current = null
    }, 200)
  }

  useEffect(() => () => clearCollapseTimer(), [])

  return (
    <>
      <div className={`portal-desktop-brand${admin ? " admin" : ""}`}>
        {brand}
      </div>

      <aside
        className={`desktop-sidebar floating-glass-sidebar portal-glass-rail${admin ? " admin" : ""}${expanded ? " is-expanded" : ""}`}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") {
            clearCollapseTimer()
            setExpanded(true)
          }
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") scheduleCollapse()
        }}
        onFocus={(event) => {
          if (!(event.target instanceof Element) ||
              !event.target.closest(".floating-sidebar-toggle")) {
            clearCollapseTimer()
            setExpanded(true)
          }
        }}
        onBlur={(event) => {
          const nextTarget =
            event.relatedTarget instanceof Node ? event.relatedTarget : null
          if (!event.currentTarget.contains(nextTarget)) {
            scheduleCollapse()
          }
        }}
        aria-label={
          admin ? "Admin portal navigation" : "Homeowner portal navigation"
        }
      >
        <button
          type="button"
          className="floating-sidebar-toggle"
          aria-label={expanded ? "Collapse navigation" : "Expand navigation"}
          aria-expanded={expanded}
          onClick={() => {
            clearCollapseTimer()
            setExpanded((current) => !current)
          }}
        >
          {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>

        <nav className="floating-sidebar-nav">
          {groups.map((group, groupIndex) => (
            <div
              className={`floating-sidebar-group${groupIndex > 0 ? " with-divider" : ""}`}
              key={group.label}
            >
              <div className="floating-sidebar-heading">{group.label}</div>
              {group.items.map((item) => (
                <button
                  key={item.page}
                  type="button"
                  className={`sidebar-item floating-sidebar-item${item.active ? " active" : ""}${item.admin ? " admin-sidebar-item" : ""}`}
                  aria-label={item.label}
                  aria-current={item.active ? "page" : undefined}
                  title={item.label}
                  onClick={() => {
                    item.onSelect(item.page)
                    setExpanded(false)
                  }}
                >
                  <span className="floating-sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                  {item.badge}
                  {item.active && (
                    <ChevronRight className="sidebar-chevron" size={14} />
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>

      </aside>

      <div className="floating-sidebar-account-controls">
        <button
          type="button"
          className="floating-sidebar-avatar-button"
          aria-label={`Open profile for ${name}`}
          title={`${name} · ${subtitle}`}
          onClick={() => {
            if (profileItem) {
              profileItem.onSelect(profileItem.page)
              setExpanded(false)
            }
          }}
        >
          <span
            className={`floating-sidebar-avatar${admin ? " admin" : ""}`}
            aria-hidden="true"
          >
            {initial}
          </span>
        </button>
        <button
          type="button"
          className="floating-sidebar-logout"
          onClick={onLogout}
          aria-label="Log out"
          title="Log out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </>
  )
}
