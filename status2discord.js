'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// Load config
const config = require('./config.json');
var check_interval = config.S2D_INTERVAL * 60 * 1000;
// 0 -> Down, 1 -> Unknown, 2 -> Up
var status = Array(config.S2D_COMMAND.length).fill(1);
var channel;

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
  channel = client.channels.find('name', config.S2D_CHANNEL.replace('#', ''));
});

client.login(config.S2D_TOKEN);

// Run command based on interval
async function run_command() {
  for(let command_idx = 0; command_idx < config.S2D_COMMAND.length; ++command_idx)
  {
    const { stdout, stderr } = await exec(config.S2D_COMMAND[command_idx]);
    var compare_target;
    if(config.S2D_EXPECTED[command_idx]['output'] === 'stdout')
    {
      compare_target = stdout;
    }
    else // config.S2D_EXPECTED[command_idx]['output'] === 'stderr'
    {
      compare_target = stderr;
    }
    console.log(Date.now())
    if(compare_target === config.S2D_EXPECTED[command_idx]['context'])
    {
      console.log(config.S2D_STATUS[command_idx][0]);
    }
    else
    {
      console.log('stdout: ', stdout);
      console.log('stderr: ', stderr);
      console.log(`expected${config.S2D_EXPECTED[command_idx]['output']}: `, config.S2D_EXPECTED[command_idx]['context']);
    }
    console.log('---')
  }
}

setInterval(function () {
  run_command();
}, check_interval);

