FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Força a instalação do lucide caso o package.json tenha falhado
RUN npm install lucide-react
RUN npm install react-router-dom framer-motion react-hot-toast
CMD ["npm", "run", "dev"]
