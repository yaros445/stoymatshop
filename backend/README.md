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
- `POST /api/auth/register` and `POST /api/auth/login` — create an account or start a session. Sessions use an HttpOnly cookie; passwords are stored as scrypt hashes.
- `GET /api/auth/me` — returns the current account, or `null` when signed out.
- `POST /api/auth/logout` — revokes the current session.
- `GET /api/auth/orders` — returns the signed-in account's order history.
- `POST /api/orders` — creates a delivery order for either a guest or signed-in customer. Send customer name, phone, address, optional comment, and product IDs with quantities. Prices are always read from MySQL; client-provided prices are rejected. Stock is checked and decremented transactionally. Signed-in orders are linked to that account.

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

Order history is only available to the authenticated owner. There is no public order lookup endpoint or password reset flow yet. Set `CLIENT_ORIGIN` to the exact frontend origin when hosting the API separately.

## Development checks

```sh
npm run typecheck
npm test
npm run build
```
