#!/bin/sh
echo "🔄 Running database migrations..."
npx prisma migrate deploy
echo "🌱 Seeding database..."
npm run prod:db:seed
echo "🚀 Starting application..."
npm run start:dev