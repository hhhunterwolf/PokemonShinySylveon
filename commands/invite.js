const Discord = require('discord.js');

exports.run = async (client, message, args, tools) => {
    
    const embed = new Discord.RichEmbed()
    .setColor(0xfa8072)
    .setTitle(`<:sylvay:710806633508503582>`)
    .addField("Invite Bot", "[here <:sylvblush:710806492504129576>](https://discord.com/api/oauth2/authorize?client_id=609771039609716736&permissions=8&scope=bot)")
    .addField("Support Server", "[here <:sylvkyu:710806562871967785>](https://discord.gg/ch62G8S)")
    message.channel.send({embed})
};