const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
  const verlvl = {
    0: "None",
    1: "Low",
    2: "Medium",
    3: "(╯°□°）╯︵ ┻━┻",
    4: "(ノಠ益ಠ)ノ彡┻━┻"
  }

    let inline = true
    let sicon = message.guild.iconURL;
    let serverembed = new Discord.RichEmbed()
    .setColor(0xfa8072)
    .setThumbnail(sicon)
    .setAuthor(message.guild.name)
    .addField("Name", message.guild.name, inline)
    .addField("ID", message.guild.id, inline)
    .addField("Owner", message.guild.owner, inline)
    .addField("Region", message.guild.region, inline)
    .addField("Verification Level", verlvl[message.guild.verificationLevel],inline)
    .addField("Members", `<a:xerneas:711441367519461437> ${message.guild.memberCount}`, inline)
    .addField("Roles", message.guild.roles.size, inline)
    .addField("Channels", message.guild.channels.size, inline)
    .addField("You Joined", message.member.joinedAt)
    .setFooter(`Created ${message.guild.createdAt}`);

    message.channel.send(serverembed);

    message.delete();
}