#Sample Dockerfile for NodeJS Apps

FROM node:16

WORKDIR /app

COPY "package*.json" ./

RUN npm install 

COPY . .

EXPOSE 9000

CMD [ "node", "src/app.js" ]