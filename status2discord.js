'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// Load config
const config = require('./config.json');
var check_interval = config.S2D_INTERVAL * 60 * 1000;

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.login(config.S2D_TOKEN);

// Run command based on interval
async function run_command() {
  for(let command_idx = 0; command_idx < config.S2D_COMMAND.length; ++command_idx)
  {
    const { stdout, stderr } = await exec(config.S2D_COMMAND[command_idx]);
    console.log(Date.now())
    console.log('command:', config.S2D_COMMAND[command_idx]);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    console.log('---')
  }
}

setInterval(function () {
  run_command();
}, check_interval);

