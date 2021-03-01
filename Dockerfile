FROM ubuntu:20.04

# not to prompt `Configuring tzdata`
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update; \
    apt-get install -qqy git curl wget build-essential gzip lsb-release; \
    curl -sL https://deb.nodesource.com/setup_10.x | bash -; \
    wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - && sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -sc)-pgdg main" > /etc/apt/sources.list.d/PostgreSQL.list'; \
    apt-get update; \
    apt-get install -qqy postgresql-10 nodejs; \
    sed -i 's/max_connections = 100/max_connections = 300/g' /etc/postgresql/10/main/postgresql.conf; \
    sed -i 's/shared_buffers = 128MB/shared_buffers = 256MB/g' /etc/postgresql/10/main/postgresql.conf; \
    npm install pm2 -g; \
    npm i -g lisk-commander@2.2.3

USER postgres

RUN service postgresql start && \
  psql -c "CREATE USER ldpos" && \
  psql -c "ALTER ROLE ldpos WITH SUPERUSER" && \
  psql -c "CREATE DATABASE lisk_main OWNER ldpos" && \
  psql -c "CREATE DATABASE capitalisk_main OWNER ldpos" && \
  psql -c "ALTER USER ldpos WITH PASSWORD 'ldpos'"

USER root

RUN mkdir -p /home/capitalisk/capitalisk-core

COPY . /home/capitalisk/capitalisk-core/
WORKDIR /home/capitalisk/

RUN npm install --prefix ./capitalisk-core; \
    lisk config:set api.nodes http://2.56.213.101:8010/

EXPOSE 5432
EXPOSE 7001
EXPOSE 7010

RUN ls

RUN chmod +x ./capitalisk-core/start.sh

CMD ["./capitalisk-core/start.sh"]
