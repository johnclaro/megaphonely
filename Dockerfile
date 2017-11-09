FROM node:boron

EXPOSE 3000

WORKDIR /data

COPY package.json /data

RUN npm install --verbose

ADD . /data

CMD npm start
