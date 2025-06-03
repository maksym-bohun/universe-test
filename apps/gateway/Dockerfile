FROM node:20-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

FROM base AS development
WORKDIR /usr/src/app
COPY . .
RUN npm install --global @nestjs/cli
CMD ["npm", "run", "start:dev"]

FROM base AS build
WORKDIR /usr/src/app
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=build /usr/src/app/dist ./dist
CMD ["node", "dist/apps/gateway/main"]
