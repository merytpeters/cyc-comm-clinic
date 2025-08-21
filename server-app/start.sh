#!/bin/sh
echo "Running database migrations..."
npm run prod:db:clear-providers
npx prisma migrate deploy
echo "Seeding database..."
npm run prod:db:seed
echo "Starting application..."
npm run start:dev