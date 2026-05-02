import { createContext, useContext, useEffect, useMemo, useState } from "react"

const AuthContext = createContext(null)
const STORAGE_KEY = "nyotaGuestSession"

function createGuestSession(guestName) {
  return {
    userId: `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    role: "guest",
    guestName,
  }
}

function createManagerSession(staffName) {
  return {
    userId: `manager_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    role: "manager",
    staffName,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const loginGuest = (guestName) => {
    const session = createGuestSession(guestName)
    setUser(session)
    return session
  }

  const loginManager = (staffName) => {
    const session = createManagerSession(staffName)
    setUser(session)
    return session
  }

  const logout = () => {
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, loginGuest, loginManager, logout, isLoggedIn: Boolean(user) }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
