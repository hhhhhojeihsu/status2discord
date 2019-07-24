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
  client.user.setPresence({
    game: {
      name: 'Monitoring status',
      type: 'WATCHING'
    }
  });
  channel = client.channels.find(val => val.name === config.S2D_CHANNEL.replace('#', '') && val.type === 'text');
});

client.login(config.S2D_TOKEN);

// Run command based on interval
async function run_command() {
  var output = "";
  for(let command_idx = 0; command_idx < config.S2D_COMMAND.length; ++command_idx)
  {
    var err_flag = 0;
    var stdstream;
    console.log(Date.now())

    try
    {
      stdstream = await exec(config.S2D_COMMAND[command_idx]);
    }
    catch(err)
    {
      console.log('non-zero return value');
      err_flag = 1;
    }
    if(err_flag === 1)
    {
      output += set_status_down(command_idx, 1, 0);
      err_flag = 0;
    }
    else
    {
      var compare_target = (config.S2D_EXPECTED[command_idx]['output'] === 'stdout') ? stdstream['stdout'] : stdstream['stderr'];
      if(compare_target === config.S2D_EXPECTED[command_idx]['context'])
      {
        output += set_status_up(command_idx);
      }
      else //compare_target !== config.S2D_EXPECTED[command_idx]['context']
      {
        output += set_status_down(command_idx, 0, stdstream);
      }
    }
    console.log('---');
  }
  if(output !== "")
    channel.send(output);
  return;
}

function set_status_up(idx)
{
  var output = "";
  switch(status[idx])
  {
    case 0:
    case 1:
      status[idx] = 2;
      output = "[:white_check_mark:] " + config.S2D_STATUS[idx][0] + "\n";
    case 2:
    default:
      break;
  }
  console.log(config.S2D_STATUS[idx][0]);

  return output;
}

function set_status_down(idx, err, stdstream)
{
  var output = "";
  switch(status[idx])
  {
    case 1:
    case 2:
      status[idx] = 0;
      output = "[:x:] " + config.S2D_STATUS[idx][1] + "\n";
    case 0:
    default:
      break;
  }

  if(err === 0)
  {
    console.log('stdout: ', stdstream['stdout']);
    console.log('stderr: ', stdstream['stderr']);
  }
  console.log(`expected: `, config.S2D_EXPECTED[idx]['context']);

  return output;
}

setInterval(function () {
  run_command();
}, check_interval);

