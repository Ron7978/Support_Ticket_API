# Support Ticket API with Webhooks

Simple CRUD API for tickets. Triggers a webhook when status changes.

## Endpoints
- `POST /tickets`
- `GET /tickets`
- `GET /tickets/:id`
- `PATCH /tickets/:id`
- `DELETE /tickets/:id`
- `UPDATE /tickets/:id` 
- `GET /healthz`

## Env
- `MONGODB_URI` 
- `WEBHOOK_URL` 
- `PORT` (default 3000)

## Deployed on Render
https://support-ticket-api-1.onrender.com/

<img src="./public/assets/support_ticket_api.jpg" alt="img" width="600" height="500" style="border:5px solid black">
