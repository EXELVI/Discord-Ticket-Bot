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
    async execute(interaction, client) {
        const database = await require("../../db.js")
        const db = await database.db("tickets")

        var config = await db.collection("config").findOne({ serverID: interaction.guild.id })
        var reason = interaction.options.getString("reason")
        var nomec = interaction.channel.name
       

    },
};