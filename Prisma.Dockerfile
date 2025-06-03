FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma/schema.prisma ./prisma/
RUN npx prisma generate --schema=/app/prisma/schema.prisma && ls -la /app/node_modules/.prisma/client/
CMD ["sh", "-c", "mkdir -p /shared/prisma/client && cp -r /app/libs/prisma/node_modules/.prisma/client/* /shared/prisma/client && ls -la /shared/prisma/client"]