# Leasehold Core
Engine for running vertically scalable Lisk and Leasehold-based nodes and DEX markets. Built using [LDEM](https://github.com/jondubois/ldem).

## Features

- Runs each module in a separate process to make use of all available CPU cores for best performance.
- Can be used to easily create and launch custom Lisk-based blockchains using only config changes.
- Custom `lisk-dex` markets can be launched between any two running blockchains using only config changes - This allows any sidechain to be instantly tradable.
- The network module can also be duplicated using only config changes for maximum node resilience.
- Module crashes are isolated from each other.
