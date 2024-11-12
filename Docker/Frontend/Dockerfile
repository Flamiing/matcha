FROM node:22.11.0-bookworm

WORKDIR /frontend

COPY package*.json ./
RUN npm install

COPY . .

# Start the app
CMD ["npm", "run", "dev"]
