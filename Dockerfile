FROM node:18.14-alpine
WORKDIR /app
COPY package*.json . 
RUN npm install
COPY . . 
EXPOSE 4000
CMD [ "npm", "run", "start:dev" ]