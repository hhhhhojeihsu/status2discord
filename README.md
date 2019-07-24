# status2discord
Run shell command and send status to discord

## Dependencies
- `node.js`
- `npm`

## Installation

- Clone this repo
- Copy `config.json.smaple` to `config.json`
- Fill in requirements in `config.json`
  - Discord bot token: `S2D_TOKEN`
  - Shell command to execute(list): `S2D_COMMAND`
  - Expected output(list): `S2D_EXPECTED`
  - Status(list): `S2D_STATUS`
  - Check interval in minutes: `S2D_INTERVAL`
  - Channel to send: `S2D_CHANNEL`
- Use system's package manager install `zlib`(development package)
- Run `npm install` to install dependencies
- Run `npm start` to start the service
- Add the bot to your channel

