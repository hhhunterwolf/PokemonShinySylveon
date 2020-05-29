const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    let avatar = message.mentions.users.size ? message.mentions.users.first().avatarURL : message.author.avatarURL;
    
    const embed = new Discord.RichEmbed()
    .setColor(0xfa8072)
    .setImage(`https://api.alexflipnote.dev/jokeoverhead?image=` + avatar) 
    message.channel.send({embed});
};