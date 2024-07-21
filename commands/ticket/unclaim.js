const Discord = require('discord.js');
module.exports = {
    name: "unclaim",
    onlyInside: true,
    onlyStaff: true,
    description: "unclaima un ticket",
    async execute(interaction) {
        const database = await require("../../db.js")
        const db = await database.db("tickets")
        const config = await db.collection("config").findOne({ serverID: interaction.guild.id })
        const client = require("../../client.js")
        var ticket = await db.collection("tickets").findOne({ ticketID: interaction.channel.id })
        if (!ticket) return interaction.reply("This ticket does not exist!")
        var user2 = await interaction.guild.members.cache.get(ticket.claim)
        if (!ticket.claim) return interaction.reply("This ticket is not claimed!")
        if (interaction.member.roles.highest.comparePositionTo(user2.roles.highest) > 0 || interaction.user.id == ticket.claim) {
            db.collection("tickets").updateOne({ ticketID: interaction.channel.id }, { $set: { claim: null } })
            interaction.reply("Ticket unclaimed!")
            interaction.channel.messages.fetch(ticket.claimMsg).then(msg => {
                msg.delete().catch({})
            }).catch({})
            let embed = new Discord.EmbedBuilder()
                .setColor('#ffdd00')
                .setTitle('UnClaim')
                .setAuthor({ name: interaction.member.user.tag, iconURL: interaction.member.user.displayAvatarURL() })
                .setDescription("UnClaim by " + interaction.member.user.tag + " | Ticket: " + interaction.channel.name)
                .setTimestamp()

            client.channels.cache.get(config.log.ticket).send({ embeds: [embed] })


        } else {
            error(interaction, "You do not have permissions to unclaim this ticket")
        }


    },
};