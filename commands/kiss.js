const Discord = require('discord.js');
const superagent = require('superagent');

exports.run = async (client, message, args, tools) => {
    if (!message.mentions.users.first()) return message.reply("You need to mention someone to kiss them");
    const { body } = await superagent
    .get("https://nekos.life/api/kiss");
    
    const embed = new Discord.RichEmbed()
    .setColor(0xfa8072)
    .setTitle(`<:sylvay:710806633508503582>, ${message.author.username} kissed ${message.mentions.users.first().username} <:sylvkyu:710806562871967785>`)
    .setImage(body.url)
    message.channel.send({embed})
};