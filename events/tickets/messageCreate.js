const Discord = require('discord.js');

module.exports = {
    name: "messageCreate",
    async execute(message) {

        if (!message.guild) return

        const client = require('../../client.js');
        const databasePromise = await require('../../db.js');
        const db = await databasePromise.db("tickets")
        const config = await db.collection("config").findOne({ serverID: message.guild.id })


        if (message.channel.id != config.category.open) return
        if (message.author.bot) return

        var nomec = message.channel.name
        var userid = await message.channel.topic.split(" ")[2]



        if (message.author.id == userid) return
        if (!message.member.roles.cache.has(config.staffID)) return


        var ticket = await db.collection("tickets").findOne({ ticketID: message.channel.id })

        if (!ticket) return

        if (ticket.claim) return


        var embed = new Discord.EmbedBuilder()
        .setColor('#ffdd00')
        .setTitle('Claim')
        .setAuthor({ name: interaction.member.user.tag, iconURL: interaction.member.user.displayAvatarURL() })
        .setDescription(`The ticket has been claimed by ${interaction.member.user.tag}`)
        .setTimestamp()


        interaction.channel.send({ embeds: [embed] }).then(msg => {
            db.collection("tickets").updateOne({ ticketID: interaction.channel.id, serverID: interaction.guild.id }, { $set: { claim: interaction.member.user.id, claimMsg: msg.id } })
            interaction.reply("Ok!")

        })

        embed = new Discord.EmbedBuilder()
            .setColor('#ffdd00')
            .setTitle('AutoClaim')
            .setAuthor({ name: interaction.member.user.tag, iconURL: interaction.member.user.displayAvatarURL() })
            .setDescription("Claim by " + interaction.member.user.tag + " | Ticket: " + interaction.channel.name)
            .setTimestamp()

        client.channels.cache.get(config.log.ticket).send({ embeds: [embed] })
    },

};