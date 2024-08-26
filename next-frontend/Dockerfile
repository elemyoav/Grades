FROM node:22-alpine3.19

WORKDIR /home/next-frontend

COPY . .

RUN npm install

ENV PORT=3000

ENV BACKEND_URL=http://localhost:3001

EXPOSE 3000

CMD ["npm", "run", "dev"]
