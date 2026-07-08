# Municipal Services Platform

A full-stack government services management system built with a modern, production-grade tech stack. Demonstrates end-to-end capability across backend APIs, web, mobile, and native desktop clients — all deployed and running live.

**Live demo:** [municipal-services-platform-production.up.railway.app](https://municipal-services-platform-production.up.railway.app)
**API docs (Swagger):** [web-production-24244.up.railway.app/api/docs](https://web-production-24244.up.railway.app/api/docs/)

Demo credentials: `admin1` / `Admin1234!`

---

## Why this project

Most portfolio projects stop at a CRUD app with one client. This one covers the full ecosystem a real municipal utility needs: a REST API, an admin web panel, a citizen-facing mobile app, and a native desktop app for cashiers — all sharing the same backend, all in production.

The domain logic is based on real-world billing and account management patterns from municipal water utility systems.

---

## Architecture

| Client | Stack | Purpose |
|---|---|---|
| **Backend API** | Django 5.2 · PostgreSQL · JWT | REST API with role-based access control |
| **Web Frontend** | React 19 · TypeScript · Tailwind | Full admin panel: users, billing, reports |
| **Mobile App** | React Native · Expo SDK 54 | Citizen portal: view invoices, account summary |
| **Desktop App** | Tauri · Rust · React | Cashier module (payments, receipts) + Admin module (cash reports, Excel export) |

All four clients consume the same Django REST API, secured with JWT and role-based permissions (`admin`, `operator`, `citizen`).

```
┌─────────────────────────────────────┐
│         Django REST API              │
│    JWT Auth · Role Permissions       │
└──────┬──────────────┬───────────────┘
       │              │
┌──────▼──────┐ ┌─────▼──────┐ ┌──────────────────┐
│  Web React  │ │ Mobile RN  │ │  Desktop Tauri    │
│  Admin      │ │ Citizen    │ │  Cashier + Admin  │
└─────────────┘ └────────────┘ └───────────────────┘
```

---

## Features

- **JWT authentication** with refresh tokens and blacklist on logout
- **Role-based permissions**: admin, operator (cashier), citizen
- **Billing engine**: invoices auto-update to "paid" when payments cover the total
- **Reports**: real-time dashboard, invoice reports, payment reports with filters
- **Desktop cashier flow**: search account → view pending invoices → register payment → auto-print PDF receipt
- **Desktop admin flow**: cash register cutoff by date/method, invoice reports, native Excel export via Tauri's file system plugin
- **Auto-generated API docs** with drf-spectacular (Swagger/OpenAPI)
- **CI-ready deployment** on Railway — push to `main`, auto-deploy

---

## Tech Stack

**Backend:** Python 3.12 · Django 5.2 · Django REST Framework · PostgreSQL 16 · SimpleJWT · drf-spectacular

**Web:** React 19 · TypeScript · Tailwind CSS · Axios · React Router

**Mobile:** React Native · Expo SDK 54 · React Navigation · AsyncStorage

**Desktop:** Tauri 2 · Rust · React · TypeScript · SheetJS (xlsx)

**Infra:** Docker (local Postgres) · Railway (production hosting) · GitHub

---

## Running locally

### Backend
```bash
git clone https://github.com/SinuheMB/municipal-services-platform.git
cd municipal-services-platform
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
docker compose up -d          # PostgreSQL
python manage.py migrate
python manage.py runserver
```

### Web frontend
```bash
cd frontend
npm install
npm run dev
```

### Mobile app
```bash
cd mobile
npm install
npx expo start
# scan the QR code with Expo Go
```

### Desktop app
```bash
cd desktop
npm install
npm run tauri dev
```

---

## Project structure

```
municipal-services-platform/
├── core/           # Django project settings
├── users/          # Custom user model with roles
├── services/       # Service catalog & accounts
├── billing/        # Invoices & payments
├── reports/        # Dashboard & reports API
├── frontend/       # React web admin panel
├── mobile/         # React Native citizen app
├── desktop/        # Tauri cashier & admin app
└── scripts/        # Demo data seeding
```

---

## Roadmap

- [ ] Thermal printer integration for desktop cashier module
- [ ] Offline mode with local SQLite sync for desktop
- [ ] SMS/WhatsApp payment reminders for citizens
- [ ] Multi-tenant support for multiple municipalities

---

## About

Built by [Sinuhé](https://github.com/SinuheMB) — Programmer Analyst with real-world experience in municipal billing systems, now building freelance tech solutions for government and business use cases in Latin America.

Open to freelance and contract work. Reach out via [LinkedIn](www.linkedin.com/in/sinuhe-medel-ba7589206) or [Upwork](#).
