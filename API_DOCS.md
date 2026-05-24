# Jong Tov Cafe — API Documentation

Base URL: `http://localhost:3000` (backend)

---

## Authentication

- POST /api/auth/register
  - Body: { name, email, password }
  - Response: { token, user: { id, name, email, role } }

- POST /api/auth/login
  - Body: { email, password }
  - Response: { token, user: { id, name, email, role } }

- GET /api/auth/me (protected)
  - Headers: `Authorization: Bearer <token>`
  - Response: { id, name, email, role }

- GET /api/auth/favorites (protected)
  - Response: [ Cafe ] — user's favorite cafes (full cafe objects)

- POST /api/auth/favorites/:cafeId (protected)
  - Adds cafe to favorites
  - Response: { message: 'Added to favorites' }

- DELETE /api/auth/favorites/:cafeId (protected)
  - Removes cafe from favorites
  - Response: { message: 'Removed from favorites' }

- GET /api/auth/users (admin + protected)
  - Response: [ { id, name, email, role, preferences, createdAt } ]

---

## Cafes

- GET /api/cafes/
  - Query params: `q`, `minRating`, `maxPrice`, `openNow`, `fastWifi`, `studyFriendly`, `familyFriendly`, `outdoorSeating`, `airConditioning`, `tags` (comma separated)
  - Response: [ Cafe ]

- GET /api/cafes/recommend
  - Query param: `prefs` (JSON string of user preferences)
  - Response: [ Cafe ] (top 20 recommendations)

- GET /api/cafes/:id
  - Response: Cafe object (includes `reviews` with `user` name)

- POST /api/cafes/ (admin + protected)
  - Body: Cafe fields (see `models`) — typical fields: `name`, `description`, `priceLevel`, `rating`, `tags`, `facilities`, `location`, etc.
  - Response: created Cafe object

- PUT /api/cafes/:id (admin + protected)
  - Body: partial Cafe fields to update
  - Response: updated Cafe object

- DELETE /api/cafes/:id (admin + protected)
  - Response: { message: 'Deleted' }

---

## Reviews

- POST /api/reviews/ (protected)
  - Body: { cafeId, rating, text }
  - Response: created Review object

- GET /api/reviews/cafe/:cafeId
  - Response: [ Review ] (includes `user.name`)

- GET /api/reviews/ (admin + protected)
  - Response: [ Review ] (includes `user` and `cafe` brief info)

- DELETE /api/reviews/:id (admin + protected)
  - Response: { message: 'Deleted' }

---

## Google photos proxy

- GET /api/google/photo
  - Returns a proxied photo result (see `backend/routes/google.js`)

---

## Middleware

- `auth` (backend/middleware/auth.js): verifies JWT in `Authorization` header and sets `req.user`.
- `admin` (backend/middleware/admin.js): checks `req.user.role === 'admin'`.

---

## Example curl requests

Register:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"pass123"}'
```

Login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"pass123"}'
```

Get cafes with filters:

```bash
curl "http://localhost:3000/api/cafes?q=espresso&minRating=4&fastWifi=true"
```

Add review (replace TOKEN):

```bash
curl -X POST http://localhost:3000/api/reviews/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"cafeId":1,"rating":5,"text":"Great place"}'
```

---

If you want, I can expand each endpoint with full request/response JSON examples based on the Sequelize `models`, or generate a Postman collection.
