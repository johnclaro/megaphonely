FROM node:boron

WORKDIR /app

COPY package.json /app

RUN npm install --verbose

ADD . /app

CMD npm start
