# Backend

Laravel 11 REST API for the Task Management System.

## API Endpoints

- `GET /api/v1/tasks`
- `POST /api/v1/tasks`
- `PUT /api/v1/tasks/{task}`
- `DELETE /api/v1/tasks/{task}`

## Supported Query Parameters

- `search`
- `status=completed|pending`
- `per_page`
- `page`

## Commands

```bash
composer install
php artisan key:generate
php artisan migrate --seed
php artisan test
php artisan serve
```
