const Discord = require('discord.js');

exports.run = (client, message, args) =>{
    var dice = [1, 2, 3, 4, 5, 6];

    const embed = new Discord.RichEmbed()
        .setColor(0xfa8072)
        .addField("First dice", dice[Math.floor(Math.random()*dice.length)], true)
        .addField("Second dice", dice[Math.floor(Math.random()*dice.length)], true)
        .setTimestamp();

    return message.channel.send(embed);    
}