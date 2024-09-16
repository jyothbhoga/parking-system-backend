#Sample Dockerfile for NodeJS Apps

FROM node:16

WORKDIR /app

COPY "package*.json" ./

ENV NODE_ENV=development

RUN npm install --development

COPY . .

EXPOSE 9000

CMD [ "node", "src/app.js" ]