const { EmbedBuilder } = require('discord.js');
//const datacoso = require("../../db.js")
const Discord = require('discord.js');

function countProps(obj) {
    var count = 0;
    for (var p in obj) {
        obj.hasOwnProperty(p) && count++;
    }
    return count;
}

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (interaction.customId != "ticket-new") return;
        const databasePromise = await require("../../db.js")
        const db = await databasePromise.db("tickets")
        const client = require("../../client.js")
        if (interaction.guild.channels.cache.find(canale => canale.topic == `User ID: ${interaction.user.id}`)) {


            var embedwarning = new EmbedBuilder()
                .setTitle("Error 429")
                .setColor('#0099ff')
                .setDescription(`You already have an open ticket!`);


            interaction.reply({ embeds: [embedwarning], ephemeral: true })

            return
        }
        var datacoso = await db.collection("tickets").find({ serverID: interaction.guild.id }).toArray()

        var config = await db.collection("config").findOne({ serverID: interaction.guild.id })

        var ticketnum = countProps(datacoso).toString().padStart(4, '0');
        interaction.guild.channels.create({
            name: "ticket-" + ticketnum,
            type: 0,
            topic: `User ID: ${interaction.user.id}`,
            parent: config.category.open,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [Discord.PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.SendMessages, Discord.PermissionsBitField.Flags.ReadMessageHistory, Discord.PermissionsBitField.Flags.AttachFiles, Discord.PermissionsBitField.Flags.UseApplicationCommands]
                },
                {
                    id: config.staffID,
                    allow: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.UseApplicationCommands]
                }
            ]
        }).then(canale => {
            db.collection("tickets").insertOne({
                userID: interaction.user.id, serverID: interaction.guild.id, ticketID: canale.id, claim: "", claimMsg: "", status: "open"
            })

            var buttonn = new Discord.ButtonBuilder()
                .setURL('https://discord.com/channels/' + interaction.guild.id + '/' + canale.id)
                .setLabel('Go to ticket')
                .setEmoji('🎫')
                .setStyle("Link")

            var roww = new Discord.ActionRowBuilder()
                .addComponents(buttonn);

            interaction.reply({ content: canale.toString(), ephemeral: true, components: [roww] })

            var embedo = new EmbedBuilder()
                .setColor('#22dd22')
                .setTitle('🟢 Ticket Opened')
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp()
                .setDescription(interaction.user.tag + " opened `ticket-" + ticketnum + "`");


            client.channels.cache.get(config.log.ticket).send({ embeds: [embedo] })


            var embed = new Discord.EmbedBuilder()
                .setTitle("Submit your support request to us!")
                .setColor("#0099ff")
                .setDescription("Hi, Welcome to your ticket! \nSelect your topic from the menu below, \n either a Ticket Staffer or an Administrator will get back to you as soon as possible!")


            var menu = new Discord.SelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Select a topic')
                .addOptions()

            config.ticketCategories.forEach(category => {
                menu.addOptions([
                    {
                        label: category.label,
                        description: category.description,
                        value: category.value,
                        emoji: category.emoji
                    }
                ])
            })


            if (interaction.user.id == "462339171537780737" || interaction.user.id == "536289373365338147" || interaction.user.id == "1022620526314786817") {
                menu.addOptions([
                    {
                        label: '👁‍🗨 Test',
                        description: 'Test ticket',
                        value: 'tickett',
                    }
                ])
            }

            const row = new Discord.ActionRowBuilder()
                .addComponents(menu);

            canale.send({ content: "<@" + interaction.user.id + ">, a <@&" + config.staffID + "> will arrive as soon as possible", embeds: [embed], components: [row] })
        })
    },
};