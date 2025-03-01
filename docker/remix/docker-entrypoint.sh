#!/bin/sh

# MySQL の起動を待機（Prisma の接続テストを使用）
echo "Waiting for MySQL to be ready..."
until npx prisma db push > /dev/null 2>&1; do
  sleep 2
done

echo "MySQL is ready! Running migrations..."
echo yes | npx prisma migrate dev --name init
npx prisma generate

exec npm run dev