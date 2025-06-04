#!/bin/sh
echo "Waiting for database to be ready..."
until nc -z -v -w30 postgres 5432
do
  echo "Waiting for database connection..."
  sleep 2
done

echo "Running migrations..."
npx prisma migrate deploy --schema=libs/common/src/database/prisma/schema.prisma

echo "Starting app..."
node dist/apps/ttk-collector/apps/ttk-collector/src/main
