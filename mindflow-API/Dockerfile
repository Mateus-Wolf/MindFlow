FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install
ENV TZ=America/Sao_Paulo


COPY . .

EXPOSE 3000
CMD ["npm", "start"]
