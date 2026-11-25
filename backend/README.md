# СтройБаза backend

Standalone Express 5 API written in TypeScript. Prisma connects to MySQL. The backend has its own dependencies and scripts; run commands from this directory.

## Requirements and setup

- Node.js 20.19+ (or 22.12+)
- MySQL 8+

```sh
npm install
cp .env.example .env
```

Set `DATABASE_URL` in `.env` to a MySQL database and update `CLIENT_ORIGIN` if the frontend uses a different origin. Create the database before applying migrations:

```sql
CREATE DATABASE stoymatshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then initialize the schema and sample catalog:

```sh
npm run db:migrate
npm run db:seed
npm run dev
```

The API listens on `http://localhost:3001` by default. Seed data is demo catalog data; the seed command can be run again safely.

## API

- `GET /api/health` — verifies the API and database connection.
- `GET /api/categories` — lists categories and active product counts.
- `GET /api/products` — lists active products. Optional query parameters: `search`, `categoryId`, `brand`, `maxPriceCents`, `inStock=true`, `page`, and `pageSize` (maximum 100). Returns `data` and pagination metadata.
- `POST /api/orders` — creates an anonymous delivery order. Send customer name, phone, address, optional comment, and product IDs with quantities. Prices are always read from MySQL; client-provided prices are rejected. Stock is checked and decremented transactionally.

Example request:

```json
{
  "customerName": "Иван Иванов",
  "customerPhone": "+375 (29) 123-45-67",
  "address": "Минск, ул. Складская, 14",
  "comment": "Позвонить перед доставкой",
  "items": [{ "productId": 1, "quantity": 2 }]
}
```

Orders are anonymous for now. There is deliberately no account/login API or order lookup endpoint until authentication and authorization requirements are defined. The current frontend still uses local demo storage and is not connected to this API.

## Development checks

```sh
npm run typecheck
npm test
npm run build
```
