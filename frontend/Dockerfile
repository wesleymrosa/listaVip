FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
# Força a instalação das dependencias no node bypassando conflitos de versao vite/jspdf
RUN npm install lucide-react react-router-dom framer-motion react-hot-toast jspdf jspdf-autotable --legacy-peer-deps
CMD ["npm", "run", "dev"]
