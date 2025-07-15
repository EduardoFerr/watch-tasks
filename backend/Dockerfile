# Usar a imagem slim baseada em Debian para melhor compatibilidade de bibliotecas.
FROM node:18-slim

# Instala o OpenSSL, que é uma dependência do Prisma.
RUN apt-get update && apt-get install -y openssl

# Define o diretório de trabalho dentro do container.
WORKDIR /app

# Copia os ficheiros de manifesto para aproveitar o cache do Docker.
COPY package*.json ./

# Instala todas as dependências, incluindo as de desenvolvimento como o 'tsx'.
RUN npm install

# Copia o resto do código da aplicação.
# Isto serve como base, mas será sobreposto pelo volume no docker-compose.
COPY . .

# Expõe a porta que a nossa API usa.
EXPOSE 3333

# O comando para iniciar o servidor de desenvolvimento com live-reloading.
CMD [ "npm", "run", "dev" ]
