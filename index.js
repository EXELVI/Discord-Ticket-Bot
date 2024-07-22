//index.js
require('dotenv').config()


const Discord = require('discord.js');
const manager = require('./manager.js');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');

manager.on('shardCreate', shard => console.log(`☑️  Launched shard #${shard.id}`));

manager.spawn();

const databasePromise = require('./db.js');
const client = require('./client.js');
databasePromise.then(() => {
    console.log("🔌 Connected to the database")
}).catch(err => {
    console.error(err)
})

const port = 80;
const port2 = 443;
const apiPrefix = '/api';


var app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors({
    origin: "*"
}));
app.options('*', cors());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(cookieParser());

app.get('/tickets/:guild/:ticket', async (req, res) => {
    var guild = req.params.guild,
        id = req.params.ticket

    const db = (await databasePromise).db("tickets")
    var ticket = await db.collection("tickets").findOne({ ticketID: id, serverID: guild })
    if (!ticket) return res.render("error", { error: "Not Found", code: "404", errormessage: "The ticket does not exist", textcolor: "secondary", color: "#333f73" });
    var channel = await manager.broadcastEval(async (client, { channelID, serverID }) => {
        var server = await client.guilds.cache.get(serverID)
        if (!server) return false
        var channel = await server.channels.cache.get(channelID)
        if (!channel) return false
        return channel
    }, { context: { channelID: id, serverID: guild } });
    var channel = channel.filter(x => x)[0]
    if (!channel) {
        if (!fs.existsSync(`transcripts/${guild}`)) return res.render("error", { error: "Not Found", code: "404", errormessage: "The transcript does not exist", textcolor: "secondary", color: "#433f33" });
        if (!fs.existsSync(`transcripts/${guild}/${id}.html`))  return res.render("error", { error: "Not Found", code: "404", errormessage: "The transcript does not exist", textcolor: "secondary", color: "#433f33" });

        res.sendFile(path.join(__dirname + `/transcripts/${guild}/${id}.html`))

    } else {
   
        res.render("ticket", { ticket: ticket, channel: channel })
    }
});

app.get('/transcript/:guild/:ticket', async (req, res) => {
    var guild = req.params.guild,
        id = req.params.ticket

        var channel = await manager.broadcastEval(async (client, { channelID, serverID }) => {
            var server = await client.guilds.cache.get(serverID)
            if (!server) return false
            var channel = await server.channels.cache.get(channelID)
            if (!channel) return false
            return channel
        }, { context: { channelID: id, serverID: guild } });
        var channel = channel.filter(x => x)[0]
        if (!channel) {
            if (!fs.existsSync(`transcripts/${guild}`)) return res.render("error", { error: "Not Found", code: "404", errormessage: "The transcript does not exist", textcolor: "secondary", color: "#433f33" });
            if (!fs.existsSync(`transcripts/${guild}/${id}.html`))  return res.render("error", { error: "Not Found", code: "404", errormessage: "The transcript does not exist", textcolor: "secondary", color: "#433f33" });
    
            res.sendFile(path.join(__dirname + `/transcripts/${guild}/${id}.html`))
    
        } else {
            var transcript = await manager.broadcastEval(async (client, { channelID, serverID }) => {
                const discordTranscripts = require('discord-html-transcripts');            
                var server = await client.guilds.cache.get(serverID)
                if (!server) return false
                var channel = await server.channels.cache.get(channelID)
                if (!channel) return false
                return await discordTranscripts.createTranscript(channel, { poweredBy: false, footerText: "{number} message{s} ", returnType: "string", saveImages: true });
            }, { context: { channelID: id, serverID: guild } });
    
            var transcript = transcript.filter(x => x)[0]
            if (!transcript) return res.render("error", { error: "Not Found", code: "404", errormessage: "The transcript does not exist", textcolor: "secondary", color: "#433f33" });
            res.send(transcript)
        }
});



app.use(apiPrefix, router);

var httpServer = http.createServer(app);
var httpsServer = https.createServer({
    key: fs.readFileSync('localhost.key'),
    cert: fs.readFileSync('localhost.crt')
}, app);

httpServer.listen(port, () => {
    console.log('HTTP Server running on port ' + port)
});

httpsServer.listen(port2, () => {
    console.log('HTTPS Server running on port ' + port2)
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
});