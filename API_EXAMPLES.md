# API JSON Examples — Jong Tov Cafe

Base URL: `http://localhost:3000`

---

## Auth

### Register
POST /api/auth/register
Request JSON:
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "pass123"
}

Response JSON (201/200):
{
  "token": "eyJhb...",
  "user": { "id": 12, "name": "Alice", "email": "alice@example.com", "role": "user" }
}

### Login
POST /api/auth/login
Request JSON:
{ "email": "alice@example.com", "password": "pass123" }

Response JSON:
{
  "token": "eyJhb...",
  "user": { "id": 12, "name": "Alice", "email": "alice@example.com", "role": "user" }
}

### Me (protected)
GET /api/auth/me
Headers: `Authorization: Bearer <token>`
Response JSON:
{ "id": 12, "name": "Alice", "email": "alice@example.com", "role": "user" }

---

## Favorites

### List favorites (protected)
GET /api/auth/favorites
Response JSON: [
  {
    "id": 5,
    "name": "Central Perk",
    "description": "Cozy neighborhood cafe",
    "priceLevel": 2,
    "rating": 4.5,
    "tags": ["Study-friendly","Fast WiFi"],
    "facilities": ["Outdoor seating","Air conditioning"],
    "location": { "lat": 11.55, "lng": 104.92 }
  }
]

### Add favorite (protected)
POST /api/auth/favorites/:cafeId
Response JSON:
{ "message": "Added to favorites" }

### Remove favorite (protected)
DELETE /api/auth/favorites/:cafeId
Response JSON:
{ "message": "Removed from favorites" }

---

## Users (admin)

GET /api/auth/users
Response JSON:
[
  { "id": 1, "name": "Admin", "email": "admin@x.com", "role": "admin", "preferences": {}, "createdAt": "2026-05-01T12:00:00Z" }
]

---

## Cafes

### List cafes
GET /api/cafes?q=espresso&minRating=4&fastWifi=true
Response JSON: [
  {
    "id": 5,
    "name": "Central Perk",
    "priceLevel": 2,
    "rating": 4.5,
    "tags": ["Espresso","Fast WiFi"],
    "facilities": ["Outdoor seating"],
    "wifiSpeed": 50,
    "isOpen": true
  }
]

### Recommend
GET /api/cafes/recommend?prefs={"quiet":true,"fastWifi":true}
Response JSON: [ /* up to 20 cafe objects like above */ ]

### Get cafe by id
GET /api/cafes/:id
Response JSON:
{
  "id": 5,
  "name": "Central Perk",
  "description": "Cozy neighborhood cafe",
  "reviews": [ { "id": 10, "rating": 5, "text": "Great!", "User": { "id": 12, "name": "Alice" } } ]
}

### Create cafe (admin)
POST /api/cafes
Request JSON example:
{
  "name": "New Cafe",
  "description": "Modern spot",
  "priceLevel": 3,
  "tags": ["Study-friendly"],
  "facilities": ["Fast WiFi"],
  "location": { "lat": 11.55, "lng": 104.92 }
}
Response JSON: created cafe object (with `id`)

### Update cafe (admin)
PUT /api/cafes/:id
Request JSON (partial): { "priceLevel": 1 }
Response JSON: updated cafe object

### Delete cafe (admin)
DELETE /api/cafes/:id
Response JSON: { "message": "Deleted" }

---

## Reviews

### Add review (protected)
POST /api/reviews
Request JSON:
{ "cafeId": 5, "rating": 5, "text": "Excellent coffee and Wi‑Fi." }
Response JSON:
{
  "id": 42,
  "rating": 5,
  "text": "Excellent coffee and Wi‑Fi.",
  "CafeId": 5,
  "UserId": 12,
  "createdAt": "2026-05-24T08:00:00Z"
}

### Get reviews for a cafe
GET /api/reviews/cafe/:cafeId
Response JSON:
[
  { "id": 42, "rating": 5, "text": "Nice.", "User": { "name": "Alice" } }
]

### List reviews (admin)
GET /api/reviews
Response JSON: [ { "id": 42, "rating": 5, "text": "...", "User": { "id":12, "name":"Alice","email":"..." }, "Cafe": { "id":5, "name":"Central Perk" } } ]

### Delete review (admin)
DELETE /api/reviews/:id
Response JSON: { "message": "Deleted" }

---

## Google photos proxy

GET /api/google/photo
Response JSON (example):
{
  "photos": [ { "id": "abc", "url": "https://..." } ]
}

---

If you'd like, I can now:
- expand each example with full response schemas from `models`, or
- generate a Postman collection from these examples.
