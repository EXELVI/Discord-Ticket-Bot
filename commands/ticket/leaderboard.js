const Discord = require('discord.js');

function countProps(obj) {
    var count = 0;
    for (var p in obj) {
        obj.hasOwnProperty(p) && count++;
    }
    return count;
}

function calculateAverage(myArray) {

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

        for (let i = 7 * (page - 1); i < 7 * page; i++) {
            if (leaderboardListStars[i]) {
                switch (i) {
                    case 0:
                        leaderboardStars += ":first_place: ";
                        break
                    case 1:
                        leaderboardStars += ":second_place: "
                        break
                    case 2:
                        leaderboardStars += ":third_place: "
                        break
                    default:
                        leaderboardStars += `**#${i + 1}** `
                }

                let utente = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == leaderboardListStars[i].userID);
                if (utente) leaderboardStars += `${utente.toString()} - **Average ${calculateAverage(leaderboardListStars[i].feedbacks)}** (Count: ${countProps(leaderboardListStars[i].feedbacks)})\n`
            }
        }

        let leaderboardListCount = userstatsList.sort(function (a, b) { return countProps(b.feedbacks) - countProps(a.feedbacks) })
        let leaderboardCount = ""

        for (let i = 7 * (page - 1); i < 7 * page; i++) {
            if (leaderboardListCount[i]) {
                switch (i) {
                    case 0:
                        leaderboardCount += ":first_place: ";
                        break
                    case 1:
                        leaderboardCount += ":second_place: "
                        break
                    case 2:
                        leaderboardCount += ":third_place: "
                        break
                    default:
                        leaderboardCount += `**#${i + 1}** `
                }

                let utente = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == leaderboardListCount[i].userID);
                if (utente) leaderboardCount += `${utente.toString()} - **Count ${countProps(leaderboardListStars[i].feedbacks)}** (Average: ${calculateAverage(leaderboardListStars[i].feedbacks)})\n`
            }
        }

        

    },
};