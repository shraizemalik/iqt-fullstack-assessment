# API Documentation

Base URL: `/api/v1`

## GET `/tasks`

Returns a paginated task list ordered by latest first.

### Query Parameters

- `search` optional string
- `status` optional `completed` or `pending`
- `per_page` optional integer, min `1`, max `50`
- `page` optional integer

### Response

```json
{
  "data": [],
  "links": {},
  "meta": {},
  "message": "Tasks retrieved successfully.",
  "summary": {
    "total": 0,
    "completed": 0,
    "pending": 0,
    "filtered": 0
  }
}
```

## POST `/tasks`

Creates a task.

### Payload

```json
{
  "title": "Prepare API documentation",
  "description": "Document request and response formats.",
  "is_completed": false
}
```

## PUT `/tasks/{task}`

Updates an existing task.

### Payload

```json
{
  "title": "Prepare API documentation",
  "description": "Updated details",
  "is_completed": true
}
```

## DELETE `/tasks/{task}`

Deletes a task.

### Response

```json
{
  "message": "Task deleted successfully."
}
```

## Validation Rules

- `title`: required on create, optional on update, string, max `255`
- `description`: nullable string
- `is_completed`: optional boolean
