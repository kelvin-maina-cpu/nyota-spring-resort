# Nyota Backend

This folder contains the backend API for the Nyota dining and order queue system.

## Setup

1. Open a terminal in `backend/`
2. Run `npm install`
3. Run `npm start` or `npm run dev`

## API Endpoints

- `GET /api/menu` — Fetch the dining menu
- `GET /api/orders` — Get all orders
- `GET /api/orders/queue` — Get grouped order queues
- `POST /api/orders` — Place a new order
- `POST /api/orders/:orderId/accept` — Move order to "Preparing"
- `POST /api/orders/:orderId/ready` — Move order to "Ready"
- `POST /api/orders/:orderId/delivered` — Move order to "Completed"
- `GET /api/stats` — Get basic order queue analytics

## Real-time

Socket.IO events are broadcast from the server:

- `ordersUpdated` — current queue state
- `statsUpdated` — updated metrics
- `newOrder` — newly placed order
- `orderUpdated` — individual order status update

Clients can connect to the backend on `http://localhost:4000`.
