# Overview

This is a full-stack domain booking application built with React (frontend) and Express.js (backend). The app allows users to check domain availability for .nc, .com, .net, and .org extensions and book domains with package selection. It features a modern interface using shadcn/ui components, Tailwind CSS styling, and implements a complete booking workflow with customer information collection.

## Recent Updates (January 2025)
- ✓ Integrated real domain availability checking via WhoisXML API 
- ✓ Added alternative extension suggestions when domains are unavailable
- ✓ Updated logo to use new Lagoon Business branding
- ✓ Professional French interface with complete booking workflow

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with two main pages (Home and Bookings)
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React Hook Form for form handling, TanStack Query for server state
- **Design System**: Professional domain booking platform aesthetic with orange primary color (#f06f2e), white backgrounds, and grey text variations

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful endpoints with API key authentication
- **Middleware**: CORS enabled for all origins, JSON body parsing, request logging
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Development**: Hot reload with Vite dev server integration

## Database Schema
- **ORM**: Drizzle ORM with SQLite for development (configured for PostgreSQL production)
- **Tables**: 
  - `packages`: Domain packages with pricing (id, name, description, price, extension)
  - `bookings`: Customer reservations (id, created_at, domain, package_id, customer details, status)
- **Relationships**: Foreign key from bookings.package_id to packages.id

## API Endpoints
- `GET /api/packages`: Returns all available domain packages
- `GET /api/check?domain=`: Checks domain availability using deterministic hash
- `POST /api/book`: Creates new domain booking with customer information
- `GET /api/bookings`: Lists all bookings from database
- **Authentication**: All endpoints require `Authorization: ApiKey YOUR_KEY_HERE` header

## Data Validation
- **Schema Validation**: Zod schemas for type safety and runtime validation
- **Form Validation**: React Hook Form with Zod resolvers for client-side validation
- **Database Types**: Generated TypeScript types from Drizzle schema

## Build and Deployment
- **Development**: Separate dev servers (Vite for frontend, Express for backend)
- **Production Build**: Vite builds frontend to dist/public, esbuild bundles backend
- **Database Migrations**: Drizzle Kit for schema management and migrations

# External Dependencies

## Core Technologies
- **Database**: SQLite (development), PostgreSQL (production via @neondatabase/serverless)
- **HTTP Client**: Native Fetch API for client-server communication
- **Session Storage**: connect-pg-simple for PostgreSQL session store

## UI and Styling
- **Component Library**: Radix UI primitives (@radix-ui/* packages)
- **Icons**: Lucide React for consistent iconography
- **Styling**: Tailwind CSS with PostCSS processing
- **Fonts**: Google Fonts integration (DM Sans, Geist Mono, etc.)

## Development Tools
- **Build Tools**: Vite, esbuild, TypeScript compiler
- **Code Quality**: ESLint configuration through Vite
- **Development**: Replit integration with cartographer plugin and runtime error modal
- **Database Tools**: Drizzle Kit for migrations and schema management

## Runtime Dependencies
- **Validation**: Zod for schema validation across frontend and backend
- **Forms**: React Hook Form with hookform resolvers
- **Utilities**: clsx, tailwind-merge for className manipulation
- **Date Handling**: date-fns for date formatting and manipulation