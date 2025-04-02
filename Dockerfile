FROM node:20-alpine

WORKDIR /app

COPY package.json .
RUN npm i esbuild@0.25.1
RUN npm i react-icons

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]