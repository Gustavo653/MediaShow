FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
COPY . .
RUN npm install --production
EXPOSE 3000
CMD ["sh", "-c", "npx sequelize-cli db:migrate && node src/index.js"]
