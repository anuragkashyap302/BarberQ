# ==========================================
# BarberQ Server Dockerfile
# Backend Node.js Express + Socket.io Server
# ==========================================

# Lightweight Node.js 20 Alpine Linux base image use kiya
FROM node:20-alpine

# Container ke andar working directory set kiya
WORKDIR /app

# Sabse pehle package.json aur package-lock.json copy kiya taaki Docker layer caching ka benefit mile
COPY package*.json ./

# Sabhi dependencies install kiye
RUN npm install --production=false

# Source code container ke andar copy kiya
COPY . .

# Server port 4000 expose kiya
EXPOSE 4000

# Backend server start karne ka command
CMD ["npm", "start"]
