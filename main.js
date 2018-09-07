const Discord = require('discord.js')
const fs = require('fs') // подключаем fs к файлу
const bot = new Discord.Client()
const config = require('./config.json')
bot.commands = new Discord.Collection() // создаём коллекцию для команд

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

    if (message.content.startsWith(prefix + 'Hello')) {
        message.channel.send('Hello!')
    }
})

bot.login(config.token)
bot.on('ready', () => {
    console.log(`${bot.user.username} online`);
    bot.user.setPresence({status: 'dnd', game:{name: 'test', type: 0}})
})