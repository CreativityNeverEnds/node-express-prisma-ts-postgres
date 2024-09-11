Created by Chee Ming

## Getting Started

First, run the development server:

```bash
npm run create

npm run migrate

npm run dev

npm run build

npm run start

Request ->

GET http://localhost:3000/orders

GET http://localhost:3000/orders?status=fulfilled

GET http://localhost:3000/orders?customer=John

curl -X POST http://localhost:3000/orders \
-H "Content-Type: application/json" \
-d '{"customer": "John Doe", "status": "pending"}'

```

Create an API with one endpoint:

Fetch a static list of orders, or optionally from a database if you'd like to showcase those skills (using Prisma and Postgres).
Extra Challenge: Add a query parameter to the endpoint that allows filtering the orders by status or customer name directly from the API (e.g., /orders?status=fulfilled or /orders?customer=John).
Express.js: https://expressjs.com/

Prisma: https://www.prisma.io/

Postgres: https://www.postgresql.org/
