const Discord = require('discord.js');
const fs = require('fs');

const discordTranscripts = require('discord-html-transcripts');

module.exports = {
  name: "interactionCreate",

  async execute(i) {
    if (!i.isButton()) return;
    if (i.customId != "delete") return;
    const database = await require("../../db.js")
    const db = await database.db("tickets")
    const client = require("../../client.js")
    var config = await db.collection("config").findOne({ serverID: i.guild.id })
    var nomec = i.message.channel.name

    const attachment = await discordTranscripts.createTranscript(i.channel, { poweredBy: false, footerText: "{number} message{s} ", saveImages: true });


    var ticket = await db.collection("tickets").findOne({ ticketID: i.message.channel.id })
    if (!ticket) return i.reply("The ticket was not found in the database, please contact the support")

    if (!fs.existsSync(`transcripts/${i.guild.id}`)) {
      fs.mkdirSync(`transcripts/${i.guild.id}`);
    }
    fs.writeFileSync(`transcripts/${i.guild.id}/${i.message.channel.id}.html`, attachment.attachment.toString("utf-8"));


    if (ticket.claim) {
      var utente = await client.users.fetch(i.message.channel.topic.split(" ")[2])
      var user = await client.users.fetch(ticket.claim);
      ticket.claimName = user.tag

      utente.send({
        embeds: [new Discord.EmbedBuilder()
          .setColor('#ffff00')
          .setTitle('Feedback')
          .setDescription("How many stars would you give to the staff that helped you? (1 to 5)")
          .addFields({ name: "Staff ID", value: ticket.claim }, { name: "Staff Name", value: ticket.claimName }, { name: "Server", value: i.guild.id })
        ], components: [new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder().setLabel("⭐").setStyle("1").setCustomId("feedbackstars-1")).addComponents(new Discord.ButtonBuilder().setLabel("⭐").setStyle("1").setCustomId("feedbackstars-2")).addComponents(new Discord.ButtonBuilder().setLabel("⭐").setStyle("1").setCustomId("feedbackstars-3")).addComponents(new Discord.ButtonBuilder().setLabel("⭐").setStyle("1").setCustomId("feedbackstars-4")).addComponents(new Discord.ButtonBuilder().setLabel("⭐").setStyle("1").setCustomId("feedbackstars-5"))]
      }).catch({})
    }
    let embed = new Discord.EmbedBuilder()
      .setTitle("Channel transcript")
      .setDescription(`Transcript of the channel ${i.message.channel.name}`)
      .addFields({ name: "Transcript", value: "[Press here to go to the web transcript](https://localhost/transcript/" + i.message.guild.id + "/" + i.message.channel.id + ")" })

    client.channels.cache.get(config.log.transcript).send({ embeds: [embed] })

    i.deferUpdate()
    i.message.channel.delete()
    var embedo = new Discord.EmbedBuilder()
      .setColor('#dd0000')
      .setTitle('🔴 Ticket deleted')
      .setAuthor({ name: i.user.tag, iconURL: i.user.displayAvatarURL() })
      .setTimestamp()
      .setDescription(i.user.tag + " deleted `" + nomec + "`");
    client.channels.cache.get(config.log.ticket).send({ embeds: [embedo] })

  }
}