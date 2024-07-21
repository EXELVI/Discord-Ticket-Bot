const Discord = require('discord.js');

module.exports = new Discord.Client({
    intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildVoiceStates, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.GuildPresences, Discord.GatewayIntentBits.GuildMessageReactions, Discord.GatewayIntentBits.DirectMessages, Discord.GatewayIntentBits.GuildMembers, Discord.GatewayIntentBits.MessageContent],
    partials: [Discord.Partials.Channel, Discord.Partials.Message, Discord.Partials.Reaction, Discord.Partials.User, Discord.Partials.GuildMember, Discord.Partials.ThreadMember, Discord.Partials.Reaction],
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true }
});
