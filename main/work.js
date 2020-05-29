 const cooldown = new Set();
const cooldownTime = 60000;
const Discord = require("discord.js");
const eco = require("../Store/money.json");
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
exports.run = async (bot, message, args) => {
 if(cooldown.has(message.author.id)){
           message.reply("You cant work right now trying again later!");
       } else {
       let money = getRandomInt(100, 500);
       var work = [
           'You helped Sylveon start her berry shop, she gave you',
           'You stopped a thief from stealing psyducks purse, psyduck gave u',
           'An old Pachirisu asked you to help her reach the high shelves at the market. She gave you',
           'You helped Greninja for his big battle! He gave you ',
           'You’ve traveled a long time and helped Togepi evolve to Togetic! She gives you ',
           'You happen to find an Eevee trying to evolve. You help it become a Sylveon! It gives you ',
           'You encountered a Skitty stuck in a tree and helped it get down. Its owner gave you ',
           'You grabbed a small Dedennes balloon before it got away. Her parents gave you ',
           'You stop a wild Spearow from attacking a Ratatta! The Ratatta has given you ',
           'You helped Detective Pikachu figure out the case of the missing Aipoms. They were simply in storage eating banana-berries. Detective Pikachu gave you ',
           "You stopped goose from running into a wall, he gave you "
           ]
        var randomWork = work[Math.floor(Math.random() * work.length)]

       eco[message.author.id].money +=money;
       message.channel.send({embed:{
           color: 0xfa8072,
           fields: [{
               name: "Work",
               value: randomWork +" "+ money + "<:sylveoncoin:699574208476479519> " 
           }]
       }});
       cooldown.add(message.author.id);
       setTimeout(() =>{
          cooldown.delete(message.author.id); 
       }, cooldownTime);
    }
}