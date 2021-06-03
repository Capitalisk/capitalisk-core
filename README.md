# Capitalisk Node
- Standalone Capitalisk node. Built using [LDEM](https://github.com/jondubois/ldem).

## 1. Install Node.js

### 1.1 Installing using `nvm`

- Follow https://github.com/nvm-sh/nvm to install nvm:

```shell script
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
```

```shell script
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

```shell script
nvm install 12.18.2
```

- To install nvm on windows, follow https://github.com/coreybutler/nvm-windows

### 1.2 Installing via snap

```sh
sudo snap install node --channel=14/stable --classic
```

## 2. Install Git

- Full instructions can be found here: https://github.com/git-guides/install-git

```shell script
sudo apt-get install git-all
```

## 3. Clone and setup the capitalisk-core node

- Clone the Git repo to your host:

```shell script
git clone https://github.com/Capitalisk/capitalisk-core
```

- Change directory to the project root:

```shell script
cd capitalisk-core
```

- Install Node.js dependencies:

```shell script
npm install
```

- Note that if you provided a custom password in step 3 instead of the default one (`'password'`), you will need to update the database details inside your main `capitalisk-core/config.json` file to match (so that the node is able to connect to your database).

## 4. Capitalisk node supports multiple databases
- As of now, following databases are supported
1. SQLite - Ready to use out of the box.
2. Postgres - Need to install and configure separate postgres service.

## 4.1 Installing SQLite
- SQLite binaries are automatically installed as a part of `npm install` or `yarn install`.
- Just make sure, no warning or error is thrown while installing npm packages for `sqlite3`.

## 4.2 Install Postgres

### 4.2.1 Installing via Ubuntu repositories

```sh
sudo apt install postgresql
```

### 4.2.2 Installing via PostgreSQL repositories

- Follow https://www.postgresql.org/download/ to install Postgres on linux/windows/mac.

- Steps for Linux Ubuntu/Debian are:

```shell script
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
```

```shell script
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
```

```shell script
sudo apt-get update
```

```shell script
sudo apt-get -y install postgresql
```

## 4.2.3 Setup the Postgres database for the node

- Log into postgres:

```shell script
sudo -u postgres psql -U postgres
```

- Set the password for the `postgres` user:

```
ALTER USER postgres WITH PASSWORD 'password';
```

- Create a new database to hold all the blockchain data:

```
create database capitalisk_main;
```

- Exit the Postgres prompt:

```
\q
```

- Restart the Postgres service

```
sudo service postgresql restart
``` 


## 5. Start the node

### 5.1 PM2

- You can start the node in multiple ways but the simplest way is to use `pm2`.
- You can install `pm2` with:

```shell script
npm install -g pm2
```

- Launch node for SQLite 
```shell script
pm2 start index.js --name "capitalisk-core-sqlite" -o "/dev/null" -e "/dev/null" -- -c=config.sqlite.json 
```
OR 

- Launch the node for postgres:

```shell script
pm2 start index.js --name "capitalisk-core" -o "/dev/null" -e "/dev/null"
```

- Make sure log size doesn't exceed storage capacity of the machine.
- PM2 doesn't have a native check for maximum log file size, so it can terminate node due to log size exceeding storage capacity
- Install [PM2 log rotation module](https://github.com/keymetrics/pm2-logrotate), to limit log size and allow log file rotations.
```
  pm2 install pm2-logrotate
```
- Default max log file size limit is 10MB after module is installed, follow official README to change the limit.

### 5.2 Systemd

- You can add an entry to `systemd`, that way the system easily restarts the process both on failure and reboot.

Adding an entry to `systemd`:

```sh
sudo nano /lib/systemd/system/capitalisk-core.service
```

And paste:

```sh
[Unit]
Description=capitalisk-core
After=network.target
[Service]
Type=simple
User=<user>
# If using snap it should be /snap/bin/node ...
ExecStart=/bin/node /home/<user>/capitalisk-core/index.js
Restart=on-failure
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=capitalisk-core
[Install]
WantedBy=multi-user.target
```

Let's enable and restart the daemons:

```sh
sudo systemctl enable capitalisk-core
sudo systemctl daemon-reload
sudo systemctl restart rsyslog
```

Capitalisk will need a directory to write logs to. Using `systemd` it uses `/logs/mainnet`:

```sh
sudo mkdir -p /logs/mainnet
sudo chown -R <user>:<user> /logs
```

```sh
sude systemctl start capitalisk-core
```

And now you are all set!

## 6.1 Restarting the node

- To restart the node, the command is:

```shell script
pm2 restart capitalisk-core
```

- Note that if you make any changes to the `config.json` file, you will need to restart the node for the changes to take effect.

## 6.2 Stopping the node

- If you want to shut down the code, you can use the command:

```shell script
pm2 delete capitalisk-core
```

## 6.3 Enabling logging for node

- Log level can be changed under the `logger` section of `config.json` under the `capitalisk_chain` module entry - Possible values include: `error`, `debug` or `info`.

## 7. Check status of the node
### 7.1 Using ldpos-commander (https://github.com/Capitalisk/ldpos-commander)
- Install ldpos commander using 
```shell script
npm i -g ldpos-commander
```
- Run below command to get node block height, since node is syncing, height should keep changing. i.e. Should keep increasing
```shell script
ldpos IP_ADDRESS:8001 block get max-height
```
PS. Please change port, if changed in the config.

### 7.2 Using logs
- By default, CLSK node should work without any issues. 
- If `pm2 ls` shows red status for any of the spawned process, it means we need to check logs for exact error.
- Edit either `config.json` (in case of postgres) or `config.sqlite.json` (in case of SQLite) using nano, and replace `error` with `info` for logging, save file.
- Run `pm2 logs`, one of the statements should contain `Received valid block ...`, it means node is syncing and working just fine.

