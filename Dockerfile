FROM node:20-alpine

WORKDIR /app

COPY package.json .
RUN npm i
RUN npm i react-icons

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]