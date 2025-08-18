FROM node:22.17 AS dev
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/

RUN apt-get update
RUN apt-get -y install cmake

RUN npm ci --quiet

COPY . .
CMD ["npm", "run", "start:dev"]

FROM node:22.17 AS build
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma/
COPY . .

RUN npm ci --quiet
RUN npm run build
RUN npx prisma generate
RUN test -d dist || (echo "dist directory was not created during build" && exit 1)

ENV NODE_PATH=/app

FROM node:22.17 AS production
WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist/
COPY --from=build /app/prisma ./prisma/
COPY --from=build /app/src ./src

RUN npm ci --quiet

RUN npx prisma generate
RUN npx tsx prisma/seed.ts

RUN npm prune --production

ENV NODE_PATH=/app

EXPOSE 80

CMD ["sh", "-c", "npx prisma migrate deploy && npm run prod:db:seed && npm run start"]
