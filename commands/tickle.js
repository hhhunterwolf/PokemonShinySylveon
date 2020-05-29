const Discord = require('discord.js');
const superagent = require('superagent');

exports.run = async (client, message, args, tools) => {
    if (!message.mentions.users.first()) return message.reply("You need to mention someone to tickle them");
    const { body } = await superagent
    .get("https://nekos.life/api/v2/img/tickle");
    
    const embed = new Discord.RichEmbed()
    .setColor(0xfa8072)
    .setTitle(`<:sylvay:710806633508503582>, ${message.author.username} tickled ${message.mentions.users.first().username} <:sylvblush:710806492504129576>`)
    .setImage(body.url) 
    message.channel.send({embed})
};