const prefix = "#";

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot || !message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Handle basic prefix-based commands
        if (commandName === "ping") {
            message.channel.send(`Pong! Latency is ${message.client.ws.ping}ms.`);
        }
        // Add more commands here if needed
    },
};
