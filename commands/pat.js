const Discord = require('discord.js');
const superagent = require('superagent');

exports.run = async (client, message, args, tools) => {
    if (!message.mentions.users.first()) return message.reply("You need to mention someone to pat them");
    if (message.mentions.users.first().id === "609771039609716736") return message.channel.send('Yayyy!');
    const { body } = await superagent
    .get("https://nekos.life/api/pat");
    
    const embed = new Discord.RichEmbed()
    .setColor(0xfa8072)
    .setTitle(`<:sylvay:710806633508503582>, ${message.author.username} patted ${message.mentions.users.first().username} <:sylvblush:710806492504129576>`)
    .setImage(body.url) 
    message.channel.send({embed})
};