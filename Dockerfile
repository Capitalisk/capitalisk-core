FROM node:14

RUN npm i -g lisk-commander@2.2.3

USER root

RUN mkdir -p /capitalisk-core

COPY . /capitalisk-core/
WORKDIR /capitalisk-core

RUN npm install

EXPOSE 7001
EXPOSE 7010

RUN ls

CMD ["node", "index.js"]
