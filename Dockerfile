# Imagem base
FROM node:20

# Diretório de trabalho
WORKDIR /usr/src/app

# Copia o package.json e instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante do projeto
COPY . .

# Expõe a porta padrão do NestJS
EXPOSE 3000

# Comando padrão (em modo dev)
CMD ["npm", "run", "start:dev"]
