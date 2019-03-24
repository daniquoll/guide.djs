const ytdl = require('ytdl-core')
const queue = new Map()

module.exports.run = async (bot, message, args) => {
    let song = args[0], voice = message.member.voiceChannel

    if (!song) return message.channel.send('Укажи ссылку на трек')
    if (!voice) return message.channel.send('Войди в голосовой канал')

    let valid = ytdl.validateURL(song)
    if (!valid) return message.channel.send('Ссылка недействительна')

    let connection = await voice.join()
    let guild_queue = queue.get(message.guild.id)
    if (!guild_queue) guild_queue = queue.set(message.guild.id, {songs: []}).get(message.guild.id)

    guild_queue.songs.push(song)
    message.channel.send('Трек добавлен в очередь')
    if (guild_queue.songs.length < 2) play(connection, guild_queue.songs)
}

module.exports.help = {
    name: 'play'
}

async function play(connection, songs) {
    let music = await ytdl(songs[0], {filter: 'audioonly'})

    connection.playStream(music, {volume: 0.5})
    .on('end', () => {
        songs.shift()
        if (songs.length > 0) play(connection, songs)
        else connection.disconnect()
    })
}