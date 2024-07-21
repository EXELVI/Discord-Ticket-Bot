require('events').EventEmitter.prototype._maxListeners = 200;

const Discord = require('discord.js');
const client = require('./client.js');
const fs = require('fs');


//Commands
client.commands = new Discord.Collection();
const commandsFolder = fs.readdirSync("./commands");
for (const folder of commandsFolder) {
    const commandsFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));
    for (const file of commandsFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

//Events
const eventsFolders = fs.readdirSync('./events');
for (const folder of eventsFolders) {
    const eventsFiles = fs.readdirSync(`./events/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of eventsFiles) {
        const event = require(`./events/${folder}/${file}`);
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}



client.on("interactionCreate", async interaction => {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    if (command.permissions) {
        if (command.permissions.length) {
            if (!interaction.member.permissions.has(command.permissions)) {
                return interaction.reply({ content: "You do not have permission to use this command", ephemeral: true });
            }
        }
    }        
    try {
        command.execute(interaction);
    } catch (error) {
        console.error(error);
        interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
})


client.login(process.env.token);

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
})

process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
})

