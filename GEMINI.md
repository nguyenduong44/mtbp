# MTBP Project Documentation

## Project Overview
MTBP is a full-stack web application built with **React Router 7**, providing a public-facing portfolio/business site and a comprehensive admin dashboard. It leverages **Supabase** for database management, authentication, and file storage.

### Core Technologies
- **Framework:** [React Router 7](https://reactrouter.com/) (SSR mode)
- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS 4, Framer Motion (animations), Radix UI (accessible components)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (located in `components/ui/`)
- **Data Management:** TanStack Query (React Query) v5
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Build Tool:** Vite 7
- **Utilities:** Zod (validation), React Hook Form, Sharp (image processing), fluent-ffmpeg (video processing)

## Architecture
The project follows a modular architecture within the `app/` directory:

- `app/routes/`: Contains page components and API routes. Route definitions are centralized in `app/routes.ts`.
- `app/components/`:
  - Main components in the root of `components/` for the public site.
  - `admin/`: Specialized components for the admin dashboard.
- `app/services/`: Service layer for interacting with Supabase and other external APIs.
- `app/hooks/`: Custom React hooks, primarily wrapping TanStack Query for data fetching and mutations.
- `app/layouts/`: Shared layout components (`MainLayout`, `AdminLayout`).
- `app/types.ts`: Centralized TypeScript type definitions.
- `components/ui/`: Base UI components (shadcn/ui).
- `lib/`: Utility functions (e.g., `lib/utils.ts`).

### Path Aliases
The project uses the `@/` alias to refer to the project root.
- `@/app/*` -> `./app/*`
- `@/components/*` -> `./components/*`
- `@/lib/*` -> `./lib/*`

## Development Guide

### Building and Running
- **Install Dependencies:** `npm install`
- **Development Server:** `npm run dev` (starts Vite dev server with HMR)
- **Build for Production:** `npm run build`
- **Start Production Server:** `npm run start`
- **Type Checking:** `npm run typecheck`

### Key Commands & Scripts
- `react-router build`: Compiles the application for production.
- `react-router dev`: Starts the development environment.
- `react-router typegen`: Generates types for React Router features.

### Development Conventions
- **Data Fetching:** Always use the service layer in `app/services/` and wrap them in custom hooks in `app/hooks/` using TanStack Query.
- **Styling:** Use Tailwind CSS 4 utility classes. Prefer Framer Motion for complex animations.
- **Forms:** Use `react-hook-form` with `zod` for validation.
- **File Uploads:** Use the `uploadService` and the dedicated `/api/upload` endpoint for handling media.
- **Database:** Interacting with Supabase should be done through the `supabase` client exported from `app/supabase-client.ts`.

## Admin Dashboard
The admin section (`/admin`) allows managing:
- **Projects:** Complex entries with media sections, categories, and social links.
- **Clients & Industries:** Relational data for projects.
- **Categories:** For filtering projects.
- **Contacts:** Viewing submissions from the contact form.

## Deployment
- **Docker:** A `Dockerfile` and `.dockerignore` are provided for containerized deployment.
- **Vercel:** Configuration is present for Vercel deployment.
