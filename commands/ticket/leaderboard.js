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

function getBestStaff(userstatsList) {
    let bestStaffID = null;
    let bestAvgStars = 0;
    let mostFeedbacks = 0;
  
    userstatsList.forEach(userstats => {
      const feedbacks = userstats.feedbacks;
      const feedbacksCount = feedbacks.length;
      if (feedbacksCount > mostFeedbacks) {
        mostFeedbacks = feedbacksCount;
        bestStaffID = userstats.userID;
        bestAvgStars = feedbacks.reduce((sum, feedback) => sum + feedback.stars, 0) / feedbacksCount;
      } else if (feedbacksCount === mostFeedbacks) {
        const avgStars = feedbacks.reduce((sum, feedback) => sum + feedback.stars, 0) / feedbacksCount;
        if (avgStars > bestAvgStars) {
          bestStaffID = userstats.userID;
          bestAvgStars = avgStars;
        }
      }
    });
  
    return bestStaffID;
  }
  

module.exports = {
    name: "leaderboard",
    description: "Shows the best staff members",
    async execute(interaction) {
        const databasePromise = await require("../../db.js")
        const db = await databasePromise.db("tickets")
        const client = require("../../client.js")
        const config = await db.collection("config").findOne({ serverID: interaction.guild.id })

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

                let utente = client.guilds.cache.get(interaction.guild.id).members.cache.find(x => x.id == leaderboardListStars[i].userID);
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

                let utente = client.guilds.cache.get(interaction.guild.id).members.cache.find(x => x.id == leaderboardListCount[i].userID);
                if (utente) leaderboardCount += `${utente.toString()} - **Count ${countProps(leaderboardListStars[i].feedbacks)}** (Average: ${calculateAverage(leaderboardListStars[i].feedbacks)})\n`
            }
        }


        let beststaff = "Error"

        let utente = client.guilds.cache.get(interaction.guild.id).members.cache.find(x => x.id == getBestStaff(userstatsList))
        if (utente) beststaff = utente

        let embed = new Discord.EmbedBuilder()
            .setTitle(":trophy: Feedback Leaderboard :trophy:")
            .setColor("#ffc400")
            .setDescription("Best staff: " + beststaff.toString())
            .addFields({ name: "Average", value: leaderboardStars }, { name: "Quantity", value: leaderboardCount })
            .setFooter({ text: `Page ${page}/${totPage}` })

        let button1 = new Discord.ButtonBuilder()
            .setLabel("Previous")
            .setStyle(1)
            .setCustomId("previous")

        let button2 = new Discord.ButtonBuilder()
            .setLabel("Next")
            .setStyle(1)
            .setCustomId("next")

        if (page == 1) button1.setDisabled()
        if (page == totPage) button2.setDisabled()

        let row = new Discord.ActionRowBuilder()
            .addComponents(button1)
            .addComponents(button2)


        interaction.reply({ embeds: [embed], components: [row] })
            .then(msg => {
                const collector = msg.createMessageComponentCollector()
                collector.on("collect", i => {
                    i.deferUpdate()

                    if (i.user.id != interaction.user.id) return i.reply({ content: "You can't use this button", ephemeral: true })
                        
                    if (i.customId == "previous") {
                        page--
                        if (page < 1) page = 1
                    }
                    if (i.customId == "next") {
                        page++
                        if (page > totPage) page = totPage
                    }

                    let leaderboardListStars = userstatsList.sort(function (a, b) { return calculateAverage(b.feedbacks) - calculateAverage(a.feedbacks) })
                    let leaderboardStars = ""


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

                            let utente = client.guilds.cache.get(interaction.guild.id).members.cache.find(x => x.id == leaderboardListStars[i].userID);
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

                            let utente = client.guilds.cache.get(interaction.guild.id).members.cache.find(x => x.id == leaderboardListCount[i].userID);
                            if (utente) leaderboardCount += `${utente.toString()} - **Count ${countProps(leaderboardListStars[i].feedbacks)}** (Average: ${calculateAverage(leaderboardListStars[i].feedbacks)})\n`
                        }
                    }
                    beststaffsort = userstatsList.sort(function (a, b) { return (calculateAverage(b.feedbacks) * countProps(b.feedbacks)) - (calculateAverage(a.feedbacks) * countProps(a.feedbacks)) })
                    beststaff = "Error"

                    utente = client.guilds.cache.get(interaction.guild.id).members.cache.find(x => x.id == beststaffsort[1].userID)
                    if (utente) beststaff = utente


                    embed = new Discord.EmbedBuilder()
                        .setTitle(":trophy: Feedback Leaderboard :trophy:")
                        .setColor("#ffc400")
                        .setDescription("Best staff: " + beststaff.toString())
                        .addFields({ name: "Average", value: leaderboardStars }, { name: "Quantity", value: leaderboardCount })
                        .setFooter({ text: `Page ${page}/${totPage}` })

                    let button1 = new Discord.ButtonBuilder()
                        .setLabel("Previous")
                        .setStyle(1)
                        .setCustomId("previous")

                    let button2 = new Discord.ButtonBuilder()
                        .setLabel("Next")
                        .setStyle(1)
                        .setCustomId("next")

                    if (page == 1) button1.setDisabled()
                    if (page == totPage) button2.setDisabled()

                    let row = new Discord.ActionRowBuilder()
                        .addComponents(button1)
                        .addComponents(button2)

                    interaction.editReply({ embeds: [embed], components: [row] })
                })
            })



    },
};