FROM node:13
WORKDIR /server
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 3001
CMD ["node", "index.js"]