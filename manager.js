const Discord = require('discord.js');
const { ShardingManager } = require('discord.js');

module.exports = new ShardingManager('./bot.js', { token: process.env.token });