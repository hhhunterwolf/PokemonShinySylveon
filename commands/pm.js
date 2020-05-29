const Discord = require('discord.js');

exports.run = (client, message, args) =>{
    let name = args[0];
    let isshiny = args[1];
    if(isshiny === "shiny"){
      let iv = args[2]
        if(iv === "o"){
          let by = args[3];
          let ad = args[4];
          message.channel.send("p!market search --name " + name + " --shiny" + " --order " + by + " " + ad)
      }else{
        let by = args[3];
        let ad = args[4];
        if(!by && !ad){
          message.channel.send("p!market search --name " + name + "--iv > " + iv + "--order " + by + " " + ad)
        }
      }
    }
}