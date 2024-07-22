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

app.get('/:guild/:ticket', async (req, res) => {
    var guild = req.params.guild,
        id = req.params.ticket

    const db = (await databasePromise).db("tickets")
    var ticket = await db.collection("tickets").findOne({ ticketID: id, serverID: guild })
    if (!ticket) return res.render("error", { error: "Not Found", code:"404", errormessage: "The ticket does not exist", textcolor: "secondary", color: "#333f73" });
    res.render("ticket", { ticket: ticket })
});

app.get('/transcript/:guild/:ticket', async (req, res) => {
    var guild = req.params.guild,
        id = req.params.ticket

    const db = (await databasePromise).db("tickets")
    var ticket = await db.collection("tickets").findOne({ ticketID: id, serverID: guild })
    if (!ticket) return res.send("The ticket does not exist")
    if (!fs.existsSync(`transcripts/${guild}`)) return res.send("The transcript does not exist")
    if (!fs.existsSync(`transcripts/${guild}/${id}.html`)) return res.send("The transcript does not exist")
    
    res.sendFile(path.join(__dirname + `/transcripts/${guild}/${id}.html`))
});

app.use(apiPrefix, router);

app.use((err, req, res, next) => {
    if (!err) {
        res.status(404).render("error", { error: "Not Found", code:"404", errormessage: "The page you are looking for does not exist", textcolor: "primary", color: "#003f83" });
    } else {
        res.status(500).render("error", { error: "Internal Server Error", code:"500", errormessage: "An error occurred while processing your request", textcolor: "danger", color: "#dc3545" });
    }  
})

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