FROM node:boron

WORKDIR /app

COPY services/publisher/twitter/package.json /app

RUN npm install --verbose

ADD services/publisher/twitter/ /app

CMD npm start
