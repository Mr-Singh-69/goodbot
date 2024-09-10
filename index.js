const { Client, GatewayIntentBits, Collection } = require("discord.js");
const keepAlive = require('./keep_alive.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// Load commands and events
client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, '/commands')).filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync(path.join(__dirname, '/events')).filter(file => file.endsWith('.js'));

// Load commands dynamically
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// Load events dynamically
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Keep-alive script
keepAlive();

// Login to Discord
client.login(process.env.token);
