# Model-derived JSON Schemas — Jong Tov Cafe

This file derives request/response shapes from the Sequelize models in `backend/models/index.js`.

---

## User (model)
Sequelize fields: `name` (string), `email` (string, unique), `password` (string), `role` (string), `preferences` (JSON)

Response schema (do NOT return `password`):
{
  "id": 12,
  "name": "Alice",
  "email": "alice@example.com",
  "role": "user",
  "preferences": { "quiet": true },
  "createdAt": "2026-05-24T08:00:00.000Z",
  "updatedAt": "2026-05-24T08:00:00.000Z"
}

Create (register) request:
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "plain-text"
}

Notes:
- `password` is required on creation but never returned.
- `role` defaults to `user`; admin must be set manually in DB or via admin endpoint (not exposed).

---

## Cafe (model)
Sequelize fields: `name`, `description`, `images` (JSON[]), `location` (JSON), `rating` (float), `priceLevel` (int), `tags` (JSON[]), `wifiSpeed` (int), `isOpen` (bool), `facilities` (JSON[]), `openingHours` (JSON), `popularity` (int)

Cafe response example:
{
  "id": 5,
  "name": "Central Perk",
  "description": "Cozy neighborhood cafe",
  "images": ["/images/1.jpg"],
  "location": { "lat": 11.55, "lng": 104.92 },
  "rating": 4.5,
  "priceLevel": 2,
  "tags": ["Study-friendly","Espresso"],
  "wifiSpeed": 50,
  "isOpen": true,
  "facilities": ["Outdoor seating","Air conditioning"],
  "openingHours": { "mon": "08:00-18:00" },
  "popularity": 123,
  "createdAt": "2026-05-01T12:00:00.000Z",
  "updatedAt": "2026-05-10T09:00:00.000Z"
}

Create / Update request example (POST/PUT `/api/cafes`):
{
  "name": "New Cafe",
  "description": "Modern spot",
  "images": ["/images/new.jpg"],
  "location": { "lat": 11.55, "lng": 104.92 },
  "priceLevel": 3,
  "tags": ["Fast WiFi"],
  "wifiSpeed": 30,
  "facilities": ["Air conditioning"],
  "openingHours": { "mon": "07:00-20:00" }
}

Notes:
- `rating` is computed or provided; default 4.0.
- `images`, `tags`, `facilities` and `openingHours` are stored as JSON.

---

## Review (model)
Sequelize fields: `rating` (int), `text` (text). Associations: `Review` belongsTo `User` and `Cafe`.

Review response example:
{
  "id": 42,
  "rating": 5,
  "text": "Great coffee",
  "UserId": 12,
  "CafeId": 5,
  "createdAt": "2026-05-24T08:00:00.000Z"
}

Create request (POST `/api/reviews`):
{
  "cafeId": 5,
  "rating": 5,
  "text": "Great place"
}

Notes:
- `UserId` is set from `req.user.id` (protected route).
- When returned via `/api/reviews/cafe/:cafeId`, results include `User` nested with `name`.

---

## Favorites (join table `FavoriteCafes`)
Behavior:
- Users add/remove cafes via `POST /api/auth/favorites/:cafeId` and `DELETE /api/auth/favorites/:cafeId`.
- `GET /api/auth/favorites` returns an array of `Cafe` objects for the requesting user.

---

## Auth endpoints (token handling)
- `POST /api/auth/login` and `POST /api/auth/register` return:
{
  "token": "<jwt>",
  "user": { /* user object without password */ }
}

- Protected requests must set header: `Authorization: Bearer <token>`.

---

If you want, I can convert these into formal JSON Schema (Draft-07) files or a Swagger/OpenAPI document. Which format do you prefer? (OpenAPI / JSON Schema / Postman collection)