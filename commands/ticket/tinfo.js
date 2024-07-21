const Discord = require('discord.js');
module.exports = {
  name: "info",
  permissions: ["MANAGE_CHANNELS"],
  description: "Get ticket info",
  async execute(interaction) {
    const database = await require("../../db.js")
    const db = await database.db("tickets")
    const client = require("../../client.js")



    var ticket = await db.collection("tickets").findOne({ ticketID: interaction.channel.id, serverID: interaction.guild.id })

    if (!ticket) return interaction.reply("This ticket does not exist!")

    var nomec = interaction.channel.name
    var userid = interaction.channel.topic.split(" ")[2]
    var utente = await client.users.fetch(userid)

    if (!utente) {
      interaction.reply({ content: 'I didn\'t find the user', ephemeral: true });
      return;
    }
    var utenteclaim
    if (ticket.claim) utenteclaim = await client.users.fetch(ticket.claim)
    if (!utenteclaim) {
      utenteclaim = "No one"
    } else utenteclaim = utenteclaim.tag


    let embed = new Discord.EmbedBuilder()
      .setColor('#0088ff')
      .setTitle('🔵 Ticket Info')
      .setTimestamp()
      .setDescription("Here is the information on `" + nomec + "`")
      .addFields({ name: "User:", value: utente.tag },
        { name: "User ID:", value: userid },
        { name: "Ticket ID:", value: interaction.channel.id },
        { name: "Claimed by:", value: utenteclaim },
        { name: "Status:", value: ticket.status })
      .setThumbnail(utente.displayAvatarURL())

    interaction.reply({ embeds: [embed] })



  },
};