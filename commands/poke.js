const Discord = require('discord.js');
const superagent = require('superagent');


exports.run = async (client, message, args, tools) => {
    if (!message.mentions.users.first()) return message.reply("You need to mention someone to pat them");
    if (message.mentions.users.first().id === "482128001828651008") return message.channel.send('<a:yayyy:497742636439044096>');
    const { body } = await superagent
    .get("https://nekos.life/api/v2/img/poke");
    
    const embed = new Discord.RichEmbed()
    .setColor(0xfa8072)
    .setTitle(`<:sylvay:710806633508503582>, ${message.author.username} poked ${message.mentions.users.first().username} <:sylvblush:710806492504129576>`)
    .setImage(body.url) 
    message.channel.send({embed})
};