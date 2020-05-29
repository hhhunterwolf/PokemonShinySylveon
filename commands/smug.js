const Discord = require('discord.js');
const superagent = require('superagent');

exports.run = async (client, message, args, tools) => {
    const { body } = await superagent
    .get("https://nekos.life/api/v2/img/smug");
    
    const embed = new Discord.RichEmbed()
    .setColor(0xfa8072)
    .setImage(body.url) 
    message.channel.send({embed})
};