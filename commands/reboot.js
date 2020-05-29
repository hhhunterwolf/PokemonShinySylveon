const Discord = require('discord.js');
const config = require("../pokemon_config.json");

exports.run = async (client, message, args) => {   
  const embed = new Discord.RichEmbed()
        .setTitle("Reboot")
        .setDescription("The bot is rebooting.")
        .setColor(0xfa8072);
  
  let owners = "576145034110435340";
  
  if (!owners.includes(message.author.id))  {
    embed
      .setTitle("Permission Denied")
      .setDescription("You do not have permission to use this command. It is meant for other users.");
    
    return message.channel.send(embed);
  }

  await message.channel.send(embed)
    .then(message => client.destroy())
    .then(() => client.login(config.token));
};