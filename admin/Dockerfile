# ==========================================
# BarberQ Admin Panel Dockerfile (React + Vite)
# ==========================================

# Lightweight Node.js 20 base image use kiya
FROM node:20-alpine

# Container working directory define kiya
WORKDIR /app

# Dependencies manifests copy kiya
COPY package*.json ./

# Sabhi required packages install kiye
RUN npm install

# Admin panel source code copy kiya
COPY . .

# Admin panel port 5174 expose kiya
EXPOSE 5174

# Vite admin server ko host 0.0.0.0 ke sath run kiya
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5174"]
