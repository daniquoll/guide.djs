module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send('Недостаточно прав на использование команды!')

    let member = message.guild.member(message.mentions.users.first() || message.guild.members.find(m => m.user.username == args[0] || m.id == args[0]))

    if (!member) return message.channel.send('Укажите существующего пользователя')
    if (member.hasPermission("MANAGE_ROLES")) return message.channel.send('Я не могу заглушить этого пользователя')

    let muterole = message.guild.roles.find(r => r.name == 'Muted')
    if (!muterole) muterole = await message.guild.createRole({
        name: 'Muted',
        color: 0x607d8d
    })
    let reason = args.slice(1).join(' ') || 'Не указана'
    if (member.roles.has(muterole.id)) return message.channel.send('Пользователь уже заглушен')

    await member.addRole(muterole.id)
    await message.channel.send(`<@${message.author.id}> заглушил <@${member.id}>\n**Причина**: ${reason}`)
}

module.exports.help = {
    name: 'mute'
}