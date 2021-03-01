FROM node:14

RUN mkdir -p /capitalisk-core

COPY . /capitalisk-core/
WORKDIR /capitalisk-core

RUN npm install

EXPOSE 7001
EXPOSE 7010

CMD ["node", "index.js"]
