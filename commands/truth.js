const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    if (!args[0]) return message.reply('Provide a truth!')
    const embed = new Discord.RichEmbed()
    .setColor(0xfa8072)
    .setImage(`https://api.alexflipnote.dev/scroll?text=` + args.join('%20')) 
    message.channel.send({embed});
};