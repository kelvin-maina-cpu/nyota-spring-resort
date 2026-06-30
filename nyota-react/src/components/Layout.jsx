import { useEffect, useState } from "react"
import { Link, NavLink } from "react-router-dom"

import { useAuth } from "../contexts/AuthContext"
import { hotelCopy } from "../data/siteData"

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/rooms", label: "Rooms" },
  { to: "/gallery", label: "Gallery" },
  { to: "/dining", label: "Dining" },
  { to: "/contact", label: "Contact" },
]

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const { user, logout } = useAuth()

  useEffect(() => {
    const saved = localStorage.getItem("nyota-theme")
    if (saved) {
      const isDark = saved === "dark"
      setDarkMode(isDark)
      document.body.classList.toggle("dark", isDark)
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode)
    localStorage.setItem("nyota-theme", darkMode ? "dark" : "light")
  }, [darkMode])

  const toggleTheme = () => setDarkMode(!darkMode)

  function handleLogout() {
    logout()
    setMobileOpen(false)
  }

  return (
    <div className="app-shell">
      <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/85 backdrop-blur-xl dark:border-white/20 dark:bg-[#101914]/80">
        <div className="section-wrap flex min-h-[84px] items-center justify-between gap-3 sm:gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5 lg:flex-none">
            <span className="brand-kicker">{hotelCopy.eyebrow}</span>
            <Link
              to="/"
              className="truncate text-xl font-semibold text-nyota-forest dark:text-nyota-sand sm:text-2xl"
            >
              {hotelCopy.name}
            </Link>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/dining#menu" className="pill-button-primary ml-2">
              Order Now
            </Link>
            {user ? (
              user.role === "manager" ? (
                <div className="ml-3 flex items-center gap-2 rounded-full border border-stone-200 bg-white/75 px-4 py-2 text-sm text-stone-700 dark:border-white/10 dark:bg-white/10 dark:text-stone-100">
                  <span>{user.staffName}</span>
                  <span className="text-stone-400">•</span>
                  <Link
                    to="/dashboard"
                    className="text-sm font-semibold text-nyota-bronze dark:text-nyota-sand"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-200 dark:bg-white/10 dark:text-stone-100 dark:hover:bg-white/20"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="ml-3 flex items-center gap-2 rounded-full border border-stone-200 bg-white/75 px-4 py-2 text-sm text-stone-700 dark:border-white/10 dark:bg-white/10 dark:text-stone-100">
                  <span>{user.guestName}</span>
                  <span className="text-stone-400">•</span>
                  <span className="font-mono text-xs text-stone-500 dark:text-stone-300">
                    {user.userId.slice(0, 12)}
                  </span>
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-200 dark:bg-white/10 dark:text-stone-100 dark:hover:bg-white/20"
                  >
                    Logout
                  </button>
                </div>
              )
            ) : (
              <Link to="/management-login" className="pill-button-primary ml-2">
                Staff
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-lg text-nyota-forest shadow-nyota-soft hover:bg-stone-200 dark:bg-white/10 dark:text-stone-100 dark:hover:bg-white/20 lg:mr-4"
              title="Toggle theme"
            >
              {darkMode ? "☀" : "☾"}
            </button>
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((value) => !value)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white/80 text-lg text-nyota-forest shadow-nyota-soft hover:-translate-y-0.5 dark:border-white/20 dark:bg-white/10 dark:text-stone-100 lg:hidden"
            >
              {mobileOpen ? "×" : "☰"}
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="section-wrap grid gap-2 pb-4 lg:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 font-sans-body text-sm font-medium ${
                    isActive
                      ? "bg-nyota-gold text-stone-950"
                      : "bg-white/75 text-stone-700 dark:bg-white/10 dark:text-stone-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/dining#menu" onClick={() => setMobileOpen(false)} className="pill-button-primary">
              Order Now
            </Link>
            {user ? (
              user.role === "manager" ? (
                <div className="grid gap-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-2xl bg-white/75 px-4 py-3 text-center font-sans-body text-sm font-medium text-stone-700 dark:bg-white/10 dark:text-stone-100"
                  >
                    Dashboard
                  </Link>
                  <button type="button" onClick={handleLogout} className="pill-button-secondary">
                    Logout
                  </button>
                </div>
              ) : (
                <button type="button" onClick={handleLogout} className="pill-button-secondary">
                  Logout
                </button>
              )
            ) : (
              <Link
                to="/management-login"
                onClick={() => setMobileOpen(false)}
                className="pill-button-primary"
              >
                Staff
              </Link>
            )}
          </div>
        ) : null}
      </header>

      {children}
    </div>
  )
}
