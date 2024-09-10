const { Client, GatewayIntentBits, Collection } = require('discord.js');
const keepAlive = require('./keep_alive.js');
const fs = require('fs');
const path = require('path');

// Create a new client instance
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// Collection for commands
client.commands = new Collection();

// Dynamically load command files
const commandFiles = fs.readdirSync(path.join(__dirname, '/commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// Dynamically load event files
const eventFiles = fs.readdirSync(path.join(__dirname, '/events')).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Keep the bot alive (if necessary)
keepAlive();

// Log in to Discord
client.login(process.env.token);
