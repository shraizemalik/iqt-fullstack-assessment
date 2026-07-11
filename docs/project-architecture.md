# Task Management System Architecture

## Chosen Structure

This project uses a simple monorepo layout:

- `backend/` for the Laravel 11 REST API
- `frontend/` for the React + Vite client
- `docs/` for assessment documentation

## Why This Approach

This keeps the backend and frontend clearly separated while still living in one repository, which is a good fit for a technical assessment:

- API responsibilities stay isolated inside Laravel
- React can evolve independently without coupling UI code to Laravel views
- The reviewer can understand the project quickly
- Local setup remains straightforward

## Planned Backend Structure

Key Laravel areas we will use:

- `app/Http/Controllers/Api/V1`
- `app/Http/Requests/Task`
- `app/Http/Resources`
- `app/Services`
- `routes/api.php`

## Planned Frontend Structure

The React app will follow a feature-friendly structure:

- `src/components` for reusable UI
- `src/features/tasks` for task-specific screens and logic
- `src/features/github-explorer` for the public API page
- `src/pages` for route-level pages
- `src/services` for Axios clients and API modules
- `src/hooks` for reusable hooks
- `src/layouts` for shared page structure
- `src/utils` for small helpers

## API Versioning

The API will be exposed under `api/v1` from the start. It is a small detail, but it reflects a production-minded approach and avoids awkward refactors later.
