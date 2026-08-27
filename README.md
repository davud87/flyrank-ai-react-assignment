# TaskFlow

TaskFlow is a frontend-only task management application built with Next.js, React, TypeScript, Tailwind CSS, and browser localStorage. It helps users create, organize, search, filter, complete, edit, and delete tasks directly in the browser.

This repository preserves the previous FlyRank frontend assignment work and migrates the application foundation from Vite to Next.js App Router for the FE-05 assignment.

## Features

- Create tasks
- Edit tasks
- Delete tasks with confirmation
- Mark tasks completed/active
- Low / Medium / High priority
- Search tasks by title and description
- Filter All / Active / Completed
- localStorage persistence
- Form validation
- Responsive interface
- Accessible controls
- App Router root layout and navigation
- `/health` page backed by a simple Next.js route handler

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- CSS
- ESLint
- Browser localStorage

## Running the Project Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run project checks:

```bash
npm run lint
npm run build
```

Start a production build locally after building:

```bash
npm run start
```

## Route Structure

- `/` - Main TaskFlow application screen
- `/health` - Health status page that fetches data from the local health API route
- `/api/health` - JSON health endpoint used by the health page

The existing TaskFlow application represents the actual application screen from the completed frontend work. No unrelated placeholder screens were added.

## Architecture Notes

The App Router files are Server Components by default:

- `app/layout.tsx`
- `app/page.tsx`
- `app/health/page.tsx`
- `src/components/layout/Navigation.tsx`

The interactive TaskFlow application is a Client Component:

- `src/components/TaskFlowApp.tsx`

It uses `"use client"` because it depends on React state, effects, browser localStorage, form interactions, and `window.confirm`. Components imported by `TaskFlowApp` are part of that client-side task interface.

## Environment Variables

`.env.example` contains placeholder-only configuration:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Local secret files such as `.env`, `.env.local`, and `.env*.local` are ignored by Git. Do not commit real API keys, access tokens, passwords, or other credentials.

## AI-Assisted Development

Codex was used as a development assistant during this project. It helped with inspecting the starter project, planning the architecture, generating the initial UI, implementing CRUD behavior, implementing search/filtering/localStorage, reviewing the code for potential improvements, and migrating the project foundation to Next.js App Router.

Generated changes were reviewed and manually tested before being accepted. AI support was used as part of the development workflow, but final decisions were reviewed by me rather than accepted automatically.

## Prompts Used During Development

### Prompt 1 - Architecture and Planning

Asked AI to inspect the Vite project without modifying code, propose a lightweight TaskFlow architecture, suggest components/types/state/localStorage strategy, identify accessibility and TypeScript concerns, and propose an implementation order.

### Prompt 2 - Static UI Foundation

Asked AI to remove the default Vite interface and build only the static TaskFlow UI with semantic HTML, accessible labels, responsive CSS, and TypeScript types. CRUD, localStorage, search, and filtering were explicitly excluded from this stage.

### Prompt 3 - Core Task Functionality

Asked AI to implement create, edit, delete, completed/active toggling, priority support, whitespace-normalized validation, accessible error handling, and React state while explicitly excluding search, filtering, and localStorage.

### Prompt 4 - Search, Filtering, and Persistence

Asked AI to add search by task title and optional description, implement All / Active / Completed filters, combine search and filtering, and add localStorage persistence using a simple implementation with safe fallback behavior.

### Prompt 5 - Final Code Review

Asked AI to review the completed project without modifying files and identify issues involving React structure, TypeScript, accessibility, validation, localStorage, duplication, naming, responsiveness, UX, and unused assets.

### Prompt 6 - Refactoring

Asked AI to centralize duplicated task types and priority metadata, remove genuinely unused starter assets, and add confirmation before deleting tasks.

### Prompt 7 - Next.js App Router Migration

Asked AI to preserve the existing TaskFlow functionality while migrating the Vite application to Next.js with App Router, Server Components by default, a Client Component for the interactive task app, Tailwind CSS design tokens, a root layout, navigation, `/health`, safe environment-variable structure, and deployment readiness for the existing Vercel project.

## Review and Improvements

During UI review, I noticed the empty-state message said that functionality would be implemented "in the next stage." I manually changed this developer-facing placeholder to user-facing copy: "Add your first task to start organizing your day."

After reviewing the application, duplicated task-related types and priority metadata were identified during the AI-assisted code review and subsequently centralized through review-driven AI-assisted refactoring. Delete confirmation was also added to reduce accidental deletion, and unused starter assets were reviewed and removed where genuinely unused.

For FE-05, the previous Vite entry files were replaced with a Next.js App Router structure. The existing TaskFlow logic was preserved and moved into a Client Component because it uses browser-only interactivity.

## Manual Testing

I manually verified during development:

- Adding tasks
- Whitespace-only title validation
- Descriptions
- Low / Medium / High priorities
- Editing
- Cancel editing
- Deleting
- Cancelling deletion
- Completed/active toggling
- All / Active / Completed filters
- Case-insensitive title search
- Description search
- Persistence after refresh
- Edited/deleted state persistence
- localStorage contents in browser DevTools

For the Next.js migration, also verify:

- `/` renders the TaskFlow application
- `/health` renders fetched health data
- Navigation reaches the available routes
- Responsive layout works around 375px and 1280px widths
- The existing Vercel project builds after pushing to GitHub

## Verification

The project should be verified using:

```bash
npm run lint
npm run build
```

No automated tests are currently included in this project.

## Deployment

This repository is already connected to an existing Vercel deployment. No new Vercel project is required.

After pushing the migration, verify in the existing Vercel dashboard that:

- Framework preset is detected as Next.js
- Build command is `next build`
- Install command is `npm install`
- Output directory is unset/default for Next.js
- Preview deployments build successfully from Git pushes

## Repository / Live Demo

- Repository: https://github.com/davud87/flyrank-ai-react-assignment
- Live demo: https://flyrank-ai-react-assignment.vercel.app
