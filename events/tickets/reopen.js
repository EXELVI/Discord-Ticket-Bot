const Discord = require("discord.js");

function convert(integer) {
    var str = Number(integer).toString(16);
    return str.length == 1 ? "0" + str : str;
};
//const datacoso = require("../../db.js")

function to_rgb(r, g, b) { return "#" + convert(r) + convert(g) + convert(b); }
module.exports = {
    name: "interactionCreate",
    
    async execute(i) {
        if (!i.isButton()) return;
        if (i.customId != "reopen") return;
        const database = await require("../../db.js")
        const db = await database.db("tickets")
        const client = require("../../client.js")
        var config = await db.collection("config").findOne({ serverID: i.guild.id })

        i.deferUpdate()
        var utente = await client.users.fetch(i.channel.topic.split(" ")[2])
        i.channel.edit({
            parent: config.category.open,
            permissionOverwrites: [
                {
                    id: utente.id,
                    allow: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.SendMessages, Discord.PermissionsBitField.Flags.ReadMessageHistory, Discord.PermissionsBitField.Flags.AttachFiles, Discord.PermissionsBitField.Flags.UseApplicationCommands]
                },
                {
                    id: i.guild.id,
                    deny: [Discord.PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: config.staffID,
                    allow: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.UseApplicationCommands]
                }
            ]
        })
        var button1 = new Discord.ButtonBuilder()
        .setLabel("Delete")
        .setCustomId("delete")
        .setStyle("4");


    var button2 = new Discord.ButtonBuilder()
        .setLabel("Reopen")
        .setCustomId("reopen")
        .setStyle("1");

        button1.setDisabled()
        button2.setDisabled()

    var row = new Discord.ActionRowBuilder()
        .addComponents(button1)
        .addComponents(button2)


     


        i.message.edit({
            embeds: [new Discord.EmbedBuilder()
                .setColor('#ffff00')
                .setTitle('🟡 Ticket Reopened')
                .setDescription("Your ticket has been reopened")
                .setTimestamp()
                .addFields({ name: "Ticket ID", value: i.channel.id })
                
            ], components: [row]
        })
        db.collection("tickets").updateOne({ ticketID: i.message.channel.id }, { $set: { status: "open" } })

    }
}