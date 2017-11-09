FROM node:boron

EXPOSE 3000

WORKDIR /app

COPY package.json /app

RUN npm install

ADD . /app

CMD npm start
