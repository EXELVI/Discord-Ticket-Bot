const Discord = require('discord.js');

function calculateAverage(myArray) { //MODIFICATO

    var i = 0, summ = 0, ArrayLen = countProps(myArray)//myArray.length;
    while (i < ArrayLen) {
        summ = summ + myArray[i++].stars;
    }
    return summ / ArrayLen;
}

module.exports = {
    name: "leaderboard",
    onlyStaff: true,
    onlyInside: true,
    description: "Shows the best staff members",
    async execute(interaction) {
        const databasePromise = await require("../../db.js")
        const db = await databasePromise.db("tickets")
        const client = require("../../client.js")
        const settings = await db.collection("config").findOne({ serverID: interaction.guild.id })

        let userstatsList = await db.collection("feedbacks").find().toArray();

        let leaderboardListStars = userstatsList.sort(function (a, b) { return calculateAverage(b.feedbacks) - calculateAverage(a.feedbacks) })
        let leaderboardStars = ""

        let totPage = Math.ceil(leaderboardListStars.length / 7)
        let page = 1;

    

    },
};