export type UserRole = "ROLE_USER" | "ROLE_ADMIN"

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  plan?: string
  homeName?: string
  joinedDate?: string
}

export interface RegisteredAccount extends AuthUser {
  password: string
}

export interface AuthResult {
  success: boolean
  user?: AuthUser
  error?: string
}

const STORAGE_AUTH = "smarthome-auth"
const STORAGE_USER = "smarthome-auth-user"
const STORAGE_ROLE = "smarthome-auth-role"
const STORAGE_USERS_REGISTRY = "smarthome-users-registry"

// Default seed accounts
export const SEED_ACCOUNTS: RegisteredAccount[] = [
  {
    id: "user-001",
    name: "USER",
    email: "user@smarthome.io",
    password: "user123",
    role: "ROLE_USER",
    plan: "Premium Plan",
    homeName: "USER Villa",
    joinedDate: "Oct 2024",
  },
  {
    id: "admin-001",
    name: "Admin Root",
    email: "admin@smarthome.io",
    password: "admin123",
    role: "ROLE_ADMIN",
    plan: "Platform Superadmin",
    homeName: "SmartHome+ Operations HQ",
    joinedDate: "Jan 2024",
  },
]

function getRegisteredAccounts(): RegisteredAccount[] {
  if (typeof window === "undefined") return SEED_ACCOUNTS
  try {
    const raw = window.localStorage.getItem(STORAGE_USERS_REGISTRY)
    if (!raw) {
      window.localStorage.setItem(
        STORAGE_USERS_REGISTRY,
        JSON.stringify(SEED_ACCOUNTS),
      )
      return SEED_ACCOUNTS
    }
    return JSON.parse(raw)
  } catch {
    return SEED_ACCOUNTS
  }
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STORAGE_USER)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function getCurrentRole(): UserRole | null {
  if (typeof window === "undefined") return null
  return (window.localStorage.getItem(STORAGE_ROLE) as UserRole) || null
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return (
    window.localStorage.getItem(STORAGE_AUTH) === "true" && !!getCurrentUser()
  )
}

export function authenticate(
  email: string,
  password: string,
  intendedRole: UserRole,
): AuthResult {
  const accounts = getRegisteredAccounts()
  const normalizedEmail = email.trim().toLowerCase()

  const found = accounts.find(
    (acc) => acc.email.toLowerCase() === normalizedEmail,
  )

  if (!found) {
    return {
      success: false,
      error: "Invalid email address or account not found.",
    }
  }

  if (found.password !== password) {
    return {
      success: false,
      error: "Incorrect password. Please verify and try again.",
    }
  }

  // Strict Role Verification
  if (intendedRole === "ROLE_ADMIN" && found.role !== "ROLE_ADMIN") {
    return {
      success: false,
      error:
        "Access denied. This account does not have administrator privileges.",
    }
  }

  if (intendedRole === "ROLE_USER" && found.role === "ROLE_ADMIN") {
    return {
      success: false,
      error:
        "This account is an Administrator. Please switch to the Admin Portal to sign in.",
    }
  }

  const { password: _, ...safeUser } = found

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_AUTH, "true")
    window.localStorage.setItem(STORAGE_USER, JSON.stringify(safeUser))
    window.localStorage.setItem(STORAGE_ROLE, safeUser.role)
  }

  return {
    success: true,
    user: safeUser,
  }
}

export function registerHomeowner(
  name: string,
  email: string,
  password: string,
): AuthResult {
  const accounts = getRegisteredAccounts()
  const normalizedEmail = email.trim().toLowerCase()

  if (accounts.some((acc) => acc.email.toLowerCase() === normalizedEmail)) {
    return {
      success: false,
      error: "An account with this email address already exists.",
    }
  }

  const newUser: RegisteredAccount = {
    id: `user-${Date.now()}`,
    name: name.trim() || "Homeowner",
    email: normalizedEmail,
    password,
    role: "ROLE_USER",
    plan: "Starter Plan",
    homeName: `${name.trim() || "My"}'s Smart Home`,
    joinedDate: "Just now",
  }

  const updated = [...accounts, newUser]
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_USERS_REGISTRY, JSON.stringify(updated))
    window.localStorage.setItem(STORAGE_AUTH, "true")
    window.localStorage.setItem(STORAGE_USER, JSON.stringify(newUser))
    window.localStorage.setItem(STORAGE_ROLE, "ROLE_USER")
  }

  return {
    success: true,
    user: newUser,
  }
}

export function logout(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_AUTH)
    window.localStorage.removeItem(STORAGE_USER)
    window.localStorage.removeItem(STORAGE_ROLE)
    window.localStorage.removeItem("smarthome-page")
  }
}
