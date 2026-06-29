# Projects API

## `GET /api/projects`

List all projects for the authenticated user.

```json
[
  {
    "id": "uuid",
    "name": "web-scraper",
    "language": "python",
    "code": "...",
    "created_at": "...",
    "updated_at": "...",
    "last_execution": { "id": "uuid", "status": "completed", "duration_ms": 1234 }
  }
]
```

## `POST /api/projects`

Create a new project.

```json
{
  "name": "my-project",
  "code": "print('hello')",
  "language": "python"
}
```

## `GET /api/projects/:id`

Get a single project with full code content.

## `PUT /api/projects/:id`

Update project name or code.

```json
{
  "name": "new-name",
  "code": "print('updated')"
}
```

## `DELETE /api/projects/:id`

Delete a project and its execution history.

Response: `204 No Content`

## `POST /api/projects/:id/duplicate`

Create a copy of an existing project.

Response: `201 Created` with the new project object.

## `GET /api/projects/:id/executions`

List executions for a specific project (paginated).

Same pagination as `GET /api/runs`.
