import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"
import { menuItems, orderStatuses } from "./menuData.js"

const app = express()
const port = process.env.PORT || 4000
const defaultOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "https://nyota-spring-resort.vercel.app",
]
const configuredOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
  : []
const allowedOrigins = [...new Set([...defaultOrigins, ...configuredOrigins])]
const server = http.createServer(app)
const corsOptions = {
  origin(origin, callback) {
    if (allowedOrigins.includes("*")) {
      return callback(null, true)
    }

    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error("Origin not allowed by CORS"))
  },
  methods: ["GET", "POST"],
}
const io = new Server(server, {
  cors: corsOptions,
})

app.set("trust proxy", 1)
app.use(cors(corsOptions))
app.use(express.json())

const orders = []

function createOrderId() {
  return `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function getEstimatedPrepMinutes(items) {
  const mealWaits = items.map((item) => item.waitMinutes || 15)
  return Math.max(...mealWaits, 12)
}

function formatOrderForResponse(order) {
  return {
    ...order,
    elapsedMinutes: Math.max(0, Math.floor((Date.now() - new Date(order.placedAt).getTime()) / 60000)),
    remainingMinutes: Math.max(0, order.etaMinutes - Math.floor((Date.now() - new Date(order.placedAt).getTime()) / 60000)),
  }
}

function getQueue() {
  return {
    newOrders: orders.filter((order) => order.status === orderStatuses.QUEUED).map(formatOrderForResponse),
    preparing: orders.filter((order) => order.status === orderStatuses.PREPARING).map(formatOrderForResponse),
    ready: orders.filter((order) => order.status === orderStatuses.READY).map(formatOrderForResponse),
    completed: orders.filter((order) => order.status === orderStatuses.COMPLETED).map(formatOrderForResponse),
  }
}

function getStats() {
  const totalOrders = orders.length
  const completedOrders = orders.filter((order) => order.status === orderStatuses.COMPLETED)
  const avgPrep = completedOrders.length
    ? Math.round(completedOrders.reduce((sum, order) => sum + order.etaMinutes, 0) / completedOrders.length)
    : 0

  const ordersPerHour = orders.reduce((acc, order) => {
    const hour = new Date(order.placedAt).getHours()
    acc[hour] = (acc[hour] || 0) + 1
    return acc
  }, {})

  return {
    totalOrders,
    completedOrders: completedOrders.length,
    avgPrepMinutes: avgPrep,
    ordersPerHour,
  }
}

function emitOrderUpdate() {
  const queue = getQueue()
  io.emit("ordersUpdated", queue)
  io.emit("statsUpdated", getStats())
}

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`)
  socket.emit("menuUpdated", menuItems)
  socket.emit("ordersUpdated", getQueue())
  socket.emit("statsUpdated", getStats())

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`)
  })
})

app.get("/", (req, res) => {
  res.json({
    service: "nyota-backend",
    status: "ok",
    message: "Nyota backend is running.",
  })
})

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
})

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
})

app.get("/api/menu", (req, res) => {
  res.json({ menu: menuItems })
})

app.get("/api/orders", (req, res) => {
  res.json({ orders: orders.map(formatOrderForResponse) })
})

app.get("/api/orders/queue", (req, res) => {
  res.json(getQueue())
})

app.post("/api/orders", (req, res) => {
  const { items, guestName, userId, vip = false } = req.body

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Order must include at least one menu item." })
  }

  let orderItems

  try {
    orderItems = items.map((item) => {
      const menuItem = menuItems.find((menu) => menu.id === item.id)
      if (!menuItem) {
        throw new Error(`Menu item not found: ${item.id}`)
      }

      return {
        ...menuItem,
        quantity: item.quantity || 1,
        note: item.note || "",
      }
    })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const etaMinutes = getEstimatedPrepMinutes(orderItems)
  const orderId = createOrderId()
  const placedAt = new Date().toISOString()

  const order = {
    id: orderId,
    orderNumber: orders.length + 1001,
    guestName: guestName || "Guest",
    guestId: userId || null,
    vip: Boolean(vip),
    items: orderItems,
    totalPrice,
    etaMinutes,
    status: orderStatuses.QUEUED,
    placedAt,
    statusHistory: [
      {
        status: orderStatuses.QUEUED,
        time: placedAt,
      },
    ],
  }

  orders.push(order)
  emitOrderUpdate()
  io.emit("newOrder", formatOrderForResponse(order))

  res.status(201).json({ order: formatOrderForResponse(order) })
})

function findOrder(orderId) {
  return orders.find((order) => order.id === orderId)
}

function updateOrderStatus(orderId, nextStatus) {
  const order = findOrder(orderId)
  if (!order) return null

  if (order.status === orderStatuses.COMPLETED) return order

  order.status = nextStatus
  order.statusHistory.push({ status: nextStatus, time: new Date().toISOString() })
  return order
}

app.post("/api/orders/:orderId/accept", (req, res) => {
  const order = updateOrderStatus(req.params.orderId, orderStatuses.PREPARING)
  if (!order) return res.status(404).json({ error: "Order not found." })
  emitOrderUpdate()
  io.emit("orderUpdated", formatOrderForResponse(order))
  res.json({ order: formatOrderForResponse(order) })
})

app.post("/api/orders/:orderId/ready", (req, res) => {
  const order = updateOrderStatus(req.params.orderId, orderStatuses.READY)
  if (!order) return res.status(404).json({ error: "Order not found." })
  emitOrderUpdate()
  io.emit("orderUpdated", formatOrderForResponse(order))
  res.json({ order: formatOrderForResponse(order) })
})

app.post("/api/orders/:orderId/delivered", (req, res) => {
  const order = updateOrderStatus(req.params.orderId, orderStatuses.COMPLETED)
  if (!order) return res.status(404).json({ error: "Order not found." })
  emitOrderUpdate()
  io.emit("orderUpdated", formatOrderForResponse(order))
  res.json({ order: formatOrderForResponse(order) })
})

app.get("/api/stats", (req, res) => {
  res.json(getStats())
})

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found." })
})

server.listen(port, () => {
  const publicUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${port}`
  console.log(`Nyota backend running on ${publicUrl}`)
  console.log(`Allowed origins: ${allowedOrigins.join(", ")}`)
})
