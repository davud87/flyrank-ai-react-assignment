# TaskFlow

TaskFlow is a frontend-only task management application built with React, TypeScript, Vite, and plain CSS. It helps users create, organize, search, filter, complete, edit, and delete tasks directly in the browser.

## Features

- Create tasks
- Edit tasks
- Delete tasks
- Mark tasks completed/active
- Low / Medium / High priority
- Search tasks by title and description
- Filter All / Active / Completed
- localStorage persistence
- Form validation
- Responsive interface
- Accessible controls

## Technologies Used

- React
- TypeScript
- Vite
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

## AI-Assisted Development

Codex was used as a development assistant during this project. It helped with inspecting the starter project, planning the architecture, generating the initial UI, implementing CRUD behavior, implementing search/filtering/localStorage, and reviewing the code for potential improvements.

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

## Review and Improvements

During UI review, I noticed the empty-state message said that functionality would be implemented "in the next stage." I manually changed this developer-facing placeholder to user-facing copy: "Add your first task to start organizing your day."

After reviewing the application, duplicated task-related types and priority metadata were identified during the AI-assisted code review and subsequently centralized through review-driven AI-assisted refactoring. Delete confirmation was also added to reduce accidental deletion, and unused starter assets were reviewed and removed where genuinely unused.

## Manual Testing

I manually verified:

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

## Verification

The project was verified using:

```bash
npm run lint
npm run build
```

No automated tests are included in this project.

## Repository / Live Demo

- Repository: add repository URL here
- Live demo: deployment URL not added yet
