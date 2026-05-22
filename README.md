# SmartStore AI

SmartStore AI is a full-stack e-commerce admin dashboard for store owners who want inventory management, sales analytics, AI product copywriting, and automated business recommendations in one workspace.

The application includes a React dashboard, an Express API, MongoDB persistence, JWT authentication, seeded demo data, and OpenAI-powered product content generation with local fallback suggestions when no API key is configured.

## Repository Status

- Minimum required commits: 7
- Current repository commit count: 7+
- Main branch: `main`
- Remote: `https://github.com/ishantpradhan2601/SmartStore.git`

## Demo

### Demo Video

Add your project walkthrough video link here after uploading it to YouTube, Google Drive, or GitHub Releases:

```text
https://drive.google.com/file/d/1_HOVFMzOI8gICsLCdOheWeAFERVMZnp1/view?usp=sharing
```

Suggested video flow:

1. Register or log in with the seeded demo account.
2. Show dashboard revenue and recent sales activity.
3. Manage products from the product catalog.
4. Generate AI descriptions, SEO tags, and captions.
5. Review analytics charts and top products.
6. Show inventory alerts and AI business suggestions.
7. Open MongoDB Compass and show the `users`, `products`, and `sales` collections.

## Screenshots

The screenshots below document the main application screens and MongoDB collections used by SmartStore AI.

| Screen | Description |
| --- | --- |
| Dashboard | Store performance matrix with revenue, orders, stock count, low-stock count, top performers, and sales activity. |
| Products | Product catalog architecture with filtering, sorting, CRUD actions, pricing, stock, SKU, and status details. |
| AI Generator | AI creative copywriting studio for SEO descriptions, search tags, and marketing captions. |
| Analytics | Business intelligence ledgers with daily, weekly, and monthly revenue charts plus category share and top products. |
| AI Suggestions | Autonomous strategic advisor with pricing adaptations, market insights, and basket campaign ideas. |
| Inventory Alerts | Stock logistics grid with SKU quantities, health status, and restock actions. |
| MongoDB Users | `users` collection with demo owner/admin account documents. |
| MongoDB Products | `products` collection with seeded catalog items and AI-generated copy fields. |
| MongoDB Sales | `sales` collection with 75 seeded transaction ledger documents. |

### Dashboard

![Dashboard](docs/screenshots/dashboard.png)

### Product Catalog

![Product Catalog](docs/screenshots/products.png)

### AI Generator

![AI Generator](docs/screenshots/ai-generator.png)

### Analytics

![Analytics Weekly](docs/screenshots/analytics-weekly.png)

![Analytics Daily](docs/screenshots/analytics-daily.png)

### AI Suggestions

![AI Suggestions](docs/screenshots/ai-suggestions.png)

### Inventory Alerts

![Inventory Alerts](docs/screenshots/inventory-alerts.png)

### MongoDB Collections

![MongoDB Users Collection](docs/screenshots/db-users.png)

![MongoDB Products Collection](docs/screenshots/db-products.png)

![MongoDB Sales Collection](docs/screenshots/db-sales.png)

## Features

- Secure authentication with registration, login, JWT tokens, and protected dashboard routes.
- Product catalog management with create, read, update, delete, search, filter, stock, SKU, status, pricing, and category fields.
- AI product copywriting for SEO descriptions, search tags, and marketing captions.
- Business analytics dashboards for revenue, total transactions, category sales share, top products, and recent sale activity.
- Inventory alert dashboard for low stock and stock health monitoring.
- Strategic AI suggestion board for pricing, trends, cross-selling, and campaign recommendations.
- MongoDB seed script with demo products, demo user, and 90-day sales simulation.
- OpenAI integration with fallback preset content so the app still works without an API key.

## Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS 4
- React Router
- Axios
- React Icons

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- OpenAI SDK


## System Architecture

SmartStore AI uses a React and Vite frontend connected to an Express REST API. Protected dashboard pages call authenticated backend routes, while the backend coordinates JWT middleware, MongoDB/Mongoose models, analytics controllers, and OpenAI-powered AI routes.

![SmartStore AI System Architecture](docs/screenshots/system-architecture.png)

## Project Structure

```text
smartStore/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed.js
│   ├── server.js
│   └── package.json
├── package.json
└── README.md
```

## Database Schema

Database name:

```text
smartstore
```

Collections:

- `users`
- `products`
- `sales`

### User Schema

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | String | Yes | Store owner or manager name. |
| `email` | String | Yes | Unique, lowercased login email. |
| `password` | String | Yes | Hashed with bcrypt before save. Minimum length: 6. |
| `storeName` | String | No | Defaults to `My Store`. |
| `role` | String | No | Enum: `admin`, `manager`. Defaults to `admin`. |
| `createdAt` | Date | No | Defaults to current date. |

### Product Schema

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `user` | ObjectId | Yes | References `User`. |
| `name` | String | Yes | Product title. |
| `description` | String | No | Product description. |
| `category` | String | Yes | Enum category such as `Electronics`, `Beauty`, `Sports`, etc. |
| `price` | Number | Yes | Selling price. Cannot be negative. |
| `costPrice` | Number | No | Defaults to `0`. |
| `stock` | Number | Yes | Units available. Cannot be negative. |
| `sku` | String | No | Unique sparse SKU. |
| `images` | String array | No | Product image URLs or paths. |
| `status` | String | No | Enum: `active`, `draft`, `archived`. |
| `aiDescription` | String | No | Generated AI product copy. |
| `aiTags` | String array | No | Generated SEO/search tags. |
| `aiCaption` | String | No | Generated marketing caption. |
| `createdAt` | Date | No | Defaults to current date. |
| `updatedAt` | Date | No | Updated before save. |

Virtual fields:

- `profit`: `price - costPrice`
- `isLowStock`: `stock < 10`

### Sale Schema

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `user` | ObjectId | Yes | References `User`. |
| `product` | ObjectId | Yes | References `Product`. |
| `productName` | String | Yes | Snapshot of product name at sale time. |
| `quantity` | Number | Yes | Minimum value: `1`. |
| `unitPrice` | Number | Yes | Product unit price at sale time. |
| `totalAmount` | Number | Yes | `quantity * unitPrice`. |
| `channel` | String | No | Enum: `online`, `in-store`, `marketplace`. |
| `date` | Date | No | Defaults to current date. |

## Entity Relationship Overview

```text
User
  ├── has many Products
  └── has many Sales

Product
  ├── belongs to User
  └── has many Sales

Sale
  ├── belongs to User
  └── belongs to Product
```

## API Routes

Base URL in development:

```text
http://localhost:5000/api
```

### Auth

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Create a new user account. |
| POST | `/auth/login` | Public | Log in and receive JWT token. |
| GET | `/auth/me` | Private | Return the logged-in user profile. |

### Products

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/products` | Private | Get products for the logged-in user. |
| POST | `/products` | Private | Create a product. |
| GET | `/products/:id` | Private | Get one product. |
| PUT | `/products/:id` | Private | Update a product. |
| DELETE | `/products/:id` | Private | Delete a product. |

### AI

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/ai/description` | Private | Generate SEO product description. |
| POST | `/ai/tags` | Private | Generate search tags. |
| POST | `/ai/caption` | Private | Generate marketing caption. |
| POST | `/ai/suggestions` | Private | Generate strategic store suggestions. |

### Analytics

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/analytics/revenue` | Private | Revenue timeline data. |
| GET | `/analytics/top-products` | Private | Ranked products by revenue. |
| GET | `/analytics/summary` | Private | Store summary metrics. |
| GET | `/analytics/inventory-alerts` | Private | Low-stock and inventory alert data. |

### Health Check

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/health` | Public | API health and environment status. |

## Environment Variables

### Server

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smartstore
JWT_SECRET=smartstore_jwt_secret_key_2024
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
```

For deployment, use MongoDB Atlas instead of localhost:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smartstore
```

### Client

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

For deployment:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

## Local Setup

### Prerequisites

- Node.js
- npm
- MongoDB running locally or MongoDB Atlas
- MongoDB Compass for database inspection

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Configure Backend Environment

Create `server/.env` using the values from `server/.env.example`.

### 3. Seed Database

```bash
npm run seed
```

This creates:

- Demo user account
- Product catalog
- Sales transaction history

### 4. Start Backend

```bash
npm start
```

Backend runs on:

```text
http://localhost:5000
```

### 5. Install Frontend Dependencies

Open a second terminal:

```bash
cd client
npm install
```

### 6. Configure Frontend Environment

Create `client/.env` using the values from `client/.env.example`.

### 7. Start Frontend

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

## Demo Credentials

```text
Email: demo@smartstore.com
Password: password123
```

## Build Test

Frontend production build:

```bash
cd client
npm run build
```

Expected output:

```text
dist/index.html
dist/assets/*.css
dist/assets/*.js
```

## Deployment Guide

Recommended setup:

- Frontend: Vercel or Netlify
- Backend: Render
- Database: MongoDB Atlas

### Backend on Render

Create a Render Web Service:

```text
Root Directory: server
Build Command: npm install
Start Command: npm start
Health Check Path: /api/health
```

Environment variables:

```env
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=use_a_long_random_secret
OPENAI_API_KEY=optional
```

### Frontend on Vercel

Create a Vercel project:

```text
Root Directory: client
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

Environment variable:

```env
VITE_API_URL=https://your-render-api-url.onrender.com/api
```


## Author

Ishant Pradhan

GitHub: `ishantpradhan2601`
