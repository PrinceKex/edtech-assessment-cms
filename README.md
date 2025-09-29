# EdTech Assessment CMS

A modern content management system for managing educational content, built with Remix, React, TypeScript, and Tailwind CSS.

## Prerequisites

- Node.js (v18 or later)
- npm (v9 or later) or yarn
- PostgreSQL (for database)
- Supabase account (for authentication)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd edtech-assessment-cms
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   # For local development
   DIRECT_URL="postgresql://postgres:postgres@localhost:5432/edtech_cms?schema=public"
   
   # For production (if using Supabase)
   # DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   
   # Session and authentication
   SESSION_SECRET="your-session-secret"
   
   # Supabase configuration (if using Supabase)
   SUPABASE_URL="your-supabase-url"
   SUPABASE_ANON_KEY="your-supabase-anon-key"
   ```
   
   Replace the placeholders with your actual database credentials and Supabase details.

4. **Set up the database**
   Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. **Seed initial data** (optional)
   ```bash
   npx prisma db seed
   ```

## Running the Application

### Development Mode
```bash
# Start the development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
# Build the application
npm run build
# or
yarn build

# Start the production server
npm start
# or
yarn start
```

## Available Scripts

- `dev` - Start the development server
- `build` - Create a production build
- `start` - Start the production server
- `lint` - Run ESLint
- `format` - Format code with Prettier
- `typecheck` - Run TypeScript type checking
- `test` - Run tests

## Tech Stack

- [Remix](https://remix.run/) - Full-stack web framework
- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Supabase](https://supabase.com/) - Authentication and database
- [PostgreSQL](https://www.postgresql.org/) - Database
