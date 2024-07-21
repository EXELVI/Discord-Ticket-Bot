require('events').EventEmitter.prototype._maxListeners = 200;

//Other
"use strict"; //We are using strics for use the json file in future
const Discord = require("discord.js")

const client = new Discord.Client({
    intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildVoiceStates, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.GuildPresences, Discord.GatewayIntentBits.GuildMessageReactions, Discord.GatewayIntentBits.DirectMessages, Discord.GatewayIntentBits.GuildMembers, Discord.GatewayIntentBits.MessageContent],
    partials: [Discord.Partials.Channel, Discord.Partials.Message, Discord.Partials.Reaction, Discord.Partials.User, Discord.Partials.GuildMember, Discord.Partials.ThreadMember, Discord.Partials.Reaction]
});


const packageJSON = require("./package.json");
const discordJSVersion = packageJSON.dependencies["discord.js"];
console.log("Siamo in V" + discordJSVersion)
require('dotenv').config()
const crypto = require("crypto")

client.on("ready", async () => {


    var button1T = new Discord.ButtonBuilder()
        .setLabel("🇮🇹 Ticket Supporto")
        .setCustomId("Ticket-it")
        .setStyle("1")

    var rowT = new Discord.ActionRowBuilder()
        .addComponents(button1T)

    var embedT = new Discord.EmbedBuilder()
        .setTitle("🎫 Ticket")
        .setColor("#0099ff")
        .setDescription("Press the button below to open a ticket")


    client.channels.cache.get("1264552737283117087").send({ embeds: [embedT], components: [rowT] })


})


client.login(process.env.token)