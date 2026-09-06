# Dinely SaaS

A full-stack restaurant management SaaS platform built with Next.js 14, Supabase, and Jjuma. Restaurant owners can manage menus, orders, bookings, employees, tables, and clients through a professional dashboard - while customers can browse restaurants, place orders, and make reservations.

## Features

### Restaurant Owner Dashboard
- **Dashboard** - Revenue, orders, customers, and analytics with interactive charts (Recharts)
- **Menu Management** - Full CRUD for menu items with categories, images, pricing, and availability toggle
- **Orders** - Real-time order tracking with status workflow (Pending → Active → Completed / Cancelled)
- **Bookings** - Table reservations and food booking management with floor plan view
- **Tables** - Create, edit, and toggle table status (Available / Occupied / Reserved / Inactive)
- **Clients** - Customer profiles with order history, spending stats, and search
- **Employees** - Staff management with roles, salaries, and contact info
- **My Restaurant** - Editable restaurant profile with cover image, hours, and description
- **Settings** - Owner details, restaurant info, billing, notifications, and integrations

### Customer-Facing App
- **Restaurant browsing** with search and category filters
- **Menu viewing** with item details and reviews
- **Shopping cart** with checkout flow
- **Order placement** (Delivery / Takeaway / Dine-in)
- **Favourites** for saved restaurants
- **Profile management**

### Authentication & Security
- JWT-based auth with `httpOnly` cookies (7-day expiry)
- Role-based access control (Owner vs Customer)
- Middleware-protected routes for dashboard and customer app
- Password hashing with bcrypt (12 rounds)
- Zod schema validation on all inputs

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | JWT (jose) + bcryptjs |
| State | Zustand (persisted onboarding) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Payments | Jjuma |
| Icons | Lucide React |
| Animations | Framer Motion |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- (Optional) A [Jjuma](https://jjuma.com) account for payments

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd dinely-saas
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Auth
JWT_SECRET=your-secret-key-min-32-characters-long

# Jjuma payments (required for subscriptions + online order checkout)
# Get these from your JJuma merchant dashboard
JJUMA_API_BASE_URL=https://api.jjuma.com
JJUMA_PUBLIC_API_KEY=bp_live_pub_your_public_key
JJUMA_SECRET_API_KEY=bp_live_sec_your_secret_key
JJUMA_WEBHOOK_SECRET=your_webhook_secret
JJUMA_CHECKOUT_HOST=pay.jjuma.com
# Optional: USD→RWF rate used when charging JJuma (catalog prices are USD)
JJUMA_RWF_PER_USD=1350

# App (used for payment redirects + webhook URL registered with JJuma)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

Run the SQL in `supabase/migration.sql` in the Supabase SQL Editor (fresh projects).

If the project already exists, also run `supabase/add_payments.sql` to add the payments table and order payment columns.

Set your production webhook URL in the JJuma dashboard to:

`https://your-domain.com/api/payments/webhook`

### Payments overview

| Flow | How it works |
|------|----------------|
| Owner subscription | Onboarding creates the restaurant, then redirects to JJuma. A signed webhook activates `subscription_status`. |
| Customer order (online) | Order is created unpaid → redirect to JJuma → webhook marks the order paid. |
| Customer order (cash) | Order is created unpaid (COD). Marked paid when the restaurant completes it. |

Redirects are **not** confirmation — the webhook is the source of truth.
### 4. Seed Data (Optional)

```bash
npm run seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Login, register, forgot password
│   ├── (customer)/          # Customer-facing pages (home, restaurants, cart, orders)
│   ├── (marketing)/         # Landing page
│   ├── api/                 # API routes (auth, orders, menu, bookings, etc.)
│   ├── dashboard/           # Owner dashboard
│   │   ├── bookings/        # Table & food bookings
│   │   ├── clients/         # Customer management
│   │   ├── employees/       # Staff management
│   │   ├── menu/            # Menu CRUD with detail view
│   │   ├── my-restaurant/   # Restaurant profile editor
│   │   ├── orders/          # Order tracking with detail view
│   │   ├── settings/        # Account & restaurant settings
│   │   └── tables/          # Table management
│   └── onboarding/          # 4-step onboarding flow
├── components/
│   ├── brand/               # Logo, brand assets
│   ├── customer/            # Customer app components
│   ├── dashboard/           # Dashboard components
│   │   ├── bookings/        # Floor plan, reservation list
│   │   ├── menu/            # Menu grid, filters, detail view
│   │   └── *.tsx            # Charts, tables, cards, modals
│   ├── landing/             # Marketing/landing page components
│   ├── onboarding/          # Onboarding step components
│   └── ui/                  # Shared UI (Button, Input, Toggle, etc.)
├── hooks/                   # Custom hooks (useAuth, useRestaurant, etc.)
├── lib/
│   ├── api.ts               # Typed API client wrappers
│   ├── auth.ts              # JWT + password utilities
│   ├── dashboard/           # Nav config, mock data
│   ├── supabase.ts          # Supabase client
│   └── validators.ts        # Zod schemas
├── store/                   # Zustand stores (onboarding, cart, UI)
└── middleware.ts             # Route protection (auth, roles)
```

## API Endpoints

All endpoints are under `/api` and return JSON.

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/auth` | GET, POST, PUT | User registration, login, logout, profile update |
| `/api/restaurants` | GET, POST, PATCH, DELETE | Restaurant CRUD, search, filter |
| `/api/menu` | GET, POST, PATCH, DELETE | Menu item CRUD |
| `/api/orders` | GET, POST, PATCH | Order CRUD, status updates |
| `/api/bookings` | GET, POST, PATCH, DELETE | Booking CRUD |
| `/api/tables` | GET, POST, PATCH, DELETE | Table CRUD |
| `/api/employees` | GET, POST, PATCH, DELETE | Employee CRUD |
| `/api/clients` | GET | Client list and detail |
| `/api/reviews` | GET, POST, PATCH, DELETE | Review CRUD |
| `/api/analytics` | GET | Dashboard analytics (7d/30d/90d) |
| `/api/favourites` | GET, POST, DELETE | User favourites |
| `/api/payments` | POST | Owner subscription checkout (JJuma) |
| `/api/payments/webhook` | POST | Signed JJuma webhooks (source of truth) |
| `/api/upload` | POST | File upload (image) |

## Onboarding Flow

1. **Step 1 - Owner Info** - Name, email, phone, password → account created
2. **Step 2 - Restaurant Info** - Name, cuisine, address, hours, phone, email, description, logo
3. **Step 3 - Plan Selection** - Starter ($9/mo), Professional ($14/mo), Enterprise ($20/mo) with yearly discounts
4. **Step 4 - Payment** - Redirect to Jjuma checkout → webhook activates subscription

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed database with sample data |

## License

Private project. All rights reserved.
