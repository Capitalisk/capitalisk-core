# Capitalisk Core
Standalone Capitalisk node. Built using [LDEM](https://github.com/jondubois/ldem).

# Install Node
- Follow https://github.com/nvm-sh/nvm to install nvm.
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

# Clone the code 
```shell script
git clone https://github.com/Capitalisk/capitalisk-core
```
- At project root, execute command
```shell script
nvm use 
```

# Start the node 
1. Starting testnet node
- Make sure docker installed on the system https://docs.docker.com/get-docker/
- To install docker on linux follow - https://docs.docker.com/engine/install/ubuntu/
- Starting postgres db
```shell script
yarn start postgres:testnet:start
```
- Overwrite testnet config from templates/config-testnet.json to root config.json & start the node
```shell script
cat templates/config-testnet.json > config.json 
yarn start
```
- Wait for 5 mins for node to sync (Ignoring initial warnings/errors)

2. Starting mainnet node
- Documentation coming soon ...

# Enabling logging for node
- Log level can be changed under `logger` section.
i.e. to error, info
- Logger section can be added under `capitalisk_chain`.

# Installing native postgres
Follow https://www.postgresql.org/download/ to install postgres on the linux/windows/mac.
