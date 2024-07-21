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
        if (i.customId != "rreopen") return;
        const database = await require("../../db.js")
        const db = await database.db("tickets")
        const client = require("../../client.js")
        var canale = client.channels.cache.get(interaction.message.embeds[0].fields[1].value)

        if (!canale) return interaction.reply({ content: "The ticket has been deleted" })
        canale.send({
            embeds: [new Discord.EmbedBuilder()
                .setTitle("Request for reopening")
                .setDescription(`${interaction.user.username}  has requested to reopen the ticket`)
                .setColor("#FFFF00")
                .addFields({ name: "User", value: `${interaction.user.username} - ${interaction.user.tag}\nID: ${interaction.user.id}` })]
        })

        interaction.reply({ content: "Your request has been sent" })
        interaction.message.edit({ components: [new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder().setLabel("Request to Reopen").setStyle("1").setCustomId("reopen").setDisabled(true))] })

    }
}