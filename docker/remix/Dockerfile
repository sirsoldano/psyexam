FROM node:current-slim
WORKDIR /usr/server
RUN apt-get update -y && apt-get install -y openssl
COPY ./package.json ./
RUN npm install
COPY . .
RUN npx prisma generate

ENV NODE_ENV=development
CMD ["npm", "run", "dev"]

#RUN npm run build
#ENV NODE_ENV=production
#CMD ["npm", "run", "start"]