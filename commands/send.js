module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send('Недостаточно прав на использование команды')

    let content = args.slice(0).join(' ')
    if (!content) return message.channel.send('Укажите текст сообщения')
    await message.delete()
    await message.channel.send(content)
}

module.exports.help = {
    name: 'send'
}