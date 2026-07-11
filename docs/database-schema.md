# Database Schema

## tasks

- `id` bigint unsigned primary key
- `title` varchar(255) not null
- `description` text nullable
- `is_completed` boolean not null default `false`
- `created_at` timestamp nullable
- `updated_at` timestamp nullable

## Indexes

- index on `is_completed`
- index on `created_at`
