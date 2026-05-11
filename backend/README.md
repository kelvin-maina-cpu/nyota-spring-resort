# Nyota Backend

This folder contains the backend API for the Nyota dining and order queue system.

## Setup

1. Open a terminal in `backend/`
2. Run `npm install`
3. Copy `.env.example` to `.env` if you want to customize local environment variables
4. Run `npm start` or `npm run dev`

## Environment Variables

- `PORT` - Port used by the server locally. Render injects this automatically in production.
- `ALLOWED_ORIGINS` - Comma-separated list of frontend origins allowed to call the API and connect via Socket.IO.
- `NODE_ENV` - Optional environment mode indicator.

Example:

```env
PORT=4000
ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend.onrender.com
NODE_ENV=production
```

## Render Deployment

This repo includes a root `render.yaml` blueprint for the backend service.

Recommended Render settings:

1. Create a new Web Service from this repository, or use the blueprint.
2. Confirm the service root directory is `backend`.
3. Set `ALLOWED_ORIGINS` to your deployed frontend URL, for example `https://your-frontend.onrender.com`.
4. Render will provide `PORT` automatically.

Health checks:

- `GET /health`
- `GET /api/health`

## API Endpoints

- `GET /api/menu` - Fetch the dining menu
- `GET /api/orders` - Get all orders
- `GET /api/orders/queue` - Get grouped order queues
- `POST /api/orders` - Place a new order
- `POST /api/orders/:orderId/accept` - Move order to "Preparing"
- `POST /api/orders/:orderId/ready` - Move order to "Ready"
- `POST /api/orders/:orderId/delivered` - Move order to "Completed"
- `GET /api/stats` - Get basic order queue analytics

## Real-time

Socket.IO events are broadcast from the server:

- `ordersUpdated` - current queue state
- `statsUpdated` - updated metrics
- `newOrder` - newly placed order
- `orderUpdated` - individual order status update

Clients can connect locally on `http://localhost:4000`, or on your Render service URL after deployment.
