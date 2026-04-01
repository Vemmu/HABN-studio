# HABN Studio Salon Website

A full-featured salon website for **HABN Studio** (Maddilapalem, Visakhapatnam) built with Next.js, PostgreSQL, and Prisma.

## Features

- **Public Pages**: Home, Services, Booking, Gallery, Reviews, Contact
- **Appointment Booking**: Select service, date, time slot, and book
- **Admin Panel**: Manage services, appointments, gallery, reviews
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Tech Stack

- **Frontend/Backend**: Next.js 14 (App Router)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

Create a PostgreSQL database and add the connection URL to `.env`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/habn_studio?schema=public"
```

### 3. Initialize Database

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin Panel

- **URL**: `/admin`
- **Default Admin**: `admin@habnstudio.com` / `admin123` (for NextAuth when configured)

Admin sections:
- **Dashboard**: Overview of services, appointments, gallery, reviews
- **Services**: Add, edit, delete services
- **Appointments**: View and confirm/cancel appointments
- **Gallery**: Add images (Cloudinary URLs)
- **Reviews**: Manage customer reviews

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | List services |
| POST | `/api/services` | Create service |
| PATCH | `/api/services/[id]` | Update service |
| DELETE | `/api/services/[id]` | Delete service |
| GET | `/api/appointments` | List appointments |
| POST | `/api/appointments` | Create appointment |
| PATCH | `/api/appointments/[id]` | Update appointment status |
| GET | `/api/reviews` | List reviews |
| POST | `/api/reviews` | Create review |
| DELETE | `/api/reviews/[id]` | Delete review |
| GET | `/api/gallery` | List gallery images |
| POST | `/api/gallery` | Add image |
| DELETE | `/api/gallery/[id]` | Delete image |

## Deployment

- **Frontend**: Vercel
- **Database**: Neon, Supabase, or AWS RDS (PostgreSQL)

Set `DATABASE_URL` in your deployment environment.

## Future Enhancements

- NextAuth for admin login
- WhatsApp OTP verification
- Cloudinary image upload
- Online payment integration
- Staff management
- Loyalty program


this is for cloudflare tunnel to test the whatsapp messages:
npx.cmd cloudflared tunnel --url http://localhost:3000