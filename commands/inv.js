const item = require("../Store/item.json");
const chp = require("../rpgStore/inv.json");
const player = require("../rpgStore/players.json");
const fs = require("fs");
exports.run = (client, message, args) => {
  if (!item[message.author.id])
    return message.reply("You dont have anything in ur inventory try buying!");
  let pokeball = item[message.author.id].pokeball;
  let greatball = item[message.author.id].greatball;
  let slot = args[0];
  if (slot === "balls") {
    let embed = {
      title:
        player[message.author.id].ava +
        " " +
        message.author.username +
        "'s inventory",
      description:
        "Pokeballs: " +
        pokeball +
        "<:pb:702261761113587742>" +
        "\nGreatballs: " +
        greatball +
        "<:gb:702262823786643466>",
      color: 0xfa8072,
      thumbnail: {
        url:
          "https://cdn.discordapp.com/attachments/614630738142429184/702569344458031174/bag3.PNG.cf31491762da2a02ea2b02f516342111.png"
      }
    };
    message.channel.send({ embed: embed });
  } else if (slot === "stones") {
    let stones = item[message.author.id].megastone;
    if (!item[message.author.id].megastone)
      return message.reply("you dont have anything in this bag");
    let embed = {
      title:
        player[message.author.id].ava +
        " " +
        message.author.username +
        "'s inventory",
      description: "Mega Stones: " + stones,
      color: 0xfa8072,
      thumbnail: {
        url:
          "https://cdn.discordapp.com/attachments/614630738142429184/702569344458031174/bag3.PNG.cf31491762da2a02ea2b02f516342111.png"
      }
    };
    message.channel.send({ embed: embed });
  } else {
    let candy = item[message.author.id].candy;
    if (!item[message.author.id].candy)
      return message.reply("you dont have anything in this bag");
    let embed = {
      title:
        player[message.author.id].ava +
        " " +
        message.author.username +
        "'s inventory",
      description: "Rare Candy: " + candy + "<:rarecandy:713010837744254997>",
      color: 0xfa8072,
      thumbnail: {
        url:
          "https://cdn.discordapp.com/attachments/614630738142429184/702569344458031174/bag3.PNG.cf31491762da2a02ea2b02f516342111.png"
      }
    };
    message.channel.send({ embed: embed });
  }
};
