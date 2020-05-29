  
const Discord = require('discord.js');

exports.run = (client, message, args) => {
    let embed = new Discord.RichEmbed()
        .setTitle("Pong!")
        .setColor(0xfa8072)
        .setDescription(`<a:shinysylveon:595602290359009293> ${Date.now() - message.createdTimestamp}ms\n\n<a:sylveon:592742302284382211> ${Math.round(client.ping)}ms`)

    message.channel.send(embed);
}