import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { io } from "socket.io-client"
import { useAuth } from "../contexts/AuthContext"
import SectionTitle from "../components/SectionTitle"

const BACKEND_URL = "http://localhost:4000"
const statusStyle = {
  Queued: "bg-amber-100 text-amber-800",
  Preparing: "bg-sky-100 text-sky-800",
  Ready: "bg-emerald-100 text-emerald-800",
  Completed: "bg-stone-100 text-stone-700",
}

function formatTime(value) {
  return value.toString().padStart(2, "0")
}

function OrderCard({ order, onAccept, onReady, onDelivered }) {
  const isDelayed = order.elapsedMinutes > order.etaMinutes
  return (
    <article className={`glass-surface border ${isDelayed ? "border-rose-400" : "border-stone-200"} p-5 shadow-nyota-soft`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm uppercase tracking-[0.24em] text-stone-500">Order</span>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">#{order.orderNumber}</span>
          </div>
          <p className="mt-3 text-xl font-semibold text-nyota-forest dark:text-nyota-sand">{order.guestName}</p>
          <p className="text-sm text-stone-500">Guest ID: {order.guestId || "unknown"}</p>
          <p className="mt-2 text-sm text-stone-500">Placed at: {new Date(order.placedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
        </div>

        <div className="space-y-2 text-right">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[order.status]}`}>{order.status}</span>
          <div className="text-sm text-stone-500">ETA: {order.etaMinutes}m</div>
          <div className="text-sm text-stone-500">Elapsed: {order.elapsedMinutes}m</div>
          {isDelayed ? <div className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">Delayed</div> : null}
        </div>
      </div>

      <div className="mt-5 grid gap-3 rounded-[24px] border border-stone-200 bg-stone-50/80 p-4 dark:border-white/10 dark:bg-white/5">
        {order.items.map((item) => (
          <div key={`${order.id}-${item.id}`} className="flex items-center justify-between gap-3 text-sm">
            <div>
              <p className="font-semibold text-nyota-forest dark:text-nyota-sand">{item.name}</p>
              <p className="text-stone-500">Qty: {item.quantity} • {item.note || "No note"}</p>
            </div>
            <span className="font-semibold text-nyota-forest dark:text-nyota-sand">KSh {item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {order.status === "Queued" ? (
          <button onClick={() => onAccept(order.id)} className="pill-button-primary">
            Accept
          </button>
        ) : null}
        {order.status === "Preparing" ? (
          <button onClick={() => onReady(order.id)} className="pill-button-primary">
            Mark Ready
          </button>
        ) : null}
        {order.status === "Ready" ? (
          <button onClick={() => onDelivered(order.id)} className="pill-button-primary">
            Mark Delivered
          </button>
        ) : null}
      </div>
    </article>
  )
}

export default function ManagementDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [socket, setSocket] = useState(null)
  const [queue, setQueue] = useState({ newOrders: [], preparing: [], ready: [], completed: [] })
  const [stats, setStats] = useState({ totalOrders: 0, completedOrders: 0, avgPrepMinutes: 0, ordersPerHour: {} })
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user || user.role !== "manager") {
      navigate("/management-login", { replace: true })
      return
    }
  }, [user, navigate])

  useEffect(() => {
    const socketClient = io(BACKEND_URL)
    setSocket(socketClient)

    socketClient.on("connect", () => {
      console.log("Management socket connected")
    })

    socketClient.on("ordersUpdated", (queueData) => {
      setQueue(queueData)
    })

    socketClient.on("statsUpdated", (statsData) => {
      setStats(statsData)
    })

    socketClient.on("disconnect", () => {
      console.log("Management socket disconnected")
    })

    return () => {
      socketClient.disconnect()
    }
  }, [])

  useEffect(() => {
    async function loadQueue() {
      try {
        const response = await fetch(`${BACKEND_URL}/api/orders/queue`)
        const data = await response.json()
        setQueue(data)
      } catch (err) {
        setError("Unable to load queue. Please refresh.")
      }
    }

    async function loadStats() {
      try {
        const response = await fetch(`${BACKEND_URL}/api/stats`)
        const data = await response.json()
        setStats(data)
      } catch {
        // ignore
      }
    }

    loadQueue()
    loadStats()
  }, [])

  const nextAction = (order) => {
    if (order.status === "Queued") return { label: "Accept", endpoint: "accept" }
    if (order.status === "Preparing") return { label: "Mark Ready", endpoint: "ready" }
    if (order.status === "Ready") return { label: "Mark Delivered", endpoint: "delivered" }
    return null
  }

  async function updateOrder(orderId, endpoint) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/orders/${orderId}/${endpoint}`, { method: "POST" })
      if (!response.ok) throw new Error("Update failed")
      const data = await response.json()
      if (socket) {
        socket.emit("orderUpdated", data.order)
      }
    } catch (err) {
      setError("Unable to update order. Please retry.")
    }
  }

  const delayedCount = useMemo(() => {
    const all = [...queue.newOrders, ...queue.preparing, ...queue.ready]
    return all.filter((order) => order.elapsedMinutes > order.etaMinutes).length
  }, [queue])

  return (
    <main className="pb-20">
      <section className="section-wrap pt-6">
        <div className="glass-surface p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="brand-kicker">Management Dashboard</p>
              <h1 className="mt-2 text-4xl font-semibold text-nyota-forest dark:text-nyota-sand">
                Live order queue for the hotel team.
              </h1>
              <p className="mt-3 max-w-2xl font-sans-body text-sm leading-7 text-stone-600 dark:text-stone-300">
                Monitor guest orders in real time and move them through the queue from new to completed.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-700 dark:border-white/10 dark:bg-white/5 dark:text-stone-100">
                {user?.staffName}
              </div>
              <button
                type="button"
                onClick={logout}
                className="pill-button-secondary"
              >
                Logout
              </button>
            </div>
          </div>

          {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[28px] border border-stone-200 bg-white/90 p-5 dark:border-white/10 dark:bg-white/5">
              <p className="text-sm uppercase tracking-[0.24em] text-stone-500">Total Orders</p>
              <p className="mt-3 text-3xl font-semibold text-nyota-forest dark:text-nyota-sand">{stats.totalOrders}</p>
            </div>
            <div className="rounded-[28px] border border-stone-200 bg-white/90 p-5 dark:border-white/10 dark:bg-white/5">
              <p className="text-sm uppercase tracking-[0.24em] text-stone-500">Completed</p>
              <p className="mt-3 text-3xl font-semibold text-nyota-forest dark:text-nyota-sand">{stats.completedOrders}</p>
            </div>
            <div className="rounded-[28px] border border-stone-200 bg-white/90 p-5 dark:border-white/10 dark:bg-white/5">
              <p className="text-sm uppercase tracking-[0.24em] text-stone-500">Delayed orders</p>
              <p className="mt-3 text-3xl font-semibold text-rose-600">{delayedCount}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap mt-8">
        <SectionTitle eyebrow="Order queue" title="Manage guest orders in real time" copy="Accept new requests, move orders into preparation, mark them ready, and complete deliveries from a single staff view." />

        <div className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
          <div className="space-y-6">
            {[
              { label: "New Orders", items: queue.newOrders },
              { label: "In Preparation", items: queue.preparing },
              { label: "Ready for Delivery", items: queue.ready },
            ].map((section) => (
              <div key={section.label} className="glass-surface rounded-[32px] p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-nyota-forest dark:text-nyota-sand">{section.label}</h2>
                    <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{section.items.length} order(s)</p>
                  </div>
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700 dark:bg-white/10 dark:text-stone-300">FIFO queue</span>
                </div>

                {section.items.length === 0 ? (
                  <div className="mt-4 rounded-[24px] border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500 dark:border-white/10 dark:text-stone-400">
                    No orders in this section yet.
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    {section.items.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onAccept={() => updateOrder(order.id, "accept")}
                        onReady={() => updateOrder(order.id, "ready")}
                        onDelivered={() => updateOrder(order.id, "delivered")}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="glass-surface rounded-[32px] p-6">
              <h2 className="text-2xl font-semibold text-nyota-forest dark:text-nyota-sand">Completed Orders</h2>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{queue.completed.length} completed order(s)</p>

              {queue.completed.length === 0 ? (
                <div className="mt-4 rounded-[24px] border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500 dark:border-white/10 dark:text-stone-400">
                  No completed orders yet.
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {queue.completed.map((order) => (
                    <article key={order.id} className="rounded-[24px] border border-stone-200 bg-stone-50/90 p-4 dark:border-white/10 dark:bg-white/5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-nyota-forest dark:text-nyota-sand">#{order.orderNumber}</p>
                        <span className="rounded-full bg-stone-100 px-2 py-1 text-xs font-semibold text-stone-700">Completed</span>
                      </div>
                      <p className="mt-2 text-sm text-stone-500">{order.guestName}</p>
                      <p className="mt-1 text-sm text-stone-500">Elapsed: {order.elapsedMinutes}m</p>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="glass-surface rounded-[32px] p-6">
              <h2 className="text-2xl font-semibold text-nyota-forest dark:text-nyota-sand">Orders by hour</h2>
              <ul className="mt-4 space-y-3 text-sm text-stone-600 dark:text-stone-300">
                {Object.entries(stats.ordersPerHour).map(([hour, count]) => (
                  <li key={hour} className="flex items-center justify-between rounded-xl bg-stone-100 px-4 py-3 dark:bg-white/5">
                    <span>{formatTime(hour)}:00</span>
                    <strong>{count}</strong>
                  </li>
                ))}
                {!Object.keys(stats.ordersPerHour).length ? (
                  <li className="rounded-xl bg-stone-100 px-4 py-3 text-center text-sm text-stone-500 dark:bg-white/5">No order history yet.</li>
                ) : null}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
