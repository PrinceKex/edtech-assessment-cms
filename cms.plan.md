# Mini-CMS Development Plan

## Project Overview
Build a mini-CMS for managing blog articles with a hierarchical category system, featuring a rich text editor and table-based article management.

## Tech Stack
- **Frontend**: Remix + React, Tailwind CSS
- **Backend**: Remix server routes
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Deployment**: Vercel

## Development Phases

### 1. Project Setup
- [ ] Initialize Remix project with TypeScript
  ```bash
  npx create-remix@latest
  ```
- [ ] Add Tailwind CSS
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```
- [ ] Initialize Git repository
  ```bash
  git init
  git add .
  git commit -m "Initial commit: Project setup with Remix and Tailwind"
  ```

### 2. Database & Prisma Setup
- [ ] Install Prisma and dependencies
  ```bash
  npm install @prisma/client
  npm install -D prisma
  npx prisma init
  ```
- [ ] Set up Prisma schema with Article model
- [ ] Configure Supabase connection
  ```bash
  git add .
  git commit -m "Database: Set up Prisma with Supabase PostgreSQL"
  ```

### 3. Core Features Implementation

#### 3.1 Article Management (CRUD)
- [ ] Create API routes for articles
- [ ] Implement CRUD operations
  ```bash
  git add .
  git commit -m "Feat: Implement article CRUD operations"
  ```

#### 3.2 Table List View
- [ ] Build articles list component
- [ ] Add sorting and filtering
  ```bash
  git add .
  git commit -m "Feat: Add article table view with sorting and filtering"
  ```

#### 3.3 Editor Page
- [ ] Implement tree navigation
- [ ] Add collapsible categories
- [ ] Implement drag-and-drop (if feasible)
  ```bash
  git add .
  git commit -m "Feat: Add tree navigation for articles and categories"
  ```

#### 3.4 Rich Text Editor
- [ ] Integrate rich text editor (e.g., TipTap, Tiptap)
- [ ] Add markdown support
  ```bash
  git add .
  git commit -m "Feat: Integrate rich text editor with markdown support"
  ```

#### 3.5 Preview Functionality
- [ ] Add preview mode
- [ ] Style preview output
  ```bash
  git add .
  git commit -m "Feat: Add article preview functionality"
  ```

### 4. User Experience
- [ ] Add loading states
- [ ] Implement error handling
- [ ] Add form validation
  ```bash
  git add .
  git commit -m "UX: Add loading states, error handling, and form validation"
  ```

### 5. Authentication (Optional)
- [ ] Set up Supabase Auth
- [ ] Protect routes
  ```bash
  git add .
  git commit -m "Feat: Add authentication with Supabase"
  ```

### 6. Testing & Polish
- [ ] Write unit tests
- [ ] Test all features
- [ ] Fix bugs
  ```bash
  git add .
  git commit -m "Test: Add unit tests and fix bugs"
  ```

### 7. Deployment
- [ ] Configure for Vercel
- [ ] Set up environment variables
- [ ] Deploy
  ```bash
  git add .
  git commit -m "Deploy: Configure for Vercel deployment"
  git push origin main
  ```

## Development Notes
- After completing each task, run tests and verify functionality
- Commit after each significant change with descriptive messages
- Push to GitHub after each major feature is complete and tested
- Keep the main branch stable at all times
