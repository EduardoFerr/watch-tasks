# # Estágio 1: Build - Compila a aplicação Vue.js
# FROM node:18-alpine AS build-stage

# WORKDIR /app

# # Copia os ficheiros de manifesto de pacotes
# COPY package*.json ./

# # Instala todas as dependências
# RUN npm install

# # Copia todo o código-fonte do frontend
# COPY . .

# # Executa o build de produção, que gera os ficheiros estáticos na pasta /dist
# RUN npm run build

# # Estágio 2: Produção - Serve os ficheiros estáticos com Nginx
# # Usamos uma imagem Nginx super leve para servir o conteúdo
# FROM nginx:stable-alpine

# # Copia os ficheiros estáticos gerados no estágio de build para a pasta do Nginx
# COPY --from=build-stage /app/dist /usr/share/nginx/html

# # Expõe a porta 80 (padrão do Nginx)
# EXPOSE 80

# # O comando padrão do Nginx já inicia o servidor, então não precisamos de um CMD


# Usar uma imagem oficial do Node.js como base.
FROM node:18-alpine

# Definir o diretório de trabalho dentro do container.
WORKDIR /app

# Copiar os ficheiros de manifesto (package.json e package-lock.json).
COPY package*.json ./

# Instalar todas as dependências do projeto.
RUN npm install

# Copiar o resto do código da aplicação para o diretório de trabalho.
COPY . .

# Expor a porta 8080, que é a porta que configurámos para o Vite.
EXPOSE 8080

# O comando padrão para iniciar o container.
CMD [ "npm", "run", "dev" ]
