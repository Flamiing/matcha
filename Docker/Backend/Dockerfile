FROM node:22.11.0-bookworm

WORKDIR /matcha_backend

COPY . .
RUN npm install
RUN sleep 60

CMD [ "npm", "start" ]
