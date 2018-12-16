module.exports.run = async (bot, message, args) => {
    let mess = await message.channel.send('Сборщик включен')
    await mess.react('😀')
    await mess.react('😬')
    const collector = mess.createReactionCollector((reaction, user) => reaction.emoji.name === '😀' || reaction.emoji.name === '😬' && user.id == message.author.id, {time: 60000})

    collector.on('collect', async r => {
        switch(r.emoji.name) {
            case '😀':
                await mess.edit('Первый случай')
            break
            case '😬':
                await mess.edit('Второй случай')
            break
        }
    })

    collector.on('end', async () => {
        await mess.edit('Сборщик отключен')
    })
}

module.exports.help = {
    name: 'reactions'
}