import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const MANAGER_PASSWORD = "admin123"

export default function ManagementLoginPage() {
  const navigate = useNavigate()
  const { user, loginManager } = useAuth()
  const [staffName, setStaffName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (user?.role === "manager") {
      navigate("/dashboard", { replace: true })
    }
  }, [user, navigate])

  function handleSubmit(event) {
    event.preventDefault()
    if (!staffName.trim() || !password.trim()) {
      setError("Enter your name and password to continue.")
      return
    }

    if (staffName.trim() !== "admin") {
      setError("Invalid staff name. Please try again.")
      return
    }

    if (password !== MANAGER_PASSWORD) {
      setError("Invalid password. Please try again.")
      return
    }

    loginManager(staffName.trim())
    navigate("/dashboard")
  }

  return (
    <main className="pb-20">
      <section className="section-wrap pt-6">
        <div className="glass-surface overflow-hidden bg-[linear-gradient(135deg,rgba(13,32,28,0.86),rgba(113,70,28,0.52)),url('/images/sarova 9.jpeg')] bg-cover bg-center p-8 text-white sm:p-10">
          <p className="brand-kicker text-white/75">Staff Login</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-[0.95] sm:text-6xl">
            Hotel management access.
          </h1>
          <p className="mt-5 max-w-3xl font-sans-body text-sm leading-8 text-white/82 sm:text-base">
            Sign in with your staff credentials to view the live order queue and manage guest orders.
          </p>
        </div>
      </section>

      <section className="section-wrap mt-16 grid gap-6 lg:grid-cols-[0.7fr,0.95fr]">
        <div className="glass-surface p-8">
          <p className="brand-kicker">Manager sign-in</p>
          <h2 className="mt-3 text-4xl font-semibold text-nyota-forest dark:text-nyota-sand">
            Secure staff dashboard access.
          </h2>
          <p className="mt-4 font-sans-body text-sm leading-8 text-stone-600 dark:text-stone-300 sm:text-base">
            Use your manager credentials to enter the hotel order dashboard and keep orders moving through the kitchen queue.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
            <label className="font-sans-body text-sm text-stone-600 dark:text-stone-300">
              <span className="mb-2 block font-semibold">Staff name</span>
              <input
                type="text"
                value={staffName}
                onChange={(event) => setStaffName(event.target.value)}
                className="w-full rounded-[22px] border border-stone-200 bg-white px-4 py-3 outline-none focus:border-nyota-bronze focus:ring-4 focus:ring-amber-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-amber-500/20"
                placeholder="Your name"
              />
            </label>
            <label className="font-sans-body text-sm text-stone-600 dark:text-stone-300">
              <span className="mb-2 block font-semibold">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-[22px] border border-stone-200 bg-white px-4 py-3 outline-none focus:border-nyota-bronze focus:ring-4 focus:ring-amber-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-amber-500/20"
                placeholder="Enter staff password"
              />
            </label>
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <button type="submit" className="pill-button-primary mt-2 w-full">
              Enter dashboard
            </button>
          </form>
        </div>

        <div className="glass-surface p-8 bg-gradient-to-b from-nyota-sand/90 to-white/90">
          <h3 className="text-2xl font-semibold text-nyota-forest dark:text-nyota-sand">Dashboard access</h3>
          <ul className="mt-4 space-y-3 font-sans-body text-sm leading-7 text-stone-600 dark:text-stone-300">
            <li>• Access the live kitchen order queue.</li>
            <li>• Move orders from Queued to Preparing, Ready, and Completed.</li>
            <li>• Track elapsed time and highlight delayed orders.</li>
            <li>• Real-time updates from guest order placement.</li>
          </ul>
        </div>
      </section>
    </main>
  )
}
