# Project: NegocioSpot

## Project Overview

NegocioSpot is a web platform that allows users to discover and connect with local businesses easily and efficiently. Built with Next.js, Supabase, and Prisma, it offers a fast and secure experience for both users and business administrators.

**Key Technologies:**

- **Framework:** Next.js (React)
- **Backend as a Service:** Supabase (for authentication, database, and storage)
- **ORM:** Prisma
- **UI:** Mantine
- **Language:** TypeScript
- **Package Manager:** pnpm
- **Linting/Formatting:** Biome

## Building and Running

The following scripts are available in `package.json`:

- `pnpm dev`: Starts the development server.
- `pnpm build`: Creates a production build of the application.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Lints the codebase using Biome.
- `pnpm format`: Formats the codebase using Biome.
- `pnpm typecheck`: Type-checks the codebase using TypeScript.

### Database

The project uses Prisma for database management.

- `pnpm prisma:generate`: Generates the Prisma client.
- `pnpm prisma:migrate`: Runs database migrations during development.
- `pnpm prisma:deploy`: Deploys database migrations to production.

## Development Conventions

- **Internationalization:** The app uses `next-intl` for i18n. Translation files are located in `src/features/i18n/messages`.
- **Styling:** The project uses Mantine for UI components and PostCSS for styling.
- **Git Hooks:** A pre-commit hook is set up with Husky to lint and format code before committing.
- **Aliases:** The project uses the `@/*` alias for `src/*`.
- **Project Structure:**: Main code is in `src/` directory.
  - `src/app`: Nextjs app directory.
  - `src/features`: Specific features of the app.
  - `src/lib`: Shared libraries and utilities.

## Commit instructions

- Ensure husky is set up to run pre-commit hooks.
- Atomic commits are preferred.
- Use conventional commits format.
- Check previous commits for reference.
