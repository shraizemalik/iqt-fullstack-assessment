# Installation Guide

## Requirements

- PHP 8.2+
- Composer 2+
- Node.js 18+
- npm 9+
- MySQL 8+ or MariaDB

## Backend Setup

1. Copy `backend/.env.example` to `backend/.env`
2. Update database credentials
3. Install dependencies:

```bash
cd backend
composer install
```

4. Generate the application key:

```bash
php artisan key:generate
```

5. Run migrations and seed sample data:

```bash
php artisan migrate --seed
```

6. Start the API server:

```bash
php artisan serve
```

## Frontend Setup

1. Copy `frontend/.env.example` to `frontend/.env`
2. Set:
   - `VITE_API_BASE_URL`
   - `VITE_REPOSITORY_URL`
3. Install dependencies:

```bash
cd frontend
npm install
```

4. Start the development server:

```bash
npm run dev
```

## Verification Commands

```bash
cd backend
php artisan test
```

```bash
cd frontend
npm run lint
npm run build
```
