# СтройБаза

Демо-магазин стройматериалов на React, TypeScript, Material UI и Vite. Маршруты настроены отдельной конфигурацией React Router и отрисовывают самостоятельные страницы каталога, калькулятора, профиля, компании, отзывов и доставки. Корневой адрес перенаправляет в каталог.

## Структура приложения

- `src/routes/router.tsx` — вложенные маршруты, общий layout и загрузка страниц по требованию.
- `src/pages/` — самостоятельные страницы приложения.
- `src/components/layout/StoreLayout.tsx` — общая шапка, навигация, корзина и оболочка страниц.
- `src/app/StoreProvider.tsx` — состояние каталога, корзины и текущего серверного сеанса.
- `src/app/theme.ts` — тема Material UI, согласованная с цветами магазина.

## Разработка

1. Создайте базу MySQL, затем в первом терминале запустите backend:

```powershell
Set-Location backend
Copy-Item .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

2. Во втором терминале из корня репозитория запустите frontend:

```powershell
npm install
npm run dev
```

Для production-сборки frontend выполните `npm run build`.

## Backend API

Отдельный Express + TypeScript backend с Prisma и MySQL находится в [`backend/`](./backend/README.md). Vite проксирует `/api` на backend во время разработки.

## Проверки

```sh
npm run test
npm run lint
npm run typecheck
npm run build
```

## Возможности аккаунта и заказов

- Регистрация и вход по email и паролю.
- Оформление заказа с контактами, адресом и оплатой при получении.
- История заказов для вошедшего пользователя.

Аккаунты, серверные сессии и заказы сохраняются в MySQL. Пароль не возвращается клиенту и хранится в виде scrypt-хеша. Старые демо-аккаунты и заказы из `localStorage` автоматически не переносятся. Доставка и оплата пока не интегрированы с внешними сервисами.
