const Discord = require('discord.js');

async function end(user, collected, stars, col, interaction) {
    var settings = await db.collection("settings").findOne({ type: "settings" });
    var staffUser = await client.users.fetch(user)

    var job = collected.first().content
    var valutazione = stars
    var consigli = col.first().content
    var embed = new Discord.EmbedBuilder()
        .setTitle("Feedback")
        .setDescription(`${interaction.user.toString()} sent the following feedback:`)
        .addFields({ name: "Staffer", value: staffUser.toString() },
            { name: "Type of help", value: job },
            { name: "Rating (1 to 5)", value: valutazione },
            { name: "Suggestions", value: consigli })
        .setColor("#FFFF00")
        .setTimestamp();

    client.channels.cache.get(settings.canali.feedback).send({ embeds: [embed] });

    var feed = {
        feedbackID: getRandomIntInclusive(100000, 999999),
        job: job,
        stars: parseFloat(valutazione),
        suggestions: consigli,
        date: new Date().getTime(),
        by: interaction.user.id
    }
    var userdb = await db.collection("feedbacks").findOne({ userID: staffUser.id })
    if (!userdb) {
        db.collection("feedbacks").insertOne({ userID: staffUser.id, feedbacks: [feed] })
        userdb = await db.collection("feedbacks").findOne({ userID: staffUser.id })
    } else {
        db.collection("feedbacks").updateOne({ userID: staffUser.id }, { $push: { feedbacks: feed } })
    }
    interaction.channel.send(`Thank you for your time!`);
}
module.exports = {
    name: `interactionCreate`,
    async execute(interaction) {
        const db = await require("../../db.js")
        var settings = await db.collection("settings").findOne({ type: "settings" });
        if (!interaction.isButton()) return
        if (!interaction.customId.startsWith("feedbackstars-")) return
        let stars = interaction.customId.split("-")[1]

        var star1 = [new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder().setDisabled().setLabel("⭐").setStyle("3").setCustomId("feedbackstars-1")).addComponents(new Discord.ButtonBuilder().setDisabled().setLabel("⭐").setStyle("1").setCustomId("feedbackstars-2")).addComponents(new Discord.ButtonBuilder().setDisabled().setLabel("⭐").setStyle("1").setCustomId("feedbackstars-3")).addComponents(new Discord.ButtonBuilder().setDisabled().setLabel("⭐").setStyle("1").setCustomId("feedbackstars-4")).addComponents(new Discord.ButtonBuilder().setDisabled().setLabel("⭐").setStyle("1").setCustomId("feedbackstars-5"))]
        var star2 = [new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder().setDisabled().setLabel("⭐").setStyle("3").setCustomId("feedbackstars-1")).addComponents(new Discord.ButtonBuilder().setDisabled().setLabel("⭐").setStyle("3").setCustomId("feedbackstars-2")).addComponents(new Discord.ButtonBuilder().setDisabled().setLabel("⭐").setStyle("1").setCustomId("feedbackstars-3")).addComponents(new Discord.ButtonBuilder().setDisabled().setLabel("⭐").setStyle("1").setCustomId("feedbackstars-4")).addComponents(new Discord.ButtonBuilder().setDisabled().setLabel("⭐").setStyle("1").setCustomId("feedbackstars-5"))]
        var star3 = [new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder().setDisabled().setLabel("⭐").setStyle("3").setCustomId("feedbackstars-1")).addComponents(new Discord.ButtonBuilder().setDisabled().setLabel("⭐").setStyle("3").setCustomId("feedbackstars-2")).addComponents(new Discord.ButtonBuilder().setDisabled().setLabel("⭐").setStyle("3").setCustomId("feedbackstars-3")).addComponents(new Discord.ButtonBuilder().setDisabled().setLabel("⭐").setStyle("1").setCustomId("feedbackstars-4")).addComponents(new Discord.ButtonBuilder().setDisabled().setLabel("⭐").setStyle("1").setCustomId("feedbackstars-5"))]
        var star4 = [new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder().setDisabled().setLabel("⭐").setStyle("3").setCustomId("feedbackstars-1")).addComponents(new Discord.ButtonBuilder().setDisabled().setLabel("⭐").setStyle("3").setCustomId("feedbackstars-2")).addComponents(new Discord.ButtonBuilder().setDisabled().setLabel("⭐").setStyle("3").setCustomId("feedbackstars-3")).addComponents(new Discord.ButtonBuilder().setDisabled().setLabel("⭐").setStyle("3").setCustomId("feedbackstars-4")).addComponents(new Discord.ButtonBuilder().setDisabled().setLabel("⭐").setStyle("1").setCustomId("feedbackstars-5"))]
        var star5 = [new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder().setDisabled().setLabel("⭐").setStyle("3").setCustomId("feedbackstars-1")).addComponents(new Discord.ButtonBuilder().setDisabled().setLabel("⭐").setStyle("3").setCustomId("feedbackstars-2")).addComponents(new Discord.ButtonBuilder().setDisabled().setLabel("⭐").setStyle("3").setCustomId("feedbackstars-3")).addComponents(new Discord.ButtonBuilder().setDisabled().setLabel("⭐").setStyle("3").setCustomId("feedbackstars-4")).addComponents(new Discord.ButtonBuilder().setDisabled().setLabel("⭐").setStyle("3").setCustomId("feedbackstars-5"))]

        function getStarsArray(stars) {
            switch (stars) {
                case "1":
                    return star1
                case "2":
                    return star2
                case "3":
                    return star3
                case "4":
                    return star4
                case "5":
                    return star5
            }
        }

        interaction.message.edit({ components: getStarsArray(stars) })

        interaction.channel.send("How did the user help you?").then(async () => {

            await interaction.deferUpdate();

            var filter = author => author.id != "1133848954333827242"

            interaction.channel.awaitMessages({ filter, max: 1, time: 120000, errors: ['time'] })
                .then(collected => {

                    interaction.channel.send(`Would you give advice to the user?`).then(() => {


                        interaction.channel.awaitMessages({ filter, max: 1, time: 120000, errors: ['time'] })
                            .then(async col => {
                                end(interaction.message.embeds[0].fields[0].value, collected, stars, col, interaction)
                            })
                            .catch(col => {
                                interaction.followUp('Time out!');
                            });
                    })
                })
                .catch(collected => {
                    interaction.followUp('Time out!');
                });
        })

    },
};