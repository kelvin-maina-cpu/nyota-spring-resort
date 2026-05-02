import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function LoginPage() {
  const navigate = useNavigate()
  const { user, loginGuest } = useAuth()
  const [guestName, setGuestName] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (user) {
      navigate("/dining", { replace: true })
    }
  }, [user, navigate])

  function handleSubmit(event) {
    event.preventDefault()
    if (!guestName.trim()) {
      setError("Please enter your name to continue.")
      return
    }

    loginGuest(guestName.trim())
    navigate("/dining")
  }

  return (
    <main className="pb-20">
      <section className="section-wrap pt-6">
        <div className="glass-surface overflow-hidden bg-[linear-gradient(135deg,rgba(13,32,28,0.86),rgba(113,70,28,0.52)),url('/images/sarova 9.jpeg')] bg-cover bg-center p-8 text-white sm:p-10">
          <p className="brand-kicker text-white/75">Guest Login</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-[0.95] sm:text-6xl">
            Sign in to place your dining order.
          </h1>
          <p className="mt-5 max-w-3xl font-sans-body text-sm leading-8 text-white/82 sm:text-base">
            Enter your name and a unique guest ID will be created automatically so your order can be queued and tracked.
          </p>
        </div>
      </section>

      <section className="section-wrap mt-16 grid gap-6 lg:grid-cols-[0.7fr,0.95fr]">
        <div className="glass-surface p-8">
          <p className="brand-kicker">Simple guest sign-in</p>
          <h2 className="mt-3 text-4xl font-semibold text-nyota-forest dark:text-nyota-sand">
            No registration needed.
          </h2>
          <p className="mt-4 font-sans-body text-sm leading-8 text-stone-600 dark:text-stone-300 sm:text-base">
            Enter your name and a unique guest ID will be created automatically to differentiate your order in the queue.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
            <label className="font-sans-body text-sm text-stone-600 dark:text-stone-300">
              <span className="mb-2 block font-semibold">Guest name</span>
              <input
                type="text"
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                className="w-full rounded-[22px] border border-stone-200 bg-white px-4 py-3 outline-none focus:border-nyota-bronze focus:ring-4 focus:ring-amber-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-amber-500/20"
                placeholder="Your full name"
              />
            </label>
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <button type="submit" className="pill-button-primary mt-2 w-full">
              Continue to menu
            </button>
          </form>
        </div>

        <div className="glass-surface p-8 bg-gradient-to-b from-nyota-sand/90 to-white/90">
          <h3 className="text-2xl font-semibold text-nyota-forest dark:text-nyota-sand">Why login?</h3>
          <ul className="mt-4 space-y-3 font-sans-body text-sm leading-7 text-stone-600 dark:text-stone-300">
            <li>• Your order is tagged with a unique guest ID automatically.</li>
            <li>• Kitchen staff can see and queue your order accurately.</li>
            <li>• Orders are differentiated by guest rather than anonymous carts.</li>
            <li>• You can keep ordering from the dining menu without re-entering details.</li>
          </ul>
        </div>
      </section>
    </main>
  )
}
