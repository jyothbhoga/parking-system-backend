#Sample Dockerfile for NodeJS Apps

FROM node:16

ENV NODE_ENV=development

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --dev

COPY . .

EXPOSE 9000

CMD [ "nodemon", "src/app.js" ]