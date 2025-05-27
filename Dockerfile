FROM node:22.16.0 AS nodeimg

ENV TZ="America/La_Paz"

WORKDIR /app

COPY package*.json ./

RUN apt-get clean && apt-get update && apt-get install -y curl libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libgbm1 libasound2 libpangocairo-1.0-0 libxss1 libgtk-3-0 postgresql postgresql-contrib postgis

COPY . .

COPY .env .env

RUN npm install --no-audit --progress=false; \
	npm run prisma:generate; \
	npm run build;

CMD ["bash", "-c", "npm run prisma:generate && npm run prisma:migrate:prod && npm run prisma:seed && npm run script:sql && npm run start:prod"]

