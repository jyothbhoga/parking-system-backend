#Sample Dockerfile for NodeJS Apps

FROM node:16

WORKDIR /app

COPY "package*.json" ./

RUN npm install --only=development

ENV NODE_ENV=development

COPY . .

EXPOSE 9000

CMD [ "node", "src/app.js" ]