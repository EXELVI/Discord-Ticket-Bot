//index.js
require('dotenv').config()


const Discord = require('discord.js');
const manager = require('./manager.js');

manager.on('shardCreate', shard => console.log(`☑️  Launched shard #${shard.id}`));

manager.spawn();

const databasePromise = require('./db.js');
databasePromise.then(() => {
    console.log("🔌 Connected to the database")
}).catch(err => {
    console.error(err)
})