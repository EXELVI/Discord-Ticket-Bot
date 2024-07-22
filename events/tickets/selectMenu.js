const Discord = require("discord.js");


module.exports = {
    name: "interactionCreate",
    /**
     *                  
     * @param {Discord.BaseInteraction} interaction 
     * @returns void 
     */
    async execute(interaction) {
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId != "select") return;
        const database = await require("../../db.js")
        const db = await database.db("tickets")
        const client = require("../../client.js")
        const config = await db.collection("config").findOne({ serverID: interaction.guild.id })

        if (interaction.values[0] == "tickett") {

            var embed = new Discord.EmbedBuilder()
                .setTitle("👁‍🗨 Testing 👁‍🗨")
                .setColor("#f8f800")
                .setDescription("This is a test ticket, this ticket is used to test the ticket system and its features")

            interaction.message.edit({ embeds: [embed] }).then(() => {
                interaction.deferUpdate()
            })
        } else {
            var category = config.ticketCategories.find(x => x.value == interaction.values[0])

            var embed = new Discord.EmbedBuilder()
                .setTitle(category.emoji + " " + category.label + " " + category.emoji)
                .setColor(category.color)
                .setDescription(category.embedDescription)



            interaction.message.edit({ embeds: [embed] }).then(() => {
                interaction.deferUpdate()
            })
        }


    }
}