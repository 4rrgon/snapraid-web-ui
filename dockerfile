FROM node:25

WORKDIR /app

RUN apt-get update && apt-get install -y git

RUN git clone https://github.com/4rrgon/snapraid-web-ui .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
