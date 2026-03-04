FROM ghcr.io/puppeteer/puppeteer:21.5.0

# Cambiamos al directorio de la app
WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos solo lo necesario
RUN npm install --omit=dev

# Copiamos el resto del código
COPY . .

# Comando para arrancar
CMD ["node", "index.js"]
