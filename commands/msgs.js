module.exports.run = async (bot, message, args) => {
    await message.channel.send('Сборщик включен')
    const collector = message.channel.createMessageCollector(m => m.author.id == message.author.id, {max: 2, time: 60000})

    collector.on('collect', async msg => {
        switch(msg.content) {
            case '1':
                await message.channel.send('Первый случай')
            break
            case '2':
                await message.channel.send('Второй случай')
            break
        }
    })

    collector.on('end', async () => {
        await message.channel.send('Сборщик отключен')
    })
}

module.exports.help = {
    name: 'msgs'
}