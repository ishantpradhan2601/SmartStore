# SmartStore AI — Autonomous E-commerce Admin Assistant

SmartStore AI is a premium, full-stack, failure-tolerant admin assistant platform. Store owners can manage their catalogs with integrated AI text copywriting generators, tags compilation, social social captions, and business intelligence ledgers.

## 🎯 Technology Architecture
- **Frontend**: React (Vite) + Tailwind CSS v4 + Chart.js + Axios
- **Backend**: Node.js (Express) + MongoDB (Mongoose) + JWT + bcrypt + OpenAI SDK
- **AI Core**: OpenAI `gpt-4o` Chat completions wrapper with failsafe presets fallback system in case of missing keys.

---

## 🛠️ Rapid Deployment Setup

Follow these simple steps to spin up the local system.

### Prerequisites
- Node.js installed locally.
- MongoDB service running locally on default port `27017` (e.g. `mongodb://localhost:27017/smartstore`).

### Step 1: Initialize the API Backend
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd server
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Populate historical analytics and catalog items to MongoDB:
   ```bash
   npm run seed
   ```
4. Start the server (runs on `http://localhost:5000`):
   ```bash
   npm start
   ```

### Step 2: Spin Up the React Dashboard
1. Open a separate terminal and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Start the dev server (runs on `http://localhost:3000`):
   ```bash
   npm run dev
   ```

---

## 🔑 Demo Login Credentials
To bypass manual registrations, use this pre-seeded high-fidelity account containing pre-populated products and 90 days of transactions history!

- **Email**: `demo@smartstore.com`
- **Password**: `password123`

---

## 📂 Structural Layout

```
smartStore/
├── client/                 # React UI Client
│   ├── src/
│   │   ├── api/            # API interceptors
│   │   ├── components/     # StatCard, Modals, Loaders
│   │   ├── context/        # Auth global state provider
│   │   ├── layouts/        # Dashboard layout frame
│   │   └── pages/          # Login, Catalog, AI Generator, Analytics, Suggestions, Inventory
│   ├── index.html          # Web page head
│   └── vite.config.js      # Server proxy and Tailwind plugins
└── server/                 # Express API Server
    ├── config/             # DB settings
    ├── controllers/        # Product, Auth, AI, Analytics route logic
    ├── middleware/         # Auth guard, error catchers
    ├── models/             # Mongoose Schemas (User, Product, Sale)
    ├── routes/             # API Router definitions
    ├── seed.js             # 90-day simulation seeder
    └── server.js           # Server main file
```

## 🧠 Failsafe AI Presets Fallback
If you do not specify a valid `OPENAI_API_KEY` inside `server/.env`, the system automatically falls back to custom high-quality AI templates! You get the same aesthetic experience, smart tags parsing, and copy generation even without an active OpenAI subscription.
# SmartStore
