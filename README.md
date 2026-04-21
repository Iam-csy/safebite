# 🛡️ SafeBite AI — Food Hygiene & Safety Monitoring Platform

> **"Eat with Confidence"** — AI-powered platform for restaurants, customers & health inspectors.

---

## 🗂️ Project Structure

```
safebite-ai/
├── backend/                  # Node.js + Express MVC Backend
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── businessController.js
│   │   ├── hygieneController.js
│   │   ├── complaintController.js
│   │   ├── reviewController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js           # protect + authorize(roles)
│   │   ├── upload.js         # Multer image uploads
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Business.js
│   │   ├── HygieneReport.js
│   │   ├── Complaint.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── businessRoutes.js
│   │   ├── hygieneRoutes.js
│   │   ├── complaintRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   ├── auth.js           # HMAC-SHA256 token (no JWT)
│   │   └── hygieneCalculator.js
│   ├── uploads/              # Uploaded images (auto-created)
│   ├── seed.js               # Demo data seeder
│   ├── server.js             # Entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/                 # React + Vite + Tailwind CSS
    └── src/
        ├── components/
        │   └── common/
        │       ├── Navbar.jsx
        │       ├── Footer.jsx
        │       ├── BusinessCard.jsx
        │       ├── HygieneScoreBadge.jsx
        │       ├── ScoreTrendChart.jsx
        │       ├── StatCard.jsx
        │       ├── ImageUploader.jsx
        │       ├── LoadingSpinner.jsx
        │       └── AlertBanner.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── LandingPage.jsx
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── SearchPage.jsx
        │   ├── BusinessProfilePage.jsx
        │   ├── QRPublicPage.jsx
        │   ├── LeaderboardPage.jsx
        │   ├── FreshnessCheckerPage.jsx
        │   ├── ComplaintPage.jsx
        │   ├── CustomerDashboard.jsx
        │   ├── OwnerDashboard.jsx
        │   ├── OwnerScannerPage.jsx
        │   ├── OwnerChecklistPage.jsx
        │   ├── OwnerTemperaturePage.jsx
        │   ├── RegisterBusinessPage.jsx
        │   ├── AdminDashboard.jsx
        │   ├── AdminBusinessesPage.jsx
        │   └── AdminComplaintsPage.jsx
        ├── utils/
        │   └── api.js        # Axios instance
        ├── App.jsx
        ├── main.jsx
        └── index.css
```

---

## ⚡ Quick Setup (Local Development)

### Prerequisites
- Node.js v18+
- MongoDB (local) or MongoDB Atlas (cloud)

---

### 1. Clone & Install

```bash
# Backend
cd safebite-ai/backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### 2. Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/safebite
CRYPTO_SECRET=your_super_secret_key_at_least_32_chars_long!!
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

### 3. Seed Demo Data

```bash
cd backend
node seed.js
```

This creates:
- 👤 `customer@demo.com` / `demo123`
- 🏪 `owner@demo.com` / `demo123`
- ⚙️ `admin@demo.com` / `demo123`
- 5 demo restaurants in Prayagraj with scores, badges, and QR codes

---

### 4. Start Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# → http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev
# → http://localhost:5173
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/me` | Private | Get current user |
| PUT | `/api/auth/profile` | Private | Update profile |

### Businesses
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/businesses` | Public | Search/filter businesses |
| GET | `/api/businesses/leaderboard` | Public | Top 10 hygiene scores |
| GET | `/api/businesses/:id` | Public | Business profile + reviews |
| POST | `/api/businesses` | Owner | Register business |
| PUT | `/api/businesses/:id` | Owner | Update business |
| GET | `/api/businesses/my/business` | Owner | Get own business |
| PUT | `/api/businesses/:id/checklist` | Owner | Update daily checklist |
| GET | `/api/businesses/:id/temperature` | Owner/Admin | Mock temp readings |

### Hygiene
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/hygiene/scan/:businessId` | Owner/Admin | AI kitchen scan |
| POST | `/api/hygiene/freshness` | Private | Food freshness check |
| GET | `/api/hygiene/reports/:businessId` | Private | Scan history |
| GET | `/api/hygiene/trend/:businessId` | Private | Score trend for charts |

### Complaints
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/complaints` | Customer | Submit complaint |
| GET | `/api/complaints/my` | Customer | My complaints |
| GET | `/api/complaints/admin` | Admin | All complaints |
| PUT | `/api/complaints/:id/status` | Admin | Update status |

### Reviews & Admin
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/reviews` | Customer | Add review |
| GET | `/api/reviews/:businessId` | Public | Get reviews |
| GET | `/api/admin/stats` | Admin | Dashboard stats |
| GET | `/api/admin/businesses` | Admin | All businesses |
| PUT | `/api/admin/businesses/:id/verify` | Admin | Verify + set inspection score |
| GET | `/api/admin/risky` | Admin | Businesses with score < 50 |

---

## 🔐 Authentication

Uses **custom HMAC-SHA256 token auth** (no JWT library):

```
Token format: base64url(payload).HMAC-SHA256(payload, secret)
```

- `timingSafeEqual` prevents timing attacks
- 7-day expiry built into payload timestamp
- Send as: `Authorization: Bearer <token>`

---

## 🏅 Hygiene Score Formula

```
Score = (Cleanliness × 30%) + (Food Storage × 25%) + 
        (Staff Hygiene × 20%) + (Customer Reports × 15%) + 
        (Inspection × 10%)
```

| Score | Badge |
|-------|-------|
| 85–100 | 🥇 Gold Safe |
| 65–84 | 🥈 Silver Safe |
| 0–64 | ⚠️ Needs Improvement |

---

## 🚀 Production Deployment

### Backend (Railway / Render)
```bash
# Set environment variables on the platform:
MONGODB_URI=your_atlas_uri
CRYPTO_SECRET=your_production_secret
CLIENT_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
# Set env variable:
VITE_API_URL=https://your-backend.railway.app
```

Update `vite.config.js` proxy → update `api.js` baseURL to use `VITE_API_URL`.

---

## 🎯 Demo Flow

1. **Customer** visits `/search` → finds restaurants by hygiene score
2. **Customer** scans QR at restaurant → sees trust badge at `/qr/:id`
3. **Owner** logs in → registers business → gets QR code
4. **Owner** uploads kitchen photo → AI gives hygiene score + suggestions
5. **Owner** updates daily checklist → score recalculates
6. **Admin** logs in → verifies businesses → reviews complaints
7. **Customer** reports issue → admin receives and resolves it

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js, MVC Pattern |
| Database | MongoDB, Mongoose |
| Auth | Custom HMAC-SHA256 (crypto module), bcryptjs |
| File Upload | Multer |
| QR Code | qrcode npm package |
| Charts | Recharts (LineChart) |

---

*Built for SafeBite AI Hackathon — Eat with Confidence 🛡️*
