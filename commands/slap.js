const Discord = require('discord.js');
const superagent = require('superagent');
//const customisation = require('../customisation.json');

exports.run = async (client, message, args, tools) => {
    if (!message.mentions.users.first()) return message.reply("You need to mention someone to slap them");
    if(message.mentions.users.first().id === "576145034110435340") return message.reply('You can\'t hurt him Nu <:sylvsad:710806436833263667>');
    const { body } = await superagent
    .get("https://nekos.life/api/v2/img/slap");
    
    const embed = new Discord.RichEmbed()
    .setColor(0xfa8072)
    .setTitle(`<:sylvay:710806633508503582>, ${message.mentions.users.first().username} You got slapped by ${message.author.username} <:sylvsad:710806436833263667>`)
    .setImage(body.url)
    message.channel.send({embed})
};