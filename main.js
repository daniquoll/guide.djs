const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config.json');

bot.on('message', async message => {
    let prefix = config.prefix;

    if (message.content.startsWith(prefix + 'Hello')) {
        message.channel.send('Hello!')
    }
});

bot.login(config.token);
bot.on('ready', () => {
    console.log(`${bot.user.username} online`);
    bot.user.setPresence({status: 'dnd', game:{name: 'test', type: 0}});
});