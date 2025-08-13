# Support Ticket API with Webhooks

Simple CRUD API for tickets. Triggers a webhook when status changes.

## Endpoints
- `POST /tickets`
- `GET /tickets`
- `GET /tickets/:id`
- `PATCH /tickets/:id`
- `DELETE /tickets/:id` (optional)
- `GET /healthz`

## Env
- `MONGODB_URI` (required)
- `WEBHOOK_URL` (optional for status-change events)
- `PORT` (default 3000)

## Local
