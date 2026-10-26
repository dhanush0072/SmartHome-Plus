import { useState } from "react"
import { Search, UserPlus, Shield, User, Trash2, X } from "lucide-react"

interface UserItem {
  id: string
  name: string
  email: string
  role: "ROLE_USER" | "ROLE_ADMIN"
  plan: "Starter" | "Pro" | "Enterprise" | "Superadmin"
  devices: number
  homeName: string
  status: "active" | "suspended" | "inactive"
  joinedDate: string
}

const initialUsers: UserItem[] = [
  {
    id: "1",
    name: "USER",
    email: "user@smarthome.io",
    role: "ROLE_USER",
    plan: "Pro",
    devices: 24,
    homeName: "USER Villa",
    status: "active",
    joinedDate: "Oct 2024",
  },
  {
    id: "2",
    name: "Admin Root",
    email: "admin@smarthome.io",
    role: "ROLE_ADMIN",
    plan: "Superadmin",
    devices: 140,
    homeName: "HQ Operations",
    status: "active",
    joinedDate: "Jan 2024",
  },
  {
    id: "3",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    role: "ROLE_USER",
    plan: "Pro",
    devices: 18,
    homeName: "Skyline Palms 402",
    status: "active",
    joinedDate: "Nov 2024",
  },
  {
    id: "4",
    name: "Rahul Mehta",
    email: "rahul.mehta@example.com",
    role: "ROLE_USER",
    plan: "Starter",
    devices: 8,
    homeName: "Mehta Haven",
    status: "active",
    joinedDate: "Dec 2024",
  },
  {
    id: "5",
    name: "Ananya Nair",
    email: "ananya.n@enterprise.in",
    role: "ROLE_USER",
    plan: "Enterprise",
    devices: 56,
    homeName: "Greenwood Estate",
    status: "active",
    joinedDate: "Jan 2025",
  },
  {
    id: "6",
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    role: "ROLE_USER",
    plan: "Starter",
    devices: 4,
    homeName: "Singh Residency",
    status: "inactive",
    joinedDate: "Feb 2025",
  },
  {
    id: "7",
    name: "Siddharth Rao",
    email: "siddharth@iot-labs.io",
    role: "ROLE_USER",
    plan: "Pro",
    devices: 29,
    homeName: "Tech Park Bungalow",
    status: "suspended",
    joinedDate: "Mar 2025",
  },
]

export default function AdminUsersView() {
  const [usersList, setUsersList] = useState<UserItem[]>(initialUsers)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] =
    useState<"ALL" | "ROLE_USER" | "ROLE_ADMIN">("ALL")
  const [statusFilter, setStatusFilter] =
    useState<"ALL" | "active" | "suspended" | "inactive">("ALL")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newRole, setNewRole] = useState<"ROLE_USER" | "ROLE_ADMIN">(
    "ROLE_USER",
  )
  const [newPlan, setNewPlan] = useState<"Starter" | "Pro" | "Enterprise">(
    "Pro",
  )

  const handleToggleStatus = (id: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === "active" ? "suspended" : "active"
          return { ...u, status: nextStatus }
        }
        return u
      }),
    )
  }

  const handleDeleteUser = (id: string) => {
    if (
      confirm(
        "Are you sure you want to remove this user and disconnect their home hub?",
      )
    ) {
      setUsersList((prev) => prev.filter((u) => u.id !== id))
    }
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newEmail.trim()) return

    const newUser: UserItem = {
      id: `${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      role: newRole,
      plan: newRole === "ROLE_ADMIN" ? "Superadmin" : newPlan,
      devices: 0,
      homeName: `${newName.trim()}'s Residence`,
      status: "active",
      joinedDate: "Just now",
    }

    setUsersList([newUser, ...usersList])
    setIsAddUserOpen(false)
    setNewName("")
    setNewEmail("")
  }

  const filteredUsers = usersList.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.homeName.toLowerCase().includes(search.toLowerCase())

    const matchRole = roleFilter === "ALL" || u.role === roleFilter
    const matchStatus = statusFilter === "ALL" || u.status === statusFilter

    return matchSearch && matchRole && matchStatus
  })

  return (
    <div
      className="account-page"
      style={{ padding: "clamp(16px, 3vw, 32px)", minHeight: "100vh" }}
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
              Identity & Access Management
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
            User Management
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#48484A",
              margin: "4px 0 0",
              fontWeight: 500,
            }}
          >
            Manage registered homeowners, administrators, account permissions,
            and active subscriptions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddUserOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
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
          <UserPlus size={16} /> Add User / Admin
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div
        className="glass-card"
        style={{ padding: "16px 20px", marginBottom: 20 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          {/* Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(0,0,0,0.04)",
              borderRadius: 10,
              padding: "9px 14px",
              minWidth: 260,
              flex: 1,
            }}
          >
            <Search size={15} color="#6E6E73" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or estate..."
              style={{
                background: "none",
                border: "none",
                outline: "none",
                fontSize: 13,
                color: "#1D1D1F",
                width: "100%",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Role Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6E6E73" }}>
              Role:
            </span>
            {(["ALL", "ROLE_USER", "ROLE_ADMIN"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "5px 10px",
                  borderRadius: 8,
                  border: "none",
                  background: roleFilter === r ? "#007AFF" : "rgba(0,0,0,0.05)",
                  color: roleFilter === r ? "white" : "#6E6E73",
                  cursor: "pointer",
                }}
              >
                {r === "ALL"
                  ? "All"
                  : r === "ROLE_USER"
                    ? "Homeowner"
                    : "Admin"}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6E6E73" }}>
              Status:
            </span>
            {(["ALL", "active", "suspended", "inactive"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "capitalize",
                  padding: "5px 10px",
                  borderRadius: 8,
                  border: "none",
                  background:
                    statusFilter === s ? "#1D1D1F" : "rgba(0,0,0,0.05)",
                  color: statusFilter === s ? "white" : "#6E6E73",
                  cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card" style={{ padding: 22 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <h2
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: "#1D1D1F",
              margin: 0,
            }}
          >
            Directory ({filteredUsers.length} accounts)
          </h2>
          <span style={{ fontSize: 12, color: "#6E6E73" }}>
            Live synchronized with local registry
          </span>
        </div>

        <div
          style={{
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            width: "100%",
          }}
        >
          <table
            style={{ width: "100%", minWidth: 700, borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                {[
                  "User / Estate",
                  "Role",
                  "Subscription",
                  "Connected Devices",
                  "Status",
                  "Joined",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#6E6E73",
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      padding: "0 8px 12px",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const isAdmin = u.role === "ROLE_ADMIN"
                const isSuspended = u.status === "suspended"
                const isInactive = u.status === "inactive"

                return (
                  <tr
                    key={u.id}
                    style={{
                      transition: "background 0.15s ease",
                      borderBottom: "1px solid rgba(0,0,0,0.04)",
                    }}
                  >
                    {/* User Info */}
                    <td style={{ padding: "12px 8px" }}>
                      <div
                        style={{
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
                            background: isAdmin
                              ? "linear-gradient(135deg, #FF3B30, #FF9500)"
                              : "linear-gradient(135deg, #007AFF, #5AC8FA)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: 13,
                            color: "white",
                            flexShrink: 0,
                          }}
                        >
                          {isAdmin ? <Shield size={16} /> : u.name[0]}
                        </div>
                        <div>
                          <p
                            style={{
                              margin: 0,
                              fontWeight: 700,
                              fontSize: 13,
                              color: "#1D1D1F",
                            }}
                          >
                            {u.name}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 11,
                              color: "#6E6E73",
                            }}
                          >
                            {u.email}
                          </p>
                          <span
                            style={{
                              fontSize: 10,
                              color: "#8E8E93",
                              fontWeight: 500,
                            }}
                          >
                            {u.homeName}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td style={{ padding: "12px 8px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: 6,
                          background: isAdmin
                            ? "rgba(255,59,48,0.1)"
                            : "rgba(0,122,255,0.1)",
                          color: isAdmin ? "#D70015" : "#007AFF",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {isAdmin ? <Shield size={11} /> : <User size={11} />}
                        {isAdmin ? "Administrator" : "Homeowner"}
                      </span>
                    </td>

                    {/* Subscription */}
                    <td style={{ padding: "12px 8px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: 6,
                          background:
                            u.plan === "Enterprise" || u.plan === "Superadmin"
                              ? "rgba(255,149,0,0.1)"
                              : u.plan === "Pro"
                                ? "rgba(0,122,255,0.08)"
                                : "rgba(0,0,0,0.05)",
                          color:
                            u.plan === "Enterprise" || u.plan === "Superadmin"
                              ? "#FF9500"
                              : u.plan === "Pro"
                                ? "#007AFF"
                                : "#6E6E73",
                        }}
                      >
                        {u.plan}
                      </span>
                    </td>

                    {/* Devices */}
                    <td
                      style={{
                        padding: "12px 8px",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#1D1D1F",
                      }}
                    >
                      {u.devices} units
                    </td>

                    {/* Status */}
                    <td style={{ padding: "12px 8px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: 6,
                          background: isSuspended
                            ? "rgba(255,59,48,0.1)"
                            : isInactive
                              ? "rgba(0,0,0,0.06)"
                              : "rgba(52,199,89,0.1)",
                          color: isSuspended
                            ? "#FF3B30"
                            : isInactive
                              ? "#8E8E93"
                              : "#34C759",
                          textTransform: "capitalize",
                        }}
                      >
                        {u.status}
                      </span>
                    </td>

                    {/* Joined */}
                    <td
                      style={{
                        padding: "12px 8px",
                        fontSize: 12,
                        color: "#6E6E73",
                      }}
                    >
                      {u.joinedDate}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "12px 8px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u.id)}
                          title={
                            u.status === "active"
                              ? "Suspend Access"
                              : "Activate Access"
                          }
                          style={{
                            padding: "4px 8px",
                            borderRadius: 6,
                            background:
                              u.status === "active"
                                ? "rgba(255,59,48,0.08)"
                                : "rgba(52,199,89,0.08)",
                            color:
                              u.status === "active" ? "#FF3B30" : "#34C759",
                            border: "none",
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          {u.status === "active" ? "Suspend" : "Activate"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u.id)}
                          title="Delete User"
                          style={{
                            padding: 6,
                            borderRadius: 6,
                            background: "none",
                            border: "none",
                            color: "#8E8E93",
                            cursor: "pointer",
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div
          className="feedback-modal-backdrop"
          role="presentation"
          onMouseDown={(e) =>
            e.target === e.currentTarget && setIsAddUserOpen(false)
          }
        >
          <div className="feedback-modal" style={{ maxWidth: 460 }}>
            <div className="feedback-modal-header">
              <div className="feedback-modal-heading">
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(0,122,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#007AFF",
                  }}
                >
                  <UserPlus size={18} />
                </div>
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#1D1D1F",
                    }}
                  >
                    Provision New User Account
                  </h2>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: 12,
                      color: "#6E6E73",
                    }}
                  >
                    Configure credentials and platform permissions
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="feedback-close-button"
                onClick={() => setIsAddUserOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleAddUser}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <label className="feedback-field-group">
                <span className="feedback-field-label">Full Name</span>
                <input
                  type="text"
                  placeholder="e.g. Meera Kapoor"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(0,0,0,0.12)",
                    fontSize: 13,
                    background: "rgba(255,255,255,0.7)",
                    outline: "none",
                  }}
                />
              </label>

              <label className="feedback-field-group">
                <span className="feedback-field-label">Email Address</span>
                <input
                  type="email"
                  placeholder="e.g. meera@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(0,0,0,0.12)",
                    fontSize: 13,
                    background: "rgba(255,255,255,0.7)",
                    outline: "none",
                  }}
                />
              </label>

              <label className="feedback-field-group">
                <span className="feedback-field-label">Assigned Role</span>
                <select
                  value={newRole}
                  onChange={(e) =>
                    setNewRole(e.target.value as "ROLE_USER" | "ROLE_ADMIN")
                  }
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(0,0,0,0.12)",
                    fontSize: 13,
                    background: "rgba(255,255,255,0.7)",
                    outline: "none",
                  }}
                >
                  <option value="ROLE_USER">Homeowner (User Portal)</option>
                  <option value="ROLE_ADMIN">
                    Platform Administrator (Admin Portal)
                  </option>
                </select>
              </label>

              {newRole === "ROLE_USER" && (
                <label className="feedback-field-group">
                  <span className="feedback-field-label">
                    Subscription Tier
                  </span>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value as any)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1px solid rgba(0,0,0,0.12)",
                      fontSize: 13,
                      background: "rgba(255,255,255,0.7)",
                      outline: "none",
                    }}
                  >
                    <option value="Starter">Starter Plan</option>
                    <option value="Pro">Pro Plan</option>
                    <option value="Enterprise">Enterprise Plan</option>
                  </select>
                </label>
              )}

              <div className="feedback-modal-actions">
                <button
                  type="button"
                  className="feedback-secondary-button"
                  onClick={() => setIsAddUserOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="feedback-primary-button">
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
