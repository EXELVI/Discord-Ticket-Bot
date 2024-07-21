const Discord = require('discord.js');
const { permission } = require('process');
module.exports = {
    name: "claim",
    permissions: ["MANAGE_CHANNELS"],
    description: "Claim a ticket",
    async execute(interaction, client) {
        const database = await require("../../db.js")
        const db = await database.db("tickets")
        
        var config = await db.collection("config").findOne({ serverID: interaction.guild.id })

        var embed = new Discord.EmbedBuilder()
            .setColor('#ffdd00')
            .setTitle('Claim')
            .setAuthor({ name: interaction.member.user.tag, iconURL: interaction.member.user.displayAvatarURL() })
            .setDescription(`The ticket has been claimed by ${interaction.member.user.tag}`)
            .setTimestamp()

        var ticket = await db.collection("tickets").findOne({ ticketID: interaction.channel.id, serverID: interaction.guild.id })

        if (!ticket) return interaction.reply("Ticket not found")

        if (ticket.claim) {
            interaction.reply("Ticket already claimed, use /unclaim first")
            return
        }


        interaction.channel.send({ embeds: [embed] }).then(msg => {
            db.collection("tickets").updateOne({ ticketID: interaction.channel.id, serverID: interaction.guild.id }, { $set: { claim: interaction.member.user.id, claimMsg: msg.id } })
            interaction.reply("Ok!")

        })

        embed = new Discord.EmbedBuilder()
            .setColor('#ffdd00')
            .setTitle('Claim')
            .setAuthor({ name: interaction.member.user.tag, iconURL: interaction.member.user.displayAvatarURL() })
            .setDescription("Claim by " + interaction.member.user.tag + " | Ticket: " + interaction.channel.name)
            .setTimestamp()

        client.channels.cache.get(config.log.ticket).send({ embeds: [embed] })

    },
};