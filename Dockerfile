FROM node:boron

EXPOSE 3000

WORKDIR /data

COPY package.json /data

RUN npm install

ADD . /data

CMD npm start
