//const datacoso = require("../../db.js")
const Discord = require("discord.js")
function convert(integer) {
    var str = Number(integer).toString(16);
    return str.length == 1 ? "0" + str : str;
};

function to_rgb(r, g, b) { return "#" + convert(r) + convert(g) + convert(b); }


var fs = require("fs").promises
module.exports = {
    name: "close",
    onlyInside: true,
    description: "Close a ticket",
    permissions: ["MANAGE_CHANNELS"],                                                               
    options: [
        {
            name: "reason",
            description: "The reason why you are closing the ticket",
            required: true,
            type: 3
        }],
    onlyStaff: true,
    async execute(interaction) {
        const database = await require("../../db.js")
        const db = await database.db("tickets")
        const client = require("../../client.js")

        var config = await db.collection("config").findOne({ serverID: interaction.guild.id })
        var reason = interaction.options.getString("reason")
        var nomec = interaction.channel.name
       
        if (interaction.channel.name.includes("ticket-")) {
            var utente = await client.users.fetch(interaction.channel.topic.split(" ")[2])
            interaction.channel.edit({
                parent: config.category.closed,
                permissionOverwrites: [
                    {
                        id: utente.id,
                        deny: [Discord.PermissionsBitField.Flags.ViewChannel]
                    },
                    {
                        id: interaction.guild.id,
                        deny: [Discord.PermissionsBitField.Flags.ViewChannel]
                    },
                    {
                        id: config.staffID,
                        allow: [Discord.PermissionsBitField.Flags.ViewChannel]
                    }
                ]
            }).then(i => {
                db.collection("tickets").updateOne({ ticketID: interaction.channel.id, serverID: interaction.guild.id }, { $set: { status: "closed" } })
                var embedo = new Discord.EmbedBuilder()
                    .setColor('#dddd00')
                    .setTitle('🟡 Ticket Closed')
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                    .addFields({ name: "Reason", value: reason })
                    .setTimestamp()
                    .setDescription(interaction.user.tag + " closed `" + nomec + "`");
                client.channels.cache.get(config.log.ticket).send({ embeds: [embedo] })

                utente.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor('#dddd00')
                            .setTitle('🟡 Ticket Closed')
                            .setDescription("Your ticket has been closed, you can request to reopen it if it has not already been deleted")
                            .addFields({ name: "Reason", value: reason }, { name: "Ticket ID", value: interaction.channel.id })
                    ], components: [new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder().setLabel("Request to Reopen").setStyle("1").setCustomId("rreopen"))]
                }).catch({})

                var button1 = new Discord.ButtonBuilder()
                    .setLabel("Delete")
                    .setCustomId("delete")
                    .setStyle("4");


                var button2 = new Discord.ButtonBuilder()
                    .setLabel("Reopen")
                    .setCustomId("reopen")
                    .setStyle("1");

                var row = new Discord.ActionRowBuilder()
                    .addComponents(button1)
                    .addComponents(button2)

                var embed = new Discord.EmbedBuilder()
                    .setTitle("Ticket Closed")
                    .setColor("#dddd00")
                    .setDescription("The ticket has been closed")
                    .addFields({ name: "Reason", value: reason }, { name: "Ticket ID", value: interaction.channel.id })
                    .setFooter({ text: "Ticket ID: " + interaction.channel.id })

                interaction.reply({ embeds: [embed], components: [row] }).then(msg => {
                   
                       

                })


            }).catch(err => {
                correct(interaction, "Error 502", err.toString())
                console.log(err)
            })


        } else {
            error(interaction, "Error", "Non hai il permesso di farlo oppure questo canale non è un ticket!")
        }
    },
};