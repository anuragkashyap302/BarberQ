# ==========================================
# BarberQ Client Dockerfile (React + Vite)
# ==========================================

# Lightweight Node.js 20 base image use kiya
FROM node:20-alpine

# Container working directory define kiya
WORKDIR /app

# Package manifests copy kiya caching optimize karne ke liye
COPY package*.json ./

# Node modules install kiya
RUN npm install

# Frontend source code copy kiya
COPY . .

# Vite development server port 5173 expose kiya
EXPOSE 5173

# Vite server ko container se publicly bind karne ke liye --host flag ke sath start kiya
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
