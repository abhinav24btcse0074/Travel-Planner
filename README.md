# JourneyJoy — Travel Booking Platform

A full-featured MakeMyTrip-style travel booking website built with React + Vite (frontend) and Express 5 (backend).

All prices are in Indian Rupees (₹) with realistic Indian hotel chains, airlines, and destinations.

## Features

- **Flights** — Search, filter, sort, and book flights between Indian cities
- **Hotels** — Browse and book hotels with filters, image galleries, amenities, and reviews  
- **Holiday Packages** — Curated trip packages with itineraries and inclusions
- **Trains** — Search train routes with class/seat availability
- **Cabs** — Book cabs with popular city routes
- **Offers** — Browse active deals and discounts
- **My Bookings** — Dashboard showing all past and upcoming bookings

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, TailwindCSS v4, Framer Motion |
| Routing | Wouter |
| State/Data | TanStack React Query v5 |
| UI Components | shadcn/ui (Radix UI) |
| Backend | Express 5, Node.js |
| API Contract | OpenAPI 3.0 (Orval codegen) |
| Package Manager | pnpm (monorepo) |
| Type Safety | TypeScript, Zod |

## Prerequisites

- **Node.js** v20 or higher
- **pnpm** v9 or higher — install with `npm install -g pnpm`

## Setup & Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/journeyjoy.git
cd journeyjoy
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start development servers

Run both the API server and frontend together:

```bash
pnpm dev
```

This starts:
- **API server** on `http://localhost:8080`
- **Frontend** on `http://localhost:5173`

Open `http://localhost:5173` in your browser.

### Run individually

```bash
# API server only (port 8080)
pnpm dev:api

# Frontend only (port 5173, proxies /api → localhost:8080)
pnpm dev:web
```

## Environment Variables

Copy `.env.example` to `.env` (optional — all have defaults for local dev):

```bash
cp .env.example .env
```

| Variable | Default | Description |
|---|---|---|
| `API_PORT` | `8080` | Port for the Express API server |
| `PORT` | `5173` | Port for the Vite frontend dev server |
| `BASE_PATH` | `/` | Base URL path prefix for the frontend |

## Project Structure

```
journeyjoy/
├── artifacts/
│   ├── api-server/          # Express 5 backend
│   │   └── src/
│   │       ├── routes/      # API route handlers
│   │       │   ├── flights.ts
│   │       │   ├── hotels.ts
│   │       │   ├── bookings.ts
│   │       │   ├── holidays.ts
│   │       │   ├── offers.ts
│   │       │   └── destinations.ts
│   │       ├── app.ts
│   │       └── index.ts
│   └── makemytrip/          # React + Vite frontend
│       └── src/
│           ├── pages/       # Page components
│           │   ├── Home.tsx
│           │   ├── Flights.tsx
│           │   ├── FlightBooking.tsx
│           │   ├── Hotels.tsx
│           │   ├── HotelDetail.tsx
│           │   ├── BookingPage.tsx
│           │   ├── BookingConfirmation.tsx
│           │   ├── HolidayPackages.tsx
│           │   ├── TrainsPage.tsx
│           │   ├── CabsPage.tsx
│           │   ├── OffersPage.tsx
│           │   └── MyBookings.tsx
│           ├── components/  # Shared UI components
│           └── App.tsx      # Routes
├── lib/
│   ├── api-spec/            # OpenAPI spec + Orval config
│   │   └── openapi.yaml
│   ├── api-client-react/    # Generated React Query hooks
│   └── api-zod/             # Generated Zod validators
├── pnpm-workspace.yaml
└── package.json
```

## Regenerating the API Client

If you update `lib/api-spec/openapi.yaml`, regenerate the TypeScript client:

```bash
cd lib/api-spec
npx orval
```

## Notes

- All booking and hotel data is stored **in-memory** — it resets when the server restarts
- The backend includes sample pre-populated bookings for the "My Bookings" dashboard
- Images are sourced from Unsplash (public CDN, no API key required)
