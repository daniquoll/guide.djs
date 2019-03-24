const Discord = require('discord.js')
const fs = require('fs') // подключаем fs к файлу
const bot = new Discord.Client()
const config = require('./config.json')
bot.commands = new Discord.Collection() // создаём коллекцию для команд
const exp = require('./functions/exp.js')

fs.readdir('./commands', (err, files) => { // чтение файлов в папке commands
    if (err) console.log(err)

    let jsfile = files.filter(f => f.split('.').pop() === 'js') // файлы не имеющие расширение .js игнорируются
    if (jsfile.length <= 0) return console.log('Команды не найдены!') // если нет ни одного файла с расширением .js

    console.log(`Loaded ${jsfile.length} commands`)
    jsfile.forEach((f, i) => { // добавляем каждый файл в коллекцию команд
        let props = require(`./commands/${f}`)
        bot.commands.set(props.help.name, props)
    })
})

bot.on('message', async message => {
    let prefix = config.prefix
    let messageArray = message.content.split(' ') // разделение пробелами
    let command = messageArray[0] // команда после префикса
    let args = messageArray.slice(1) // аргументы после команды

    let command_file = bot.commands.get(command.slice(prefix.length)) // получение команды из коллекции
    if (command_file) command_file.run(bot, message, args)

    await exp(message.author)
})

bot.on('messageUpdate', async (oldmsg, newmsg) => {
	 let embed = new Discord.RichEmbed()
		.setAuthor('Сообщение изменено', newmsg.guild.iconURL)
		.addField('Отправитель', oldmsg.member, true)
		.addField('Канал', oldmsg.channel, true)
		.addField('Раньше', oldmsg.content)
		.addField('Сейчас', newmsg.content)
		.setColor(0xe19517)
		.setTimestamp()
	await oldmsg.channel.send(embed)
})

bot.on('messageDelete', async message => {
    let embed = new Discord.RichEmbed()
        .setAuthor('Сообщение удалено', message.guild.iconURL)
        .addField('Отправитель', message.member, true)
        .addField('Канал', message.channel, true)
        .addField('Содержание', message.content)
        .setColor(0xf04747)
        .setTimestamp()
    await message.channel.send(embed)
})

bot.on('guildMemberAdd', async member => {
    let role = member.guild.roles.find(r => r.name == 'Community')
    let channel = member.guild.channels.find(c => c.name == 'actions')

    let embed =  new Discord.RichEmbed()
        .setAuthor('Участник присоединился', member.user.avatarURL)
        .setDescription(`${member.user.username}#${member.user.discriminator} (${member})`)
        .setColor(0x41b581)
        .setFooter(`ID: ${member.id}`)
        .setTimestamp()
    await channel.send(embed)
    await member.addRole(role.id)
})

bot.on('guildMemberRemove', async member => {
    let embed = new Discord.RichEmbed()
        .setAuthor('Участник вышел', member.user.avatarURL)
        .setDescription(`${member.user.username}#${member.user.discriminator} (${member.id})`)
        .setColor(0xf04747)
        .setFooter(`ID: ${member.id}`)
        .setTimestamp()
    let channel = member.guild.channels.find(c => c.name == 'actions')
    await channel.send(embed)
})

bot.login(config.token)
bot.on('ready', () => {
    console.log(`${bot.user.username} online`);
    bot.user.setPresence({status: 'dnd', game:{name: 'test', type: 0}})
})