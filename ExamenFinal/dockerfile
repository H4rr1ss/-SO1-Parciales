FROM node:20.10.0

WORKDIR /app_hgomez202103718

COPY package*.json ./
RUN npm install

COPY . .
CMD npm start