FROM node:alpine AS development
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
RUN apk add --no-cache curl
COPY . .
RUN npx prisma generate --schema=libs/common/src/database/prisma/schema.prisma
RUN npm run build gateway
COPY apps/gateway/start.sh .
RUN chmod +x start.sh
CMD ["./start.sh"]

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install --production
COPY --from=development /usr/src/app/dist ./dist
RUN chown -R node:node /usr/src/app
USER node
COPY apps/gateway/start.sh .
RUN chmod +x start.sh
CMD ["./start.sh"]

