const Discord = require('discord.js');
const superagent = require('superagent');
const sf = require("snekfetch");

exports.run = async (client, message, args) => {
    if(!args[0] || args[0] === 'help') return message.reply("Please provide a valid hex code without the #")
    var isOk = /^[0-9A-F]{6}$/i.test(args[0])
    if (isOk === false) return message.reply("Please provide a valid hex code without the #")
    
    const { body } = await superagent
    .get(`https://api.alexflipnote.dev/color/` + args[0]);

    const embed = new Discord.RichEmbed()
    .setColor(0xfa8072)
    .setTitle(body.name)
    .setDescription("Hex: " + body.hex + '\n' + "RGB: " + body.rgb)
    .setImage(body.image) 
    message.channel.send({embed});
};