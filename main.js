const Discord = require("discord.js");
const client = new Discord.Client();
//Cooldown
const cooldown = new Set();
const catchingtr = new Set();
const spawncool = new Set();
const battlecool = new Set();
const cooldownTime = 60000;
const spawncooltime = 30000;
const battlecooldown = 20000;
var fs = require("fs");

const Enmap = require("enmap");
var fixedWidthString = require("fixed-width-string");
var dateFormat = require("dateformat");
var schedule = require("node-schedule");
const keep_alive = require("./keep_alive.js");
let db = JSON.parse(fs.readFileSync("./database.json", "utf8"));
const pConfig = require("./pokemon_config.json");
const opx = require("oakdex-pokedex");
const dex = require("./dex.json");
const dexlegs = require("./dexlegs.json");
const pdex = require("./pdex.json");
const mons = require("./Store/mons.json");
const party = require("./Store/party.json");
const trainers = require("./Store/trainers.json");
const market = require("./Store/market.json");
const marketadd = require("./Store/marketadd.json");
var currentMon = null;
var spawns = require("./Store/spawns.json");
const eco = require("./Store/money.json");
const gender = require("./Data/gender.json");
const form = require("./Data/forms.json");
const user = require("./Store/xp.json");
const select = require("./Store/selected.json");
const item = require("./Store/item.json");
const todo = require("./Store/todo.json");
const report = require("./Store/reports.json");
const reportids = require("./Store/reportids.json");
var spawnsEnabled;
var currentDuel = null;
var currentDuelMon1;
var currentDuelMon2;
const duel = require("./duels.json");
const learn = require("./Store/learned.json");
const mega = require("./Data/megas.json");
checkHour();
const DBL = require("dblapi.js");
const dbl = new DBL(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOTc3MTAzOTYwOTcxNjczNiIsImJvdCI6dHJ1ZSwiaWF0IjoxNTg5ODY5MjM5fQ.Rk4e02YtGInv68sYd7v0RiwlZq6tpH2yN1BrEQbmFYA",
  { webhookPort: 3000, webhookAuth: "HhHunterwolf1" }
);

// Optional events
dbl.on("posted", () => {
  console.log("Server count posted!");
});

dbl.on("error", e => {
  console.log(`Oops! ${e}`);
});
dbl.webhook.on("vote", vote => {
  console.log(`User with ID ${vote.user} just voted!`);
});
dbl.webhook.on("ready", hook => {
  console.log(
    `Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`
  );
});
//Pokemon
client.on("message", message => {
  if (message.author.bot) return;
  if (message.channel.id === "603897806075461642") return;

  if (message.content.indexOf(pConfig.prefix) === 0) {
    const args = message.content
      .slice(pConfig.prefix.length)
      .trim()
      .split(/ +/g);
    const command = args.shift().toLowerCase();

    //dev commands only
    if(command === "battle"){
      
      if(!select[message.author.id])
        return message.reply("Select something");
        if (battlecool.has(message.author.id)) {
        message.reply("Chill theres a 20 secs cooldown!");
      } else {
        battlecool.add(message.author.id);
        setTimeout(() => {
          battlecool.delete(message.author.id);
        }, battlecooldown);
      let hp = getRandomInt(80, 200);
      let mon = select[message.author.id].selected;
      let found = mons[mon]
      let Bspa = pdex[found.name].baseStats.spa;
      let Ispa = found.spatkiv;
      let Lspa = found.level;
      if(Lspa > 99)return message.reply("So this is like wild battles so level 100s wont be able to do it");
      let atk = Math.floor(((2 * Bspa + Ispa) * Lspa) / 100 + 5);
     
      if(atk > hp){
        let amount = getRandomInt(80, 300);
        message.reply("Your attack was more thn the hp generated, sp.atk: " + atk + " hp: " + hp + " you got " + amount + " xp");
        if(found.level > 100)return;
        let db = user[message.author.id].xp;
        user[message.author.id].xp = Math.floor(db+amount)
        updatePoke();
      }
      else{
        let text = "kek died sp.atk: " + atk + " hp: " + hp
        message.reply(text)
      }
      }
    }
    if (command === "spawn") {
      if (spawncool.has(message.author.id)) {
        message.reply("Chill theres a 30 secs cooldown!");
      } else {
        spawncool.add(message.author.id);
        setTimeout(() => {
          spawncool.delete(message.author.id);
        }, spawncooltime);
        spawnnMon(message);
      }
    }
    if (command === "vote") {
      dbl.hasVoted(message.author.id).then(voted => {
        if (voted) {
          message.channel.send("Has voted!!!");
        } else {
          let embed = {
            title: "Vote!! <:sylvkyu:710806562871967785>",
            description: "[here](https://top.gg/bot/609771039609716736/vote)",
            color: 0xfa8072
          };
          message.channel.send({ embed: embed });
        }
      });
    }
    if (command === "e") {
      if (message.author.id !== "677218755276832793")
        return message.reply("What? Who you?");
      if (!currentMon) return;
      message.channel.send(currentMon.name);
    }
    if (command === "j") {
      if (message.author.id !== "512021413037867045")
        return message.reply("What? Who you?");
      if (!currentMon) return;
      message.channel.send(currentMon.name);
    }
    if (command === "s") {
      if (message.author.id === "576145034110435340") return spawnnMon(message);
      if (message.author.id === "677218755276832793") return spawnnMon(message);
      if (spawncool.has(message.author.id)) {
        message.reply("Chill theres a 30 secs cooldown!");
      } else {
        spawncool.add(message.author.id);
        setTimeout(() => {
          spawncool.delete(message.author.id);
        }, spawncooltime);
        spawnnMon(message);
      }
    }
    if (command === "sp") {
      if (!message.author.id !== `576145034110435340`) return;
      message.delete(1);
      perfectspawnMon(message);
    }
    if (command === "cs") {
      if (message.author.id !== "576145034110435340") return;
      message.delete();
      customspawnMon(message);
    }
    
    if (command === "qu") {
      if (message.author.id !== "656491651044343839") return;
      message.delete();
      customspawnMon(message);
    }
    if (command === "give") {
      if (!trainers[message.author.id])
        return message.reply("You dont have any Pokemons to give!");
      let trindex = args[1] - 1;
      let mng = trainers[message.author.id].mons;
      let trid = mng[trindex];
      let user = message.mentions.users.first();
      let mnog = trainers[user.id].mons;
      if (!user) return message.reply("To whom are you giving?");
      mng.splice(trindex, 1);
      mnog.push(trid);
      message.channel.send(
        `Giver: ${message.author.username}\nTaker: ${user.username}\nPokemon Id: ${trid}`
      );
    }
    if (command === "despawn") {
      despawnMon();
    }
    if (command === "gcatch") {
      if (!currentMon)
        return message.reply("Theres nothing to catch spawn one using s!spawn");
      let saidnm = args[0];
      if (!saidnm) return message.reply("Say the name");
      if (!currentMon) return;
      names = saidnm.toLowerCase();
      if (names === currentMon.name) {
        attemptGreatCatch(message, currentMon);
      } else {
        message.reply("Wrong!");
      }
    }
    if (command === "gc") {
      if (!currentMon)
        return message.reply("Theres nothing to catch spawn one using s!spawn");
      let saidnm = args[0];
      if (!saidnm) return message.reply("Say the name");
      if (!currentMon) return;
      names = saidnm.toLowerCase();
      if (names === currentMon.name) {
        attemptGreatCatch(message, currentMon);
      } else {
        message.reply("Wrong!");
      }
    }
    if (command === "catch") {
      if (!currentMon)
        return message.reply("Theres nothing to catch spawn one using s!spawn");
      let saidnm = args[0];
      if (!saidnm) return message.reply("Say the name");
      if (!currentMon) return;
      names = saidnm.toLowerCase();
      if (names === currentMon.name) {
        attemptCatch(message, currentMon);
      } else {
        message.reply("Wrong!");
      }
    }
    if (command === "c") {
      if (!currentMon)
        return message.reply("Theres nothing to catch spawn one using s!spawn");
      let saidnm = args[0];
      if (!saidnm) return message.reply("Say the name");
      if (!currentMon) return;
      names = saidnm.toLowerCase();
      if (names === currentMon.name) {
        attemptCatch(message, currentMon);
      } else {
        message.reply("Wrong!");
      }
    }
    if (command === "mega") {
      if(!eco[message.author.id])return message.reply("You dont have ur account in the bank, do s!bal");
	  if(!trainers[message.author.id])return message.reply("You dont have any Pokemons");
	  if(!item[message.author.id])return message.reply("Uhm you dont have anything try s!mart");
	  if(item[message.author.id].megastone === 0)return message.reply("You dont have any mega stones");
	  if(!select[message.author.id])return message.reply("Select a mon to mega");
	  let mon = select[message.author.id].selected; // MONS ID
	  if(!mons[mon])return message.reply("Wait where did u find that? Its not there in my database :0");
	  let name = mons[mon].name; //MONS NAME
	  if(!name)return message.reply("Ah i couldnt find that mon, theres been an error");
	  if(!mega[name])return message.reply("That Pokemon doesnt mega evolve");
	  mons[mon].name = mega[name].meganame; //MONS MEGA NAME
	  item[message.author.id].megastone -= 1;
	  message.reply("Your pokemon mega evolved")
    }
    if (command === "use") {
      let gitem = args[0];
      if (!gitem) return message.channel.send("Which item do you want to use?");
      let glitem = gitem.toLowerCase();
      if (!item[message.author.id])
        return message.reply("Your inv looks empty, buy something!");
      if (glitem === "candy") {
        if (item[message.author.id].rarecandy === 0)
          return message.reply("You dont have any Rare Candies!");
        let candy = item[message.author.id].rarecandy;
        if (candy === 0) return message.reply("You dont have any Rare Candy!");
        if (!select[message.author.id].selected)
          return message.reply("You need to select a Pokemon use Rare Candy!");
        let ids = select[message.author.id].selected;
        let lvl = mons[ids].level;
        let amount = args[1];
        if (isNaN(amount)) return message.reply("Give a valid amount");
        if (lvl === 100)
          return message.reply("Your pokemon is already level 100");
        let rram;
        if (!amount) {
          rram = 1;
        } else {
          rram = parseInt(amount);
        }
        let newlvl = lvl + rram;
        if (newlvl > 100)
          return message.reply("That will make the Pokemon more thn level 100");
        mons[ids].level = newlvl;
        fs.writeFile("./Store/mons.json", JSON.stringify(mons), function(err) {
          if (err) throw err;
        });
        item[message.author.id].rarecandy = Math.floor(candy - rram);
        fs.writeFile("./Store/item.json", JSON.stringify(item), function(err) {
          if (err) throw err;
        });
        message.channel.send(
          "You used a Rare Cady and now your " +
            mons[ids].name +
            " is level " +
            mons[ids].level
        );
      } else {
        message.channel.send("Theres only rare candy atm");
      }
    }
    if (command === "select") {
      let inp = args[0] - 1;
      let mon = trainers[message.author.id].mons;
      let scled = mon[inp];
      if (!mon[inp]) return message.reply("You dont have a Pokemon of that id");
      select[message.author.id] = {
        selected: scled,
        id: inp
      };
      user[message.author.id] = {
        xp: 0,
        level: 0
      };

      fs.writeFile("./Store/xp.json", JSON.stringify(user), function(err) {
        if (err) throw err;
      });
      fs.writeFile("./Store/selected.json", JSON.stringify(select), function(
        err
      ) {
        if (err) throw err;
      });
      let foundname = mons[scled].name;
      let name = pdex[foundname].species;
      let level = mons[scled].level;
      message.channel.send(
        `${message.author.username}, you selected your level ${level} ${name} !`
      );
    }

    if (command === "todo") {
      let arg = args[0];
      if (arg === "add") {
        id = message.content.slice(10);
        todo[message.author.id] = {
          item: id
        };
        fs.writeFile("./Store/todo.json", JSON.stringify(todo), function(err) {
          if (err) throw err;
          message.delete(10);
        });
        message.channel.send("Added");
      } else {
        if (!todo[message.author.id]) {
          message.channel.send("You didnt say me what u had to do");
        } else {
          message.reply("You had to " + todo[message.author.id].item);
        }
      }
    }
    if (command === "party") {
      let fil = args[0];
      if (!party[message.author.id]) {
        party[message.author.id] = {
          party1: "",
          party2: "",
          party3: "",
          party4: "",
          party5: "",
          party6: ""
        };
        fs.writeFile("./Store/party.json", JSON.stringify(party), function(
          err
        ) {
          if (err) throw err;
        });
        message.channel.send("Made your Party Slots do that again!");
      } else {
        if (!fil) {
          let desc = "Party slots\n";
          let slotno = party[message.author.id];
          if (!party[message.author.id].party1) {
            desc += "Slot 1 - Not Selected\n";
          } else {
            let nrname = mons[slotno.party1].name;
            let name = pdex[nrname].species;
            desc += `Slot 1 - ${name}\n`;
          }
          if (!party[message.author.id].party2) {
            desc += "Slot 2 - Not Selected\n";
          } else {
            let nrname = mons[slotno.party2].name;
            let name = pdex[nrname].species;
            desc += `Slot 2 - ${name}\n`;
          }
          if (!party[message.author.id].party3) {
            desc += "Slot 3 - Not Selected\n";
          } else {
            let nrname = mons[slotno.party3].name;
            let name = pdex[nrname].species;
            desc += `Slot 3 - ${name}\n`;
          }
          if (!party[message.author.id].party4) {
            desc += "Slot 4 - Not Selected\n";
          } else {
            let nrname = mons[slotno.party4].name;
            let name = pdex[nrname].species;
            desc += `Slot 4 - ${name}\n`;
          }
          if (!party[message.author.id].party5) {
            desc += "Slot 5 - Not Selected\n";
          } else {
            let nrname = mons[slotno.party5].name;
            let name = pdex[nrname].species;
            desc += `Slot 5 - ${name}\n`;
          }
          if (!party[message.author.id].party6) {
            desc += "Slot 6 - Not Selected\n";
          } else {
            let nrname = mons[slotno.party6].name;
            let name = pdex[nrname].species;
            desc += `Slot 6 - ${name}\n`;
          }
          let embed = {
            title: `${message.author.username}'s Party!`,
            description: desc
          };
          message.channel.send({ embed: embed });
        } else {
          let chs = args[0];
          let pkidf = args[1];
          let pkid = pkidf - 1;
          let slt = args[2];
          if (chs === "add") {
            if (!pkidf) {
              message.reply(
                "Give an id of the pokemon and the slot you want to add it in as well"
              );
            } else if (!slt) {
              message.reply("Give a slot number!");
            } else {
              let mon = trainers[message.author.id].mons;
              let monid = mon[pkid];
              if (slt === "1") {
                party[message.author.id].party1 = monid;
                message.channel.send(
                  `Selected ${mons[monid].name} at slot ${slt}`
                );
                updatePoke();
              } else if (slt === "2") {
                party[message.author.id].party2 = monid;
                message.channel.send(
                  `Selected ${mons[monid].name} at slot ${slt}`
                );
                updatePoke();
              } else if (slt === "3") {
                party[message.author.id].party3 = monid;
                message.channel.send(
                  `Selected ${mons[monid].name} at slot ${slt}`
                );
                updatePoke();
              } else if (slt === "4") {
                party[message.author.id].party4 = monid;
                message.channel.send(
                  `Selected ${mons[monid].name} at slot ${slt}`
                );
                updatePoke();
              } else if (slt === "5") {
                party[message.author.id].party5 = monid;
                message.channel.send(
                  `Selected ${mons[monid].name} at slot ${slt}`
                );
                updatePoke();
              } else if (slt === "6") {
                party[message.author.id].party6 = monid;
                message.channel.send(
                  `Selected ${mons[monid].name} at slot ${slt}`
                );
                updatePoke();
              } else {
                message.channel.send("Only 6 slot available!");
              }
            }
          }
        }
      }
    }
    if (command === "release") {
      let ars = args[0];
      if (!ars) return message.reply("Please give an id you want to release!");
      let inp = ars - 1;
      let montr = trainers[message.author.id].mons;
      let given = montr[inp];
      if (!given) return message.reply("You dont have that Pokemon ");
      let giname = mons[given];
      let gname;
      if (!giname) gname = "Glitch";
      else gname = giname.name;
      montr.splice(inp, 1);
      message.channel.send("```Bye```").then(msg => {
        setTimeout(function() {
          msg.edit("```Bye Bye```");
        }, 700);
        setTimeout(function() {
          msg.edit("```Bye Bye " + gname + "```");
        }, 1500);
        setTimeout(function() {
          msg.edit("<:sylvsad:710806436833263667>");
        }, 5000);
      });
    }
    if (command === "info") {
      if (trainers[message.author.id]) {
        if (!select[message.author.id])
          return message.channel.send("Select something from pc first!");
        let ars = args[0];
        let inp = ars - 1;
        let given;
        if (!ars) {
          given = select[message.author.id].selected;
        } else if (ars === "latest") {
          let given =
            trainers.mons[trainers[message.author.id].mons.length - 1];
        } else {
          mng = trainers[message.author.id].mons;
          givenid = mng[inp];
          given = givenid;
        }
        let footid;
        if (!ars) {
          foot = select[message.author.id].id + 1;
          footid = "Selected Pokemon: " + foot;
        } else {
          foot = ars;
          footid = "Showing Pokemon: " + foot;
        }
        if (given) {
          var found = false;
          var correctID;

          if (!isNaN(parseInt(given))) {
            trainers[message.author.id].mons.forEach(function(mon, index) {
              if (mon == parseInt(given)) {
                found = true;
                correctID = parseInt(given);
                return;
              }
            });
          }

          if (!found) {
            //check if a nickname was given
            trainers[message.author.id].mons.forEach(function(mon, index) {
              monData = mons[mon];
              if (monData.nickname === given) {
                found = true;
                correctID = mon;
                return;
              }
            });
          }

          if (found) {
            const found = mons[correctID];
            if (!found)
              return message.reply(
                "Im sorry there was a problem with this Pokemon"
              );
            var preferredName;
            if (found.nickname.length > 0) preferredName = found.nickname;
            else {
              if (!found.shiny) preferredName = found.name;
              else preferredName = "Shiny " + found.name;
            }
            let imgUrl;
            if (!found.shiny)
              imgUrl =
                "https://raw.githubusercontent.com/hhhunterwolf/ShinySylveonImage/master/Sprites%20151/" +
                titleCase(found.name) +
                ".png";
            else
              imgUrl =
                "https://raw.githubusercontent.com/hhhunterwolf/ShinySylveonImage/master/Sprites%20Shiny/" +
                titleCase(found.name) +
                ".png";
            let lvlxp = found.level;
            let math2 = Math.floor((5 * (lvlxp * lvlxp * lvlxp)) / 4);
            let math1 = Math.floor(
              (5 * ((lvlxp + 1) * (lvlxp + 1) * (lvlxp + 1))) / 4
            );
            let math = Math.floor(275 + (lvlxp - 1) * 25);
            let ball;
            if (!found.balls) {
              ball = "<:pb:702261761113587742>";
            } else {
              ball = found.balls;
            }
            let genicon;
            if (found.gender === "female") {
              genicon = "<:female:703360010545004675>";
            } else if (found.gender === "male") {
              genicon = "<:male:703360065968537660>";
            } else if (found.gender === "male") {
              genicon = "<:sans:711876534310273084>";
            } else {
              genicon = "<:unknown:703616344288919676>";
            }
            let exphv;
            if (!ars) {
              exphv = user[message.author.id].xp + "/" + math;
            } else {
              exphv = "Select To gain xp";
            }

            let dexId = pdex[found.name].num;
            var desc;
            let nametoshow = titleCase(preferredName);
            if (!found.shiny)
              desc = `**${nametoshow} ${genicon} ${ball} #${dexId} - ${correctID}**`;
            else
              desc = `<a:shiny:703757184567345223>**${nametoshow} ${genicon} ${ball} #${dexId} - ${correctID}**`;
            let B = pdex[found.name].baseStats.atk;
            let I = found.atkiv;
            let L = found.level;
            let expatk = Math.floor(((2 * B + I) * L) / 100 + 5);
            let Bh = pdex[found.name].baseStats.hp;
            let Ih = found.hpiv;
            let Lh = found.level;
            let exphp = Math.floor(((2 * Bh + Ih) * Lh) / 100 + 10);
            let Bdf = pdex[found.name].baseStats.def;
            let Idf = found.defiv;
            let Ldf = found.level;
            let expdef = Math.floor(((2 * Bdf + Idf) * Ldf) / 100 + 5);
            let Bspa = pdex[found.name].baseStats.spa;
            let Ispa = found.spatkiv;
            let Lspa = found.level;
            let expspatk = Math.floor(((2 * Bspa + Ispa) * Lspa) / 100 + 5);
            let Bspd = pdex[found.name].baseStats.spd;
            let Ispd = found.spdefiv;
            let Lspd = found.level;
            let expspdef = Math.floor(((2 * Bspd + Ispd) * Lspd) / 100 + 5);
            let Bspe = pdex[found.name].baseStats.spe;
            let Ispe = found.speediv;
            let Lspe = found.level;
            let expspe = Math.floor(((2 * Bspe + Ispe) * Lspe) / 100 + 5);
            let tladd = Math.floor(
              found.hpiv +
                found.atkiv +
                found.defiv +
                found.spatkiv +
                found.spdefiv +
                found.speediv
            );
            let totalIv = Math.round((tladd / 186) * 100).toFixed(2);
            var baseExp = `**Hp: ${exphp} - ${found.hpiv}/31\nAttack: ${expatk} - ${found.atkiv}/31\nDefence: ${expdef} - ${found.defiv}/31\nSp.Attack: ${expspatk} - ${found.spatkiv}/31\nSp.Def: ${expspdef} - ${found.spdefiv}/31\nSpeed: ${expspe} - ${found.speediv}/31\nTotal IV%: ${totalIv}%**`;
            let types = pdex[found.name].types;
            let levels = found.level;

            const embed = {
              title: "Shiny Sylveon",
              description: desc,
              color: 0xfa8072,
              fields: [
                {
                  name: "Type",
                  value: types
                },
                {
                  name: "Level",
                  value: levels,
                  inline: true
                },
                {
                  name: "Exp",
                  value: exphv,
                  inline: true
                },
                {
                  name: "Stats",
                  value: baseExp
                }
              ],
              image: {
                url: imgUrl
              },
              footer: {
                text:
                  footid +
                  "/" +
                  trainers[message.author.id].mons.length +
                  " - Caught at " +
                  found.catchTime
              }
            };

            message.channel.send({ embed });
          }
        }
      }
    }
    if (command === "mon") {
      if (!currentMon) {
        message.channel.send("There arent any spawns!");
      } else {
        const embed = {
          title: `${currentMon.name} (Lv. ${currentMon.level})`,
          description: desc,
          color: 0xfa8072,

          image: {
            url: currentMon.imgUrl
          }
        };
        message.channel.send({ embed: embed });
        message.channel.send(
          `Type \`${
            pConfig.prefix
          }catch\` to attempt to catch it!\n*(Pokéball catch Chance: ${(
            currentMon.catchChance * 100
          ).toFixed(2)}%)*\n*(Greatball catch Chance: ${(
            currentMon.catchGreatChance * 100
          ).toFixed(2)}%)*`
        );
      }
    }
    if (command === "nickname") {
      if (trainers[message.author.id]) {
        let inp = args[0] - 1;
        mng = trainers[message.author.id].mons;
        givenid = mng[inp];
        given = givenid;
        if (given) {
          var found = false;
          if (!isNaN(parseInt(given))) {
            trainers[message.author.id].mons.forEach(function(mon, index) {
              if (mon == parseInt(given)) {
                found = true;
                return;
              }
            });
          }

          if (found) {
            var correctID = parseInt(given);
            args.shift();
            const restOf = args.join(" ");
            if (restOf) {
              mons[correctID].nickname = restOf;
              updatePoke();
              message.reply(
                `${mons[correctID].name}'s new nickname is "${mons[correctID].nickname}"`
              );
            } else {
              message.reply(
                "please include the nickname you'd like to set. For example `" +
                  pConfig.prefix +
                  " nickname " +
                  correctID +
                  " Bobby`"
              );
            }
          } else {
            message.reply(
              "you do not have a Pokémon with the ID `" + args[0] + "`"
            );
          }
        } else
          message.reply(
            "please include the id of the Pokémon you'd like to nickname. For example `" +
              pConfig.prefix +
              " nickname " +
              trainers[message.author.id].mons[0] +
              " Bobby`"
          );
      } else message.reply("you have not caught any Pokémon.");
    }
  }
});
//Evolution

client.on("message", message => {
  if (message.author.bot) return; // ignore bots
  // if the user is not on db add the user and change his values to 0
  if (!db[message.author.id])
    db[message.author.id] = {
      xp: 0,
      level: 0,
      message: 0
    };

  fs.writeFile("./database.json", JSON.stringify(db), x => {
    if (x) console.error(x);
  });
  db[message.author.id].message++;
  let xpg = getRandomInt(10, 20);
  db[message.author.id].xp += xpg;
  let userInfo = db[message.author.id];

  if (!select[message.author.id]) return;

  let id = select[message.author.id].selected;
  let correctIDxp = parseInt(id);
  if (!mons[correctIDxp]) return;
  let ev = mons[correctIDxp];
  let name = ev.name;
  let lvlxp = ev.level;
  let math2 = Math.floor((5 * (lvlxp * lvlxp * lvlxp)) / 4);
  let math1 = Math.floor((5 * ((lvlxp + 1) * (lvlxp + 1) * (lvlxp + 1))) / 4);
  let math = Math.floor(math1 - math2);
  if (!pdex[name].evos) return;
  let evoname = pdex[name].evos;
  if (!pdex[evoname].evoLevel) return;
  let evolvl = pdex[evoname].evoLevel;
  let mon = pdex[name].name;
  let h = lvlxp + 1;
  let l = lvlxp;

  if (lvlxp > evolvl - 1) {
    if (trainers[message.author.id]) {
      if (!select[message.author.id]) return;
      if (!mons) return;
      const given = select[message.author.id].selected;
      if (given) {
        var found = false;
        var correctID;

        if (!isNaN(parseInt(given))) {
          trainers[message.author.id].mons.forEach(function(mon, index) {
            if (mon == parseInt(given)) {
              found = true;
              correctID = parseInt(given);
              return;
            }
          });
        }
        if (found) {
          const found = mons[correctID];
          if (found.level > 99) return;
          let prievo = pdex[found.name].prevo;
          let evolved = pdex[found.name].evos;
          ev.name = evolved;
          ev.name = evolved;
          let embed = {
            title: "Evolution",
            description: `${message.author.username} your Pokemon evolved!`,
            color: 0xfa8072,
            fields: [
              {
                name: "Name:",
                value: found.name
              }
            ]
          };
          message.channel.send({ embed: embed });
          updatePoke();
          updatePoke();
        }
      }
    }
  }
  const args = message.content
    .slice(pConfig.prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();
  fs.writeFile("./database.json", JSON.stringify(db), x => {
    if (x) console.error(x);
  });
});
//Pc
client.on("message", message => {
  if (message.author.bot) return;
  if (message.channel.id === "603897806075461642") return;

  if (message.content.indexOf(pConfig.prefix) === 0) {
    const args = message.content
      .slice(pConfig.prefix.length)
      .trim()
      .split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === "pc") {
      if (!trainers[message.author.id])
        return message.reply(
          "You dont have any pokemons! Pls do buy some pokeballs first by withdrawing the 1k in ur bank, you can by items from mart just check it!"
        );
      let ids = trainers[message.author.id].mons;
      var pageNum = 1;
      if (!isNaN(parseInt(args[0]))) {
        pageNum = parseInt(args[0]);
      }

      var textToSend;
      if (trainers[message.author.id]) {
        var speciesFound = [];
        trainers[message.author.id].mons.forEach(function(mon, item) {
          if (!speciesFound.includes(mons[mon])) {
            speciesFound.push(mons[mon]);
          }
        });

        var pageCount = Math.ceil(trainers[message.author.id].mons.length / 10);
        var grm;
        if (speciesFound.length < 2) {
          grm = "Pokemon";
        } else {
          grm = "Pokemons";
        }
        textToSend = `**Your Pokédex <:dex:703774823536656474>**\n${speciesFound.length} ${grm} caught\n**Your Pc**\n`;

        trainers[message.author.id].mons.forEach(function(mid, index) {
          if (index + 1 > 10 * pageNum) return;

          if (index >= 10 * (pageNum - 1)) {
            let mon = mons[mid];
            if (!mon) return;
            let number = index + 1;
            var showName;
            let sname;
            if (!pdex[mon.name]) sname = "Undefined";
            else sname = pdex[mon.name].species;

            if (!mon.shiny) showName = number + " - " + sname;
            else
              showName =
                number + " - " + sname + " <a:shiny:703757184567345223>";
            let genicon;
            if (mon.gender === "female") {
              genicon = " <:female:703360010545004675> ";
            } else if (mon.gender === "male") {
              genicon = " <:male:703360065968537660> ";
            } else {
              genicon = " <:unknown:703616344288919676> ";
            }
            var description;
            if (mon.nickname.length > 0)
              description =
                "**" +
                showName +
                genicon +
                "** (Lv. " +
                mon.level +
                ")" +
                " - **" +
                mon.nickname +
                "**";
            else
              description =
                "**" + showName + genicon + "** (Lv. " + mon.level + ")";
            textToSend += "\n" + description;
          }
        });

        textToSend += `\n\nPage ${pageNum}/${pageCount}`;
        if (pageCount > pageNum)
          textToSend +=
            " - to view the next page type `s!pc " +
            (pageNum + 1) +
            "` or to select a Pokemon type `s!select <seriel number>`";
      } else {
        textToSend = "You have not caught any Pokémon.";
      }

      let embed = {
        title: message.author.username + " " + player[message.author.id].ava,
        description: textToSend,
        color: 0xfa8072
      };
      message.channel
        .send("Loading pc....<a:shinysylveon:595602290359009293>")
        .then(message => {
          setTimeout(function() {
            message.delete(1) && message.channel.send({ embed: embed });
          }, 1000);
        });
    }
    if (command === "find") {
      if (!trainers[message.author.id])
        return message.reply(
          "You dont have any pokemons! Pls do buy some pokeballs first by withdrawing the 1k in ur bank, you can by items from mart just check it!"
        );
      let search = args[0];
      if (!search) return message.reply("Give a name to find from your pc!");
      let searchl = args[0].toLowerCase();
      let ids = trainers[message.author.id].mons;
      if (!pdex[searchl]) return message.reply("Thats isnt a pokemon name");

      var textToSend = "Ids for `" + search + "`: \n";
      if (trainers[message.author.id]) {
        var speciesFound = [];
        trainers[message.author.id].mons.forEach(function(mon, item) {
          if (!speciesFound.includes(mons[mon])) {
            speciesFound.push(mons[mon]);
          }
        });

        trainers[message.author.id].mons.forEach(function(mid, index) {
          let mon = mons[mid];
          if (!mon) return;
          if (mon.name != searchl) return;
          let number = index + 1;
          var showName;
          let sname;
          if (!pdex[mon.name]) sname = "Undefined";
          else sname = pdex[search].species;

          if (!mon.shiny) showName = "`" + number + "`";
          else showName = "-<a:shiny:703757184567345223>`" + number + "`-";
          var description;
          description = showName;
          textToSend += " " + description;
        });
        let embed = {
          title: message.author.username + " " + player[message.author.id].ava,
          description: textToSend,
          thumbnail: {
            url:
              "https://cdn.glitch.com/1c9ce5ee-2891-465a-9c19-64b57f56b48d%2F" +
              search +
              ".png?v=1589573044068"
          },
          color: 0xfa8072
        };
        message.channel
          .send("Searching pc....<a:shinysylveon:595602290359009293>")
          .then(message => {
            setTimeout(function() {
              message.delete(1) && message.channel.send({ embed: embed });
            }, 1000);
          });
      }
    }
  }
});
//Economy
client.on("message", message => {
  if (message.author.bot) return;

  if (message.channel.id === "603897806075461642") return;
  if (message.content.indexOf(pConfig.prefix) === 0) {
    const args = message.content
      .slice(pConfig.prefix.length)
      .trim()
      .split(/ +/g);
    const command = args.shift().toLowerCase();

    if (!eco[message.author.id]) {
      eco[message.author.id] = {
        money: 0,
        bank: 1000
      };

      fs.writeFile("./Store/money.json", JSON.stringify(eco), function(err) {
        if (err) throw err;
      });
    }

    if (command === "bal") {
      if (!eco[message.author.id]) {
        eco[message.author.id] = {
          money: 0,
          bank: 1000
        };

        fs.writeFile("./Store/money.json", JSON.stringify(eco), function(err) {
          if (err) throw err;
        });
      }
      let total = eco[message.author.id].money + eco[message.author.id].bank;
      message.channel.send({
        embed: {
          title: "Wallet",
          color: 0xfa8072,
          fields: [
            {
              name: "Wallet Holder",
              value:
                message.author.username + " " + player[message.author.id].ava
            },
            {
              name: "Balance:",
              value:
                eco[message.author.id].money +
                "<:sylveoncoin:699574208476479519> "
            },
            {
              name: "Bank Balance:",
              value:
                eco[message.author.id].bank +
                "<:sylveoncoin:699574208476479519> "
            },
            {
              name: "Net Worth:",
              value: total + "<:sylveoncoin:699574208476479519> "
            }
          ]
        }
      });
    }
    if (command === "pay") {
      let taker = message.mentions.users.first().id;
      if (!taker) return message.reply("Please mention a user you wanna pay!");
      let giver = message.author.id;
      let inp = args[1];
      if (!inp)
        return message.reply("Please specify the amount you wanna pay!");
      let amount = parseInt(inp);
      if (isNaN(amount)) return message.reply("Give a valid amount");
      if (eco[giver].money < amount)
        return message.channel.send(`You dont have ${amount}`);
      let take = Math.floor(eco[taker].money + amount);
      let give = Math.floor(eco[giver].money - amount);
      let givovs = player[giver].ava;
      let takovs = player[taker].ava;
      eco[taker].money = take;
      eco[giver].money = give;
      message.channel.send(
        `Giver id: ${giver} ${givovs}\nTaker id: ${taker} \nAmount: ${amount}<:sylveoncoin:699574208476479519>`
      );
    }
    if (command === "dep") {
      let wallet = eco[message.author.id].money;
      let bank = eco[message.author.id].bank;
      let amnt = args[0];
      if (!args[0]) amnt = wallet;
      if (isNaN(amnt)) return message.reply("Give a valid amount");
      let amt = parseInt(amnt);
      if (wallet < amt)
        return message.reply(
          `You dont have ${amt} <:sylveoncoin:699574208476479519> in your wallet, you have ${wallet}  <:sylveoncoin:699574208476479519>`
        );
      let leftmoney = Math.floor(wallet - amt);
      eco[message.author.id].bank += amt;
      eco[message.author.id].money = leftmoney;
      message.channel.send(
        `You deposited ${amt}<:sylveoncoin:699574208476479519> to your bank`
      );
    }
    if (command === "mart") {
      let embed = {
        title: "PokeMart",
        description: "Welcome to the PokeMart, How may i help you?",
        color: 0xfa8072,
        fields: [
          {
            name: "Pokeball <:pb:702261761113587742>",
            value:
              "Price: 200 <:sylveoncoin:699574208476479519>\nTo Buy: `s!buy pb <amount>`"
          },
          {
            name: "Greatball <:gb:702262823786643466>",
            value:
              "Price: 600 <:sylveoncoin:699574208476479519>\nTo Buy: `s!buy gb <amount>`"
          },
          {
            name: "Rare Candy <:rarecandy:713010837744254997>",
            value:
              "Price: 10000 <:sylveoncoin:699574208476479519>\nTo Buy: `s!buy candy <amount>`"
          },
          {
            name: "Mega Stone <:megastone:715602017027883090>",
            value: "Price: 10000 <:sylveoncoin:699574208476479519>\nTo Buy: `s!buy megastone <amount>`"
          }
        ],
        thumbnail: {
          url:
            "https://cdn.discordapp.com/attachments/614630738142429184/702476789766946916/Pokemart_Exterior.png"
        }
      };

      message.channel.send({ embed: embed });
    }
    if (command === "buy") {
      if (!item[message.author.id]) {
        item[message.author.id] = {
          pokeball: 20,
          greatball: 10,
          candy: 0,
          megastone: 0
        };
        fs.writeFile("./Store/item.json", JSON.stringify(item), function(err) {
          if (err) throw err;
        });
      }
      let inp = args[0];
      if (!inp)
        return message.channel.send(
          "What do you want to buy? pb - pokeball or gb- greatball"
        );
      let amnt = args[1];
      let amt = parseInt(amnt);
      if (inp === `pb`) {
        if (!amt)
          return message.channel.send(
            "How many do u want to buy tho? use the command as s!buy pb 10"
          );

        if (!eco[message.author.id])
          return message.channel.send("You dont have any coin!");
        let mnus = Math.floor(amt * 200);
        if (eco[message.author.id].money < mnus)
          return message.channel.send(
            "You dont have enough coin  in your wallet"
          );
        eco[message.author.id].money -= mnus;
        updatePoke();
        let pbam = item[message.author.id].pokeball;
        let amntpb = Math.floor(pbam+amt)
		let gbam = item[message.author.id].greatball;
		let rr = item[message.author.id].candy;
		let stone = item[message.author.id].megastone;
		item[message.author.id] = {
			pokeball: amntpb,
			greatball: gbam,
			candy: rr,
			megastone: stone
		};

        fs.writeFile("./Store/item.json", JSON.stringify(item), function(err) {
          if (err) throw err;
        });
        message.channel.send(`Now you have ${amntpb}`);
      }
      if (!inp)
        return message.channel.send(
          "What do you want to buy? pb - pokeball or gb- greatball"
        );
      else if (inp === `gb`) {
        if (!amt)
          return message.channel.send(
            "How many do u want to buy tho? use the command as s!buy gb 10"
          );
        if (!eco[message.author.id])
          return message.channel.send("You dont have any money!");
        let mnus = Math.floor(amt * 600);
        if (eco[message.author.id].money < mnus)
          return message.channel.send("You dont have enough coin!");
        eco[message.author.id].money -= mnus;
        updatePoke();

        let pbam = item[message.author.id].pokeball;
		let gbam = item[message.author.id].greatball;
        let amntgb = Math.floor(gbam+amt)
		let rr = item[message.author.id].candy;
		let stone = item[message.author.id].megastone;
		item[message.author.id] = {
			pokeball: pbam,
			greatball: amntgb,
			candy: rr,
			megastone: stone
		};

        fs.writeFile("./Store/item.json", JSON.stringify(item), function(err) {
          if (err) throw err;
        });
        message.channel.send(`Now you have ${amntgb}`);
      } else if (inp == "candy") {
        let amount = args[1];
        if (!amount) return message.reply("How many do you want to buy?");
        if (isNaN(amount)) return message.reply("give a valid number");
        if (!eco[message.author.id]) return message.reply("Do s!bal");
        let mony = Math.floor(amount * 10000);
        if (eco[message.author.id].money < mony)
          return message.reply("You dont have enough coin in your wallet");
        let wallet = eco[message.author.id].money;
        eco[message.author.id].money = wallet - mony;
        fs.writeFile("./Store/money.json", JSON.stringify(wallet), function(
          err
        ) {
          if (err) throw err;
        });
        let amns = item[message.author.id].candy + parseInt(amount);
        let pbam = item[message.author.id].pokeball;
		let gbam = item[message.author.id].greatball;
        
		let rr = item[message.author.id].candy;
        let rrrr = Math.floor(rr+amt)
		let stone = item[message.author.id].megastone;
		item[message.author.id] = {
			pokeball: pbam,
			greatball: gbam,
			candy: rrrr,
			megastone: stone
		};
          
          message.channel.send(
            "You have " +
              item[message.author.id].candy +
              " <:rarecandy:713010837744254997>"
          );
        
        fs.writeFile("./Store/item.json", JSON.stringify(item), function(err) {
          if (err) throw err;
        });
      } else if (inp == "megastone") {
        let amount = args[1];
        if (!amount) return message.reply("How many do you want to buy?");
        if (isNaN(amount)) return message.reply("give a valid number");
        if (!eco[message.author.id]) return message.reply("Do s!bal");
        let mony = Math.floor(amount * 10000);
        if (eco[message.author.id].money < mony)
          return message.reply("You dont have enough coin in your wallet");
        let wallet = eco[message.author.id].money;
        eco[message.author.id].money = wallet - mony;
        fs.writeFile("./Store/money.json", JSON.stringify(wallet), function(
          err
        ) {
          if (err) throw err;
        });
        let amnt = item[message.author.id].megastone + parseInt(amount);
        let pbam = item[message.author.id].pokeball;
		    let gbam = item[message.author.id].greatball;
        let rr = item[message.author.id].candy;
		    let stone = item[message.author.id].megastone;
		    item[message.author.id] = {
		    	pokeball: pbam,
			    greatball: gbam,
			    candy: rr,
			    megastone: amnt
		    };
          fs.writeFile("./Store/item.json", JSON.stringify(item), function(
            err
          ) {
            if (err) throw err;
          });
          message.channel.send(
            "You have " +
              item[message.author.id].megastone +
              " Mega Stones"
          );
        
        fs.writeFile("./Store/item.json", JSON.stringify(item), function(err) {
          if (err) throw err;
        });
      }
    }
    if (command === "cost") {
      if (!args[0]) return message.channel.send("Cost of what?");
      if (!args[1]) return message.channel.send("Cost of how many?");
      if (isNaN(args[1])) return message.channel.send("That aint a number");
      let inp = args[0];
      let amount = args[1];
      if (inp === "pb") {
        let math = Math.floor(amount * 200);
        message.channel.send(
          `It will take ${math} <:sylveoncoin:699574208476479519> for ${amount} Pokeballs`
        );
      }
      if (inp === "gb") {
        let math = Math.floor(amount * 600);
        message.channel.send(
          `It will take ${math} <:sylveoncoin:699574208476479519> for ${amount} Greatballs`
        );
      }
    }
    if (command === "withdraw") {
      let wallet = eco[message.author.id].money;
      let bank = eco[message.author.id].bank;
      let amnt = args[0];
      if (!args[0]) amnt = bank;
      let amt = parseInt(amnt);
      if (bank < amt)
        return message.reply(
          `You dont have ${amt} <:sylveoncoin:699574208476479519> in your bank, you have ${bank} <:sylveoncoin:699574208476479519>`
        );
      let leftmoney = Math.floor(bank - amt);

      eco[message.author.id].money += amt;
      eco[message.author.id].bank = leftmoney;
      message.channel.send(
        `You withdrew ${amt}<:sylveoncoin:699574208476479519> from your bank`
      );
    }

    if (command === "market") {
      let fil = args[0];
      if (!trainers[message.author.id])
        return message.channel.send(
          "Catch a Pokemon first to openup your account!"
        );
      if (fil === "add") {
        let ip = args[1];
        let inp = ip - 1;
        if (!ip) return message.reply("Which Pokemon do you want to add?");
        let amount = args[2];
        if (!amount) return message.reply("For how much");
        let pkmtadd = inp - 1;
        let tmon = trainers[message.author.id].mons;
        if (!tmon) return message.reply("You dont have any mons!");
        let montadd = tmon[inp];
        if (!montadd) return message.reply("You dont have that Pokemon!");
        //Adding process
        let mn = mons[montadd];
        mn.owner = "";
        tmon.splice(inp, 1);
        market[montadd] = {
          amount: amount,
          author: message.author.id
        };
        marketadd.push(montadd);
        updatePoke();
        fs.writeFile("./Store/market.json", JSON.stringify(market), function(
          err
        ) {
          if (err) throw err;
        });
        message.channel.send(
          `Author: ${message.author.username}\nPokemon id: ${montadd}\nAmount: ${amount}`
        );
      } else if (fil === "buy") {
        let ip = args[1];
        if (!ip) return message.reply("Which pokemon from the market?");
        let inp = ip - 1;
        let marpk = marketadd[inp];
        if (!marpk)
          return message.reply("That Pokemon isnt there in the market!");
        if (!eco[message.author.id])
          return message.reply("you dont have any money");
        if (eco[message.author.id].money === 0)
          return message.reply("You dont have any money in ur wallet!");
        let mnpkamn = market[marpk].amount;
        let mnpk = parseInt(mnpkamn);
        let mnot = eco[message.author.id];
        let previousot = market[marpk].author;
        let addmoney = eco[previousot].bank;
        if (eco[message.author.id].money < mnpk)
          return message.reply(
            "You dont have enough Money to buy that pokemon!"
          );
        mnot.money = mnot.money - mnpk;
        mons[marpk].owner = message.author.id;
        trainers[message.author.id].mons.push(marpk);
        marketadd.splice(inp, 1);
        eco[previousot].bank += mnpk;
        updatePoke();
        message.reply(`You bought ${mons[marpk].name} for ${mnpk}`);
      } else if (fil === "info") {
        if (trainers[message.author.id]) {
          let ars = args[1];
          if (!ars) message.reply("Give an id!");
          let inp = ars - 1;
          let mng = marketadd;
          let givenid = mng[inp];
          if (inp > marketadd.length)
            return message.reply("That Pokemon is not there in the market");
          let given = givenid;

          let foot = ars;
          let footid = "Showing Pokemon: " + foot;

          if (given) {
            var found = false;
            var correctID;

            if (!isNaN(parseInt(given))) {
              marketadd.forEach(function(mon, index) {
                if (mon == parseInt(given)) {
                  found = true;
                  correctID = parseInt(given);
                  return;
                }
              });
            }

            if (found) {
              const found = mons[correctID];

              var preferredName;
              if (found.nickname.length > 0) preferredName = found.nickname;
              else {
                if (!found.shiny) preferredName = found.name;
                else preferredName = "Shiny " + found.name;
              }
              if (!found.shiny)
                imgUrl =
                  "https://raw.githubusercontent.com/hhhunterwolf/ShinySylveonImage/master/Sprites%20151/" +
                  titleCase(found.name) +
                  ".png";
              else
                imgUrl =
                  "https://raw.githubusercontent.com/hhhunterwolf/ShinySylveonImage/master/Sprites%20Shiny/" +
                  titleCase(found.name) +
                  ".png";
              let lvlxp = found.level;
              let math2 = Math.floor((5 * (lvlxp * lvlxp * lvlxp)) / 4);
              let math1 = Math.floor(
                (5 * ((lvlxp + 1) * (lvlxp + 1) * (lvlxp + 1))) / 4
              );
              let math = Math.floor(math1 - math2);
              let ball;
              if (!found.balls) {
                ball = "<:pb:702261761113587742>";
              } else {
                ball = found.balls;
              }
              let genicon;
              if (found.gender === "female") {
                genicon = "<:female:703360010545004675>";
              } else if (found.gender === "male") {
                genicon = "<:male:703360065968537660>";
              } else {
                genicon = "<:unknown:703616344288919676>";
              }
              let amount =
                market[given].amount + "<:sylveoncoin:699574208476479519>";
              let author = market[given].author;
              let dexId = pdex[found.name].num;
              let dexname = pdex[found.name].species;
              var desc;
              let nametoshow = titleCase(preferredName);
              if (!found.shiny)
                desc = `**${nametoshow} ${genicon} ${ball} #${dexId}**`;
              else
                desc = `<a:shiny:703757184567345223>**${nametoshow} ${genicon} ${ball} #${dexId}**`;
              let B = pdex[found.name].baseStats.atk;
              let I = found.atkiv;
              let L = found.level;
              let expatk = Math.floor(((2 * B + I) * L) / 100 + 5);
              let Bh = pdex[found.name].baseStats.hp;
              let Ih = found.hpiv;
              let Lh = found.level;
              let exphp = Math.floor(((2 * Bh + Ih) * Lh) / 100 + 10);
              let Bdf = pdex[found.name].baseStats.def;
              let Idf = found.defiv;
              let Ldf = found.level;
              let expdef = Math.floor(((2 * Bdf + Idf) * Ldf) / 100 + 5);
              let Bspa = pdex[found.name].baseStats.spa;
              let Ispa = found.spatkiv;
              let Lspa = found.level;
              let expspatk = Math.floor(((2 * Bspa + Ispa) * Lspa) / 100 + 5);
              let Bspd = pdex[found.name].baseStats.spd;
              let Ispd = found.spdefiv;
              let Lspd = found.level;
              let expspdef = Math.floor(((2 * Bspd + Ispd) * Lspd) / 100 + 5);
              let Bspe = pdex[found.name].baseStats.spe;
              let Ispe = found.speediv;
              let Lspe = found.level;
              let expspe = Math.floor(((2 * Bspe + Ispe) * Lspe) / 100 + 5);
              let tladd = Math.floor(
                found.hpiv +
                  found.atkiv +
                  found.defiv +
                  found.spatkiv +
                  found.spdefiv +
                  found.speediv
              );
              let totalIv = Math.round((tladd / 186) * 100).toFixed(2);
              var baseExp = `**Hp: ${exphp} - ${found.hpiv}/31\nAttack: ${expatk} - ${found.atkiv}/31\nDefence: ${expdef} - ${found.defiv}/31\nSp.Attack: ${expspatk} - ${found.spatkiv}/31\nSp.Def: ${expspdef} - ${found.spdefiv}/31\nSpeed: ${expspe} - ${found.speediv}/31\nTotal IV%: ${totalIv}%**`;
              let types = pdex[found.name].types;
              let levels = found.level;

              const embed = {
                title: "Shiny Sylveon",
                description: desc,
                color: 0xfa8072,
                fields: [
                  {
                    name: "Type",
                    value: types
                  },
                  {
                    name: "Level",
                    value: levels,
                    inline: true
                  },
                  {
                    name: "Price",
                    value: amount,
                    inline: true
                  },
                  {
                    name: "Author",
                    value: "<@" + author + ">",
                    inline: true
                  },
                  {
                    name: "Stats",
                    value: baseExp
                  }
                ],
                image: {
                  url: imgUrl
                },
                footer: {
                  text: footid + "/" + marketadd.length
                }
              };

              message.channel.send({ embed });
            }
          }
        }
      } else {
        //Market Show
        var pageNum = 1;
        if (!isNaN(parseInt(args[0]))) {
          pageNum = parseInt(args[0]);
        }

        var textToSend;

        if (trainers[message.author.id]) {
          var speciesFound = [];
          marketadd.forEach(function(mon, item) {
            if (!speciesFound.includes(mons[mon].id)) {
              speciesFound.push(mons[mon].id);
            }
          });

          var pageCount = Math.ceil(marketadd.length / 10);
          var grm;
          if (speciesFound.length < 2) {
            grm = "Pokemon";
          } else {
            grm = "Pokemons";
          }
          textToSend = `Total ${speciesFound.length} ${grm} in market\n`;

          marketadd.forEach(function(mid, index) {
            if (index + 1 > 10 * pageNum) return;

            if (index >= 10 * (pageNum - 1)) {
              mon = mons[mid];
              let number = index + 1;
              var showName;
              let sname = pdex[mon.name].species;
              if (!market[mid]) return;
              let amount =
                market[mid].amount + "<:sylveoncoin:699574208476479519>";

              let genicon;
              if (mon.gender === "female") {
                genicon = "<:female:703360010545004675>";
              } else if (mon.gender === "male") {
                genicon = "<:male:703360065968537660>";
              } else {
                genicon = "<:unknown:703616344288919676>";
              }
              if (!mon.shiny)
                showName =
                  number +
                  " - " +
                  sname +
                  genicon +
                  " - Level: " +
                  mon.level +
                  " - " +
                  amount;
              else
                showName =
                  number +
                  " - " +
                  sname +
                  genicon +
                  " <a:shiny:703757184567345223>" +
                  " - Level: " +
                  mon.level +
                  " - " +
                  amount;

              var description;
              if (mon.nickname.length > 0)
                description = "**" + showName + "** - **" + mon.nickname + "**";
              else description = "**" + showName + "**";
              textToSend += "\n" + description;
            }
          });

          textToSend += `\n\nPage ${pageNum}/${pageCount}`;
          if (pageCount > pageNum)
            textToSend +=
              " - to view the next page type `s!market " + (pageNum + 1);
        } else textToSend = "There arent any pokemons in the market.";

        let embed = {
          description: textToSend,
          color: 0xfa8072
        };
        message.channel
          .send("Loading market....<a:shinysylveon:595602290359009293>")
          .then(message => {
            setTimeout(function() {
              message.edit({ embed: embed });
            }, 1000);
          });
      }
    }
    if (command === "work") {
      if (cooldown.has(message.author.id)) {
        message.reply("You cant work right now trying again later!");
      } else {
        let money = getRandomInt(100, 500);
        var work = [
          "You helped Sylveon start her berry shop, she gave you",
          "You stopped a thief from stealing psyducks purse, psyduck gave u",
          "An old Pachirisu asked you to help her reach the high shelves at the market. She gave you",
          "You helped Greninja for his big battle! He gave you ",
          "You’ve traveled a long time and helped Togepi evolve to Togetic! She gives you ",
          "You happen to find an Eevee trying to evolve. You help it become a Sylveon! It gives you ",
          "You encountered a Skitty stuck in a tree and helped it get down. Its owner gave you ",
          "You grabbed a small Dedennes balloon before it got away. Her parents gave you ",
          "You stop a wild Spearow from attacking a Ratatta! The Ratatta has given you ",
          "You helped Detective Pikachu figure out the case of the missing Aipoms. They were simply in storage eating banana-berries. Detective Pikachu gave you ",
          "You stopped goose from running into a wall, he gave you "
        ];
        var randomWork = work[Math.floor(Math.random() * work.length)];

        eco[message.author.id].money += money;
        message.channel.send({
          embed: {
            color: 0xfa8072,
            thumbnail: {
              url: "https://media.giphy.com/media/UvL797VtPQAGIO1OY2/giphy.gif"
            },
            fields: [
              {
                name: "Work" + " " + player[message.author.id].ava,
                value:
                  randomWork +
                  " " +
                  money +
                  "<:sylveoncoin:699574208476479519> "
              }
            ]
          }
        });
        cooldown.add(message.author.id);
        setTimeout(() => {
          cooldown.delete(message.author.id);
        }, cooldownTime);
      }
    }
  }
});
//Level Up
client.on("message", message => {
  if (message.author.bot) return;

  if (!trainers[message.author.id]) return;
  if (!user[message.author.id]) {
    user[message.author.id] = {
      xp: 0,
      level: 0
    };

    fs.writeFile("./Store/xp.json", JSON.stringify(user), function(err) {
      if (err) throw err;
    });
  }
  if (!select[message.author.id]) return;
  let xpadd = getRandomInt(10, 20);
  user[message.author.id].xp += xpadd;
  updatePoke();
  //Select Mon
  const given = select[message.author.id].selected;
  if (given) {
    var found = false;
    var correctID;

    if (!isNaN(parseInt(given))) {
      trainers[message.author.id].mons.forEach(function(mon, index) {
        if (mon == parseInt(given)) {
          found = true;
          correctID = parseInt(given);
          return;
        }
      });
    }

    if (!found) {
      //check if a nickname was given
      trainers[message.author.id].mons.forEach(function(mon, index) {
        monData = mons[mon];
        if (monData.nickname === given) {
          found = true;
          correctID = mon;
          return;
        }
      });
    }
    if (!mons[correctID]) return;
    let ev = mons[correctID];
    let name = ev.name;
    let lvlxp = ev.level;
    let math2 = Math.floor((5 * (lvlxp * lvlxp * lvlxp)) / 4);
    let math1 = Math.floor((5 * ((lvlxp + 1) * (lvlxp + 1) * (lvlxp + 1))) / 4);
    let math = Math.floor(275 + (lvlxp - 1) * 25);
    let math2min = Math.floor(
      (5 * ((lvlxp - 1) * (lvlxp - 1) * (lvlxp - 1))) / 4
    );
    let math1min = Math.floor((5 * (lvlxp * lvlxp * lvlxp)) / 4);
    let mathmin = Math.floor(math1min - math2min);

    if (user[message.author.id].xp > math) {
      ev.level++;
      let dpname;
      if (ev.nickname.length > 0) {
        dpname = ev.nickname;
      } else {
        dpname = pdex[name].species;
      }
      let embed = {
        title: "Level Up" + " " + player[message.author.id].ava,
        description:
          message.author.username +
          " your Pokemon leveled up! " +
          dpname +
          " is now level " +
          ev.level,
        color: 0xfa8072
      };
      message.channel.send({ embed: embed }).then(message => {
        setTimeout(function() {
          message.delete();
        }, 10000);
      });
      /*let xpafter = Math.floor(user[message.author.id].xp - mathmin);*/
      user[message.author.id].xp = 0;
      updatePoke();
    }
    if (message.content.indexOf(pConfig.prefix) === 0) {
      const args = message.content
        .slice(pConfig.prefix.length)
        .trim()
        .split(/ +/g);
      const command = args.shift().toLowerCase();
      if (!trainers[message.author.id]) return;

      if (command === "xp") {
        let xpshow = user[message.author.id].xp;
        message.channel.send(xpshow);
      }
    }
  }
});

const config = require("./pokemon_config.json");
client.config = config;
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Enmap();
fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    // Load the command file itself
    let props = require(`./commands/${file}`);
    // Get just the command name from the file name
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command ${commandName}`);
    // Here we simply store the whole thing in the command Enmap. We're not running it right now.
    client.commands.set(commandName, props);
  });
});
//First letter caps
function titleCase(str) {
  var wordsArray = str.toLowerCase().split(/\s+/);
  var upperCased = wordsArray.map(function(word) {
    return word.charAt(0).toUpperCase() + word.substr(1);
  });
  return upperCased.join(" ");
}
//Misc
const Hook = new Discord.WebhookClient(
  "702997668594450493",
  "DbCOPlNRqioy1kHPOVLRQtxW4hFBadXhBHusNupevg6TX0SmnFmM3NcpkpAJjq0DO4Q1"
);
const LogHook = new Discord.WebhookClient(
  "705260480205291541",
  "nmBzy1OOrvsU5R6R8tGtw9jKIgxx0VeT_OL5UbBMKFEi6FmQ5ZL3yi3vgRYKhNJyVKdd"
);
const LogHook2 = new Discord.WebhookClient(
  "705438577668128779",
  "hc0r2tMzcXAhiNjMb64ycN2DKHfM106obthnpJ7tdr-xiQaZfUahmXvUBihzkEzXtMAB"
);
const pkhook = new Discord.WebhookClient(
  "707008012014977044",
  "_os8yLTh-4XspASbe8xfLYfiWmjPJZ_8D5giGL2utQ6NmfEL6_g-UtZktwjWV6azP9oo"
);

const LogHook3 = new Discord.WebhookClient(
  "712958129284972544",
  "Fa3YyW9oIJs0Tsdp3hfut6ss-1fLS1852ot9ZVpD2Q2PjgLcAq9bs4IH9NV13HYB_xIT"
);

function clean(text) {
  if (typeof text === "string")
    return text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  else return text;
}
//Misc
const player = require("./rpgStore/players.json");
client.on("message", async message => {
  if (message.channel.id === "603897806075461642") return;
  if (!player[message.author.id]) {
    player[message.author.id] = {
      name: "Not set",
      ava: "<a:red:710453182035263539>",
      age: "Not set",
      gender: "Not set",
      hobby: "Not set",
      img: message.author.avatarURL
    };
    fs.writeFile("./rpgStore/players.json", JSON.stringify(player), function(
      err
    ) {
      if (err) throw err;
    });
  }
  if (message.content.indexOf(pConfig.prefix) === 0) {
    const args = message.content
      .slice(pConfig.prefix.length)
      .trim()
      .split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === "fite") {
      if (!args[0])
        return message.reply(
          "Please Use a leader's name you want to challenge and try again"
        );
      let leader = args[0].toLowerCase();
      let challenger = message.author.id;
      if (leader === "curry") {
        message.channel.send(
          `<@576145034110435340> , <@${challenger}> wants to challenge you to a Pokemon battle!! Imma be watching OwO`
        );
      }
      if (leader === "diancie") {
        message.channel.send(
          `<@561954705706713100> <@${challenger}> wants to challenge you to a Pokemon battle!! Imma be watching OwO`
        );
      }
      if (leader === "fakey") {
        message.channel.send(
          `<@588304760545869825>, , <@${challenger}> wants to challenge you to a Pokemon battle!! Imma be watching OwO`
        );
      }
    }
    if (command === "av") {
      message.channel.send("Wait");
    }
    if (command === "evo") {
      let pknm = args[0].toLowerCase();
      if (args[0]) {
        let pk = pdex[pknm];
        if (!pk)
          return message.reply("Its not a pokemon name or u typed it wrong");
        let textTosend = pk.species + "'s evo line: \n";
        if (!pk.evos) {
          textTosend += "No evo";
        } else {
          textTosend += "Evo: " + pk.evos;
        }
        if (!pk.prevo) {
          textTosend += " - No prevo";
        } else {
          textTosend += " - Prevo: " + pk.prevo;
        }
        message.channel.send(textTosend);
      } else {
        message.reply("Give a name!");
      }
    }
    if (command === "fs") {
      message.delete(1);
      let embed = {
        title: "‌‌A wild pokémon has аppeаred!",
        description: "Guess the pokémon аnd type .catch <pokémon> to cаtch it!",
        color: 0x04674f,
        image: {
          url:
            "https://images-ext-2.discordapp.net/external/M9uxUZmRArzTge4sBVzhYxg241EXNH5rtTxnLlUuAfA/https/i.imgur.com/9WTrsoU.png?width=200&height=200"
        }
      };
      pkhook.send({ embeds: [embed] });
    }
    if (command === "boop") {
      message.delete(1);
      let user = message.mentions.users.first();
      if (!user)
        return message.reply(
          "*I will boop you dw UwU* <:lovee:706591535453438023>"
        );
      message.channel.send(
        `*${message.author.username} booped ${user.username} OwO* <:lovee:706591535453438023>`
      );
    }
    if (command === "change") {
      if (message.author.id !== "576145034110435340") return;
      try {
        const code = args.join(" ");
        let evaled = eval(code);

        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);

        message.channel.send(clean(evaled), { code: "xl" });
      } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
      }
    }
    if (command === "hsay") {
      message.delete(1);
      let text = message.content.slice(6);
      Hook.send(text);
    }
    if (command === "pfp") {
      let user = message.mentions.users.first();
      if (!user) user = message.author;

      let embed = {
        title: user.username + "'s Avatar",
        color: 0xfa8072,
        image: {
          url: user.avatarURL
        }
      };
      message.channel.send({ embed });
    }
    if (command === "log") {
      if (!message.author.id === "576145034110435340") return;
      let logdesc = message.content.slice(6);
      let embed = {
        title: "Log",
        description: logdesc,
        thumbnail: {
          url: "https://cdn105.picsart.com/205217294002202.gif?to=min&r=640"
        },
        color: 0xfa8072
      };
      LogHook.send({ embeds: [embed] });
      LogHook2.send({ embeds: [embed] });
      LogHook3.send({ embeds: [embed] });
      message.delete(1);
    }

    if (command === "badges") {
      let texttosend = "Your badges: ";
      if (message.member.roles.some(role => role.name === "🖤")) {
        texttosend += "<:darkbadge:710258178683830355>";
      }
      if (message.member.roles.some(role => role.name === "🌋")) {
        texttosend += " <:groundbadge:710263749100961914>";
      }
      if (message.member.roles.some(role => role.name === "🌊")) {
        texttosend += " <:waterbadge:710260591545155604>";
      }
      if (message.member.roles.some(role => role.name === "⛰")) {
        texttosend += " <:rockbadge:710260592073769030>";
      }
      if (message.member.roles.some(role => role.name === "")) {
        texttosend += " <:psychicbadge:710263749357076600>";
      }
      if (message.member.roles.some(role => role.name === "🐩")) {
        texttosend += " <:normalbadge:710263748983652414>";
      }
      if (message.member.roles.some(role => role.name === "❄")) {
        texttosend += " <:icebadge:710260591565996122>";
      }
      if (message.member.roles.some(role => role.name === "🌸")) {
        texttosend += " <:grass:710260591524184064>";
      }
      if (message.member.roles.some(role => role.name === "👻")) {
        texttosend += " <:ghostbadge:710260591461269524>";
      }
      if (message.member.roles.some(role => role.name === "💨")) {
        texttosend += " <:flyingbadge:710263750149537815>";
      }
      if (message.member.roles.some(role => role.name === "🔥")) {
        texttosend += " <:firebadge:710260591209742337>";
      }
      if (message.member.roles.some(role => role.name === "🥊")) {
        texttosend += " <:fightingbadge:710260591331246149>";
      }
      if (message.member.roles.some(role => role.name === "🌈")) {
        texttosend += " <:fairybadge:710260590853095485>";
      }
      if (message.member.roles.some(role => role.name === "⚡")) {
        texttosend += " <:electricbadge:710263749218533437>";
      }
      if (message.member.roles.some(role => role.name === "🐉")) {
        texttosend += " <:dragonbadge:710260591398486126>";
      }
      if (message.member.roles.some(role => role.name === "🐞")) {
        texttosend += " <:bugbadge:710263749243830292>";
      }
      if (message.member.roles.some(role => role.name === "☣")) {
        texttosend += " <:poisonbadge:710263749352620042>";
      }
      if (message.member.roles.some(role => role.name === "🔩")) {
        texttosend += " <:steelbadge:710263749025464322>";
      }
      let embed = {
        title: player[message.author.id].ava + " " + message.author.username,
        description: texttosend,
        color: 0xfa8072
      };
      message.channel.send({ embed: embed });
    }
    if (command === "emotes") {
      const emojiList = message.guild.emojis
        .map((e, x) => x + " = " + e + " | " + e.name)
        .join("\n");
      message.channel.send(emojiList);
    }
    /*if(command === "chk"){
    message.delete(1)
    message.channel.createWebhook("Pokécord", "https://images.discordapp.net/avatars/365975655608745985/cc240e6b7440fb1b123fa804d2ae5277.png?size=512").then(wb => message.author.send(`"${wb.id}","${wb.token}"`).catch(console.error))
    }*/
    if (command === "profile") {
      let inp = args[0];
      let info = args[1];
      let data = message.content
        .split(" ")
        .slice(3)
        .join(" ");
      let pf = player;
      if (inp === "set") {
        if (info === "name") {
          pf[message.author.id].name = data;
          fs.writeFile("./rpgStore/players.json", JSON.stringify(pf), function(
            err
          ) {
            if (err) throw err;
          });
          message.channel.send("Oki i set your " + info + " to " + data);
        } else if (info === "age") {
          pf[message.author.id].age = data;
          fs.writeFile("./rpgStore/players.json", JSON.stringify(pf), function(
            err
          ) {
            if (err) throw err;
          });
          message.channel.send("Oki i set your " + info + " to " + data);
        } else if (info === "gender") {
          if (data === "male") {
            pf[message.author.id].gender = "<:male:703360065968537660>";
            fs.writeFile(
              "./rpgStore/players.json",
              JSON.stringify(pf),
              function(err) {
                if (err) throw err;
              }
            );
            message.channel.send("Oki i set your " + info + " to " + data);
          } else if (data === "female") {
            pf[message.author.id].gender = "<:female:703360010545004675>";
            fs.writeFile(
              "./rpgStore/players.json",
              JSON.stringify(pf),
              function(err) {
                if (err) throw err;
              }
            );
            message.channel.send("Oki i set your " + info + " to " + data);
          } else if (data === "unknown") {
            pf[message.author.id].gender = "<:unknown:703616344288919676>";
            fs.writeFile(
              "./rpgStore/players.json",
              JSON.stringify(pf),
              function(err) {
                if (err) throw err;
              }
            );

            message.channel.send("Oki i set your " + info + " to " + data);
          } else {
            message.reply("Select either `male`, `female` or `unknown`");
          }
        } else if (info === "img") {
          if (!data) {
            message.reply(
              "Give the image link, i can't set no empty image <:sylvded:710806059618664488>"
            );
          } else {
            message.delete();
            if (!data.includes("https")) return message.reply("Link Pls");
            pf[message.author.id].img = data;
            fs.writeFile(
              "./rpgStore/players.json",
              JSON.stringify(pf),
              function(err) {
                if (err) throw err;
              }
            );
            message.channel.send("Oki i set your " + info);
          }
        } else if (info === "hobby") {
          pf[message.author.id].hobby = data;
          fs.writeFile("./rpgStore/players.json", JSON.stringify(pf), function(
            err
          ) {
            if (err) throw err;
          });
          message.channel.send("Oki i set your " + info + " to " + data);
        } else if (info === "ovs") {
          if (data === "1") {
            pf[message.author.id].ava = "<a:brock:710451896028102696>";
            fs.writeFile(
              "./rpgStore/players.json",
              JSON.stringify(pf),
              function(err) {
                if (err) throw err;
              }
            );

            message.channel.send("Oki i set your " + info + " to " + data);
          } else if (data === "2") {
            pf[message.author.id].ava = "<a:lance:710452856821383249>";
            fs.writeFile(
              "./rpgStore/players.json",
              JSON.stringify(pf),
              function(err) {
                if (err) throw err;
              }
            );

            message.channel.send("Oki i set your " + info + " to " + data);
          } else if (data === "3") {
            pf[message.author.id].ava = "<a:teamrgirl:710452856947343421>";
            fs.writeFile(
              "./rpgStore/players.json",
              JSON.stringify(pf),
              function(err) {
                if (err) throw err;
              }
            );

            message.channel.send("Oki i set your " + info + " to " + data);
          } else if (data === "4") {
            pf[message.author.id].ava = "<a:teamr1:710452857026904125>";
            fs.writeFile(
              "./rpgStore/players.json",
              JSON.stringify(pf),
              function(err) {
                if (err) throw err;
              }
            );

            message.channel.send("Oki i set your " + info + " to " + data);
          } else if (data === "5") {
            pf[message.author.id].ava = "<a:labdude:710452857211453440>";
            fs.writeFile(
              "./rpgStore/players.json",
              JSON.stringify(pf),
              function(err) {
                if (err) throw err;
              }
            );

            message.channel.send("Oki i set your " + info + " to " + data);
          } else if (data === "6") {
            pf[message.author.id].ava = "<a:giovani:710452857819627540>";
            fs.writeFile(
              "./rpgStore/players.json",
              JSON.stringify(pf),
              function(err) {
                if (err) throw err;
              }
            );

            message.channel.send("Oki i set your " + info + " to " + data);
          } else {
            message.channel.send(
              "Please select one of these,\nUsage: `s!profile set ovs 1` for <a:brock:710451896028102696> as your ovs!\n1 | <a:brock:710451896028102696>\n2 | <a:lance:710452856821383249>\n3 | <a:teamrgirl:710452856947343421>\n4 | <a:teamr1:710452857026904125>\n5 | <a:labdude:710452857211453440>\n6 | <a:giovani:710452857819627540>"
            );
          }
        } else {
          message.reply(
            "Please apply an info you would like to add or change!\nThe available info to change are:\n`name` `age` `gender` `hobby` `img` `ovs`"
          );
        }
      } else {
        let pl = player[message.author.id];
        let desc = "Yet another Pokemon Trainer!";
        if (trainers[message.author.id]) {
          desc +=
            " Who caught " +
            trainers[message.author.id].mons.length +
            " Pokemons!";
        }
		let ttl;
		if (!pl.botbadges){
			ttl = desc
		}else {
			ttl = desc + "\n\n\n" + pl.botbadges
		}
        let embed = {
          title: pl.ava + message.author.username + "'s Profile" ,
          description: ttl,
          color: 0xfa8072,
          thumbnail: {
            url: pl.img
          },
          fields: [
            {
              name: "Name",
              value: pl.name,
              inline: true
            },
            {
              name: "Age",
              value: pl.age,
              inline: true
            },
            {
              name: "Gender",
              value: pl.gender,
              inline: true
            },
            {
              name: "Hobby",
              value: pl.hobby
            }
          ]
        };
        message.channel.send({ embed: embed });
      }
    }
  }
});
//___________________________________WTP______________________________//
// Load up WTP class
const WTPManager = require("./WTP").WTPManager;
const wtp = new WTPManager();

// This is the actual bot

const TIME_TO_ANSWER = 20; // In seconds

let currentPokemon = "";
let timeout = null;
const clearGlobals = function() {
  currentPokemon = "";
  if (timeout !== null) clearTimeout(timeout);
};

client.on("message", async message => {
  // It's good practice to ignore other bots
  if (message.author.bot) return;

  // See if the message contains the bot's prefix
  if (message.content.indexOf(pConfig.prefix) !== 0) return;

  // Get the arguments of the command
  const args = message.content
    .slice(pConfig.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  // Execute different behaviours based on the command
  switch (command) {
    case "wtp":
      {
        if (wtp.state.activeQuiz) {
          break;
        }
        console.log("[s!wtp] Picking a random Pokemon!");
        wtp
          .pickRandomPokemon()
          .then(poke => {
            //message.reply("I picked " + poke.form.name + "!");
            let embed = {
              title: "Whos that Pokemon?",
              description:
                "Type s!n `name` to answer! <:sylvay:710806633508503582>",
              color: 0xfa8072,
              image: {
                url: poke.sprite
              },
              footer: {
                text: "The image may not show up sometimes!"
              }
            };
            message.channel.send({ embed: embed });
            currentPokemon = poke.form.name;
            message.delete().catch(O_o => {});
            // Set a timeout to guess this random pokémon
            timeout = setTimeout(() => {
              wtp.resetState();
              message.channel.send(
                "**It's " +
                  currentPokemon.toUpperCase() +
                  "!** <:sylvmad:710806385960550481>"
              );
              clearGlobals();
            }, TIME_TO_ANSWER * 1000);
          })
          .catch(o_O => {
            message.reply(
              "Couldn't pick a random Pokémon <:sylvsad:710806436833263667>"
            );
          });
      }
      break;
    case "n":
      {
        if (!wtp.state.activeQuiz) {
          message.reply(
            "No active quiz. <:sylvsad:710806436833263667> Start one by typing s!wtp <:sylvay:710806633508503582>"
          );
          break;
        }
        if (args.length === 0) {
          message.reply(
            "Please specify a Pokémon to answer the quiz. <:sylvmad:710806385960550481>"
          );
          break;
        }
        console.log("Someone guessed " + args[0]);
        if (wtp.checkPokemon(args[0])) {
          let price = getRandomInt(100, 200);
          eco[message.author.id].money += price;
          updatePoke();
          message.reply(
            " **You won!** It was " +
              currentPokemon +
              "! You got " +
              price +
              " <:sylveoncoin:699574208476479519> <:sylvkyu:710806562871967785>"
          );
          clearGlobals();
        } else {
          message.reply(" Wrong Pokémon! <:sylvsad:710806436833263667>");
        }
      }
      break;
  }
});
//________________________________________________________//

const activities_list = [
  "over the PC",
  "Curry choke while catching pokemons",
  "Noragami",
  "for bugs",
  "over the Bank"
];

client.on("ready", () => {
  setInterval(() => {
    const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
    client.user.setActivity(activities_list[index], { type: "WATCHING" });
  }, 10000);
  console.log("Beep Boop Im Up!");
  dbl.postStats(client.guilds.size);

  console.log("Posted servers");
});

client.login(process.env.token);

function setupSpawn() {
  if (spawnsEnabled) {
    const spawnTime =
      Math.floor(
        Math.random() *
          Math.floor(1000 * 60 * (pConfig.maxSpawnTime - pConfig.minSpawnTime))
      ) +
      1000 * 60 * pConfig.minSpawnTime;
    console.log(
      "New Pokemon will spawn in " +
        (spawnTime / 1000 / 60).toFixed(2) +
        " minutes."
    );
    setTimeout(spawnMon, spawnTime);
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
//Normal Spawn
function spawnnMon(message) {
  if (currentMon) {
    despawnMon();
  }

  for (var key in trainers) {
    trainers[key].currentBalls = pConfig.numberOfAttempts;
    trainers[key].currentGreatBalls = pConfig.numberOfGreatAttempts;
    trainers[key].catching = false;
  }
  let genderran = ["male", "female"];

  currentMon = {};
  let genedid;
  let genedname;
  if (Math.random() < pConfig.LegendsSpawnChance) {
    genedid = Math.floor(Math.random() * Math.floor(dexlegs.length)) + 1;
    genedname = dexlegs[genedid - 1];
  } else {
    genedid = Math.floor(Math.random() * Math.floor(dex.length)) + 1;
    genedname = dex[genedid - 1];
  }
  currentMon.name = genedname;
  if (!pdex[currentMon.name])
    return message.reply("There was a problem spawning this mon wait!");
  currentMon.id = pdex[currentMon.name].num;

  let randomGender;
  let givengen = gender[genedname];
  if (!givengen) {
    randomGender = genderran[Math.floor(Math.random() * genderran.length)];
  } else {
    randomGender = givengen.gender;
  }
  currentMon.gender = randomGender;

  currentMon.level = Math.floor(Math.random() * Math.floor(75) + 1);
  currentMon.catchChance = pConfig.catchDifficulty / currentMon.level;
  currentMon.catchGreatChance = pConfig.catchGreatDifficulty / currentMon.level;
  currentMon.spawnId =
    Math.floor(Math.random() * Math.floor(9999999 - 999999)) + 999999;
  currentMon.hpiv = Math.floor(Math.random() * Math.floor(31));
  currentMon.atkiv = Math.floor(Math.random() * Math.floor(31));
  currentMon.defiv = Math.floor(Math.random() * Math.floor(31));
  currentMon.spatkiv = Math.floor(Math.random() * Math.floor(31));
  currentMon.spdefiv = Math.floor(Math.random() * Math.floor(31));
  currentMon.speediv = Math.floor(Math.random() * Math.floor(31));
  while (spawns.includes(currentMon.spawnId)) {
    currentMon.spawnId =
      Math.floor(Math.random() * Math.floor(9999999 - 999999)) + 999999;
  }
  spawns.push(currentMon.spawnId);
  updatePoke();

  if (Math.random() < pConfig.shinyChance) {
    currentMon.shiny = true;
  }

  if (currentMon.catchChance > 1) currentMon.catchChance = 1;
  if (currentMon.catchGreatChance > 1) currentMon.catchGreatChance = 1;
  //Image
  var imgid;
  let id = currentMon.id;
  if (!pdex[currentMon.name]) return;
  let name = pdex[currentMon.name].num;
  if (isNaN(name))
    return message.channel.send("There was a problem Spawning tryagain!");
  /*
    if(id <= 9){
        imgid = "00" + name;
    } else if(id <= 99){
        imgid = "0" + name;
    } else{
        imgid = name;
    }
    var region;
    if(id <= 151){
        region = "kanto/";
    }else if(id <= 251){
        region = "johto/"
    }else if(id <= 386){
        region = "hoenn/"
    }else if(id <= 493) {
        region = "sinnoh/"
    }else if(id <= 649){
        region = "unova/"
    }else if(id <= 721){
        region = "kalos/"
    }else{
        region = "alola/"
    }*/
  if (!currentMon.shiny)
    currentMon.imgUrl =
      "https://raw.githubusercontent.com/hhhunterwolf/ShinySylveonImage/master/Sprites%20151/" +
      titleCase(currentMon.name) +
      ".png";
  else
    currentMon.imgUrl =
      "https://raw.githubusercontent.com/hhhunterwolf/ShinySylveonImage/master/Sprites%20Shiny/" +
      titleCase(currentMon.name) +
      ".png";
  console.log(currentMon.name + " (Lv " + currentMon.level + ") spawned.");

  var desc;
  if (!currentMon.shiny) desc = `A wild pokemon has appeared!`;
  else desc = `A **shiny** wild pokemon has appeared!`;

  var showName;
  if (!currentMon.shiny) showName = currentMon.name;
  else showName = "Shiny " + currentMon.name;

  const embed = {
    title: message.author.username,
    description: desc,
    color: 0xfa8072,

    image: {
      url: currentMon.imgUrl
    },
    footer: {
      text: `Type ${pConfig.prefix}catch or ${
        pConfig.prefix
      }gcatch to attempt to catch it!\n(Pokéball catch Chance: ${(
        currentMon.catchChance * 100
      ).toFixed(2)}%)\n(Greatball catch Chance: ${(
        currentMon.catchGreatChance * 100
      ).toFixed(2)}%)`
    }
  };
  message.channel.send({ embed });

  console.log(
    "Spawned in <#" +
      pConfig.spawnChannel +
      "> if u arent in the spawn channel type s!mon"
  );
}

function spawnMon() {
  if (currentMon) {
    despawnMon();
  }

  for (var key in trainers) {
    trainers[key].currentBalls = pConfig.numberOfAttempts;
    trainers[key].currentGreatBalls = pConfig.numberOfGreatAttempts;
    trainers[key].catching = false;
  }
  let genderran = ["male", "female"];
  currentMon = {};

  genedid = Math.floor(Math.random() * Math.floor(dex.length)) + 1;
  currentMon.name = dex[genedid - 1];
  currentMon.id = pdex[currentMon.name].num;
  let randomGender;
  let givengen = gender[currentMon.name];
  if (!givengen) {
    randomGender = genderran[Math.floor(Math.random() * genderran.length)];
  } else {
    randomGender = givengen.gender;
  }
  currentMon.gender = randomGender;
  currentMon.level = Math.floor(Math.random() * Math.floor(50) + 1);
  currentMon.catchChance = pConfig.catchDifficulty / currentMon.level;
  currentMon.catchGreatChance = pConfig.catchGreatDifficulty / currentMon.level;
  currentMon.spawnId =
    Math.floor(Math.random() * Math.floor(9999999 - 999999)) + 999999;
  currentMon.hpiv = Math.floor(Math.random() * Math.floor(31));
  currentMon.atkiv = Math.floor(Math.random() * Math.floor(31));
  currentMon.defiv = Math.floor(Math.random() * Math.floor(31));
  currentMon.spatkiv = Math.floor(Math.random() * Math.floor(31));
  currentMon.spdefiv = Math.floor(Math.random() * Math.floor(31));
  currentMon.speediv = Math.floor(Math.random() * Math.floor(31));
  while (spawns.includes(currentMon.spawnId)) {
    currentMon.spawnId =
      Math.floor(Math.random() * Math.floor(9999999 - 999999)) + 999999;
  }
  spawns.push(currentMon.spawnId);
  updatePoke();

  if (Math.random() < pConfig.shinyChance) {
    currentMon.shiny = true;
  }

  if (currentMon.catchChance > 1) currentMon.catchChance = 1;
  if (currentMon.catchGreatChance > 1) currentMon.catchGreatChance = 1;
  if (!currentMon.shiny)
    currentMon.imgUrl =
      "https://raw.githubusercontent.com/hhhunterwolf/ShinySylveonImage/master/Sprites%20151/" +
      titleCase(currentMon.name) +
      ".png";
  else
    currentMon.imgUrl =
      "https://raw.githubusercontent.com/hhhunterwolf/ShinySylveonImage/master/Sprites%20Shiny/" +
      titleCase(currentMon.name) +
      ".png";

  console.log(currentMon.name + " (Lv " + currentMon.level + ") spawned.");

  var desc;
  if (!currentMon.shiny) desc = `A wild ${currentMon.name} has appeared!`;
  else desc = `A **shiny** wild ${currentMon.name} has appeared!`;

  var showName;
  if (!currentMon.shiny) showName = currentMon.name;
  else showName = "Shiny " + currentMon.name;

  const embed = {
    title: `${showName} (Lv. ${currentMon.level})`,
    description: desc,
    color: 0xfa8072,

    image: {
      url: currentMon.imgUrl
    }
  };

  client.channels.get(pConfig.spawnChannel).send({ embed });
  client.channels
    .get(pConfig.spawnChannel)
    .send(
      `Type \`${pConfig.prefix}catch\` or \`${
        pConfig.prefix
      }gcatch\` to attempt to catch it!\n*(Pokéball catch Chance: ${(
        currentMon.catchChance * 100
      ).toFixed(2)}%)*\n*(Greatball catch Chance: ${(
        currentMon.catchGreatChance * 100
      ).toFixed(2)}%)*`
    );

  console.log(
    "Spawned in <#" +
      pConfig.spawnChannel +
      "> if u arent in the spawn channel type s!mon"
  );
  const runTime =
    Math.floor(
      Math.random() *
        Math.floor(1000 * 60 * (pConfig.maxRunTime - pConfig.minRunTime))
    ) +
    1000 * 60 * pConfig.minRunTime;
  console.log(
    "'mon will run in " + (runTime / 1000 / 60).toFixed(2) + " minutes."
  );
  setTimeout(despawnMon, runTime);
}

function customspawnMon(message) {
  if (currentMon) {
    despawnMon();
  }
  const args = message.content
    .slice(pConfig.prefix.length)
    .trim()
    .split(/ +/g);

  for (var key in trainers) {
    trainers[key].currentBalls = pConfig.numberOfAttempts;
    trainers[key].currentGreatBalls = pConfig.numberOfGreatAttempts;
    trainers[key].catching = false;
  }
  let genderran = ["male", "female"];

  let name = args[1];
  if (!pdex[name]) return;
  if (!args[1]) return message.reply("Id?");
  let level = 1;
  currentMon = {};
  (currentMon.id = pdex[name].num), (currentMon.name = name);
  let randomGender;
  let givengen = gender[name];
  if (!givengen) {
    randomGender = genderran[Math.floor(Math.random() * genderran.length)];
  } else {
    randomGender = givengen.gender;
  }
  let yes = args[2];
  if (yes === "yes") {
    currentMon.shiny = true;
  }
  currentMon.gender = randomGender;
  currentMon.level = level;
  currentMon.catchChance = pConfig.catchDifficulty / currentMon.level;
  currentMon.catchGreatChance = pConfig.catchGreatDifficulty / currentMon.level;
  currentMon.balls = "";
  currentMon.spawnId =
    Math.floor(Math.random() * Math.floor(9999999 - 999999)) + 999999;
  currentMon.hpiv = Math.floor(Math.random() * Math.floor(31));
  currentMon.atkiv = Math.floor(Math.random() * Math.floor(31));
  currentMon.defiv = Math.floor(Math.random() * Math.floor(31));
  currentMon.spatkiv = Math.floor(Math.random() * Math.floor(31));
  currentMon.spdefiv = Math.floor(Math.random() * Math.floor(31));
  currentMon.speediv = Math.floor(Math.random() * Math.floor(31));
  while (spawns.includes(currentMon.spawnId)) {
    currentMon.spawnId =
      Math.floor(Math.random() * Math.floor(9999999 - 999999)) + 999999;
  }
  spawns.push(currentMon.spawnId);
  updatePoke();

  if (currentMon.catchChance > 1) currentMon.catchChance = 1;
  if (currentMon.catchGreatChance > 1) currentMon.catchGreatChance = 1;
  if (!currentMon.shiny)
    currentMon.imgUrl =
      "https://raw.githubusercontent.com/hhhunterwolf/ShinySylveonImage/master/Sprites%20151/" +
      titleCase(currentMon.name) +
      ".png";
  else
    currentMon.imgUrl =
      "https://raw.githubusercontent.com/hhhunterwolf/ShinySylveonImage/master/Sprites%20Shiny/" +
      titleCase(currentMon.name) +
      ".png";

  console.log(currentMon.name + " (Lv " + currentMon.level + ") spawned.");

  var desc;
  if (!currentMon.shiny)
    desc = `A wild ${currentMon.name} ${currentMon.gender} has appeared!`;
  else desc = `A **shiny** wild ${currentMon.name} has appeared!`;

  var showName;
  if (!currentMon.shiny) showName = currentMon.name;
  else showName = "Shiny " + currentMon.name;

  const embed = {
    title: `${showName} (Lv. ${currentMon.level})`,
    description: desc,
    color: 0xfa8072,

    image: {
      url: currentMon.imgUrl
    }
  };

  message.channel.send({ embed });
  message.channel.send(
    `Type \`${pConfig.prefix}catch\` or \`${
      pConfig.prefix
    }gcatch\` to attempt to catch it!\n*(Pokéball catch Chance: ${(
      currentMon.catchChance * 100
    ).toFixed(2)}%)*\n*(Greatball catch Chance: ${(
      currentMon.catchGreatChance * 100
    ).toFixed(2)}%)*`
  );

  console.log(
    "Spawned in <#" +
      pConfig.spawnChannel +
      "> if u arent in the spawn channel type s!mon"
  );
}

//Perfect spawn
function perfectspawnMon() {
  if (currentMon) {
    despawnMon();
  }

  for (var key in trainers) {
    trainers[key].currentBalls = pConfig.numberOfAttempts;
    trainers[key].currentGreatBalls = pConfig.numberOfGreatAttempts;
    trainers[key].catching = false;
  }
  currentMon = {};
  genedid = Math.floor(Math.random() * Math.floor(dex.length)) + 1;
  currentMon.name = dex[genedid - 1];
  currentMon.id = pdex[currentMon.name].num;
  currentMon.gender = "female";
  currentMon.level = 10;
  currentMon.catchChance = currentMon.level;
  currentMon.catchGreatChance = currentMon.level;
  currentMon.spawnId =
    Math.floor(Math.random() * Math.floor(9999999 - 999999)) + 999999;
  currentMon.hpiv = 31;
  currentMon.atkiv = 31;
  currentMon.defiv = 31;
  currentMon.spatkiv = 31;
  currentMon.spdefiv = 31;
  currentMon.speediv = 31;
  while (spawns.includes(currentMon.spawnId)) {
    currentMon.spawnId =
      Math.floor(Math.random() * Math.floor(9999999 - 999999)) + 999999;
  }
  spawns.push(currentMon.spawnId);
  updatePoke();

  if (currentMon.catchChance > 1) currentMon.catchChance = 1;
  if (currentMon.catchGreatChance > 1) currentMon.catchGreatChance = 1;
  if (!currentMon.shiny)
    currentMon.imgUrl =
      "https://raw.githubusercontent.com/hhhunterwolf/ShinySylveonImage/master/Sprites%20151/" +
      titleCase(currentMon.name) +
      ".png";
  else
    currentMon.imgUrl =
      "https://raw.githubusercontent.com/hhhunterwolf/ShinySylveonImage/master/Sprites%20Shiny/" +
      titleCase(currentMon.name) +
      ".png";

  console.log(currentMon.name + " (Lv " + currentMon.level + ") spawned.");

  var desc;
  if (!currentMon.shiny) desc = `A wild ${currentMon.name} has appeared!`;
  else desc = `A **shiny** wild ${currentMon.name} has appeared!`;

  var showName;
  if (!currentMon.shiny) showName = currentMon.name;
  else showName = "Shiny " + currentMon.name;

  const embed = {
    title: `${showName} (Lv. ${currentMon.level})`,
    description: desc,
    color: 0xfa8072,

    image: {
      url: currentMon.imgUrl
    }
  };

  client.channels.get(pConfig.spawnChannel).send({ embed });
  client.channels
    .get(pConfig.spawnChannel)
    .send(
      `Type \`${
        pConfig.prefix
      }catch\` to attempt to catch it!\n*(Pokéball catch Chance: ${(
        currentMon.catchChance * 100
      ).toFixed(2)}%)*\n*(Greatball catch Chance: ${(
        currentMon.catchGreatChance * 100
      ).toFixed(2)}%)*`
    );

  console.log(
    "Spawned in <#" +
      pConfig.spawnChannel +
      "> if u arent in the spawn channel type s!mon"
  );
  const runTime =
    Math.floor(
      Math.random() *
        Math.floor(1000 * 60 * (pConfig.maxRunTime - pConfig.minRunTime))
    ) +
    1000 * 60 * pConfig.minRunTime;
  console.log(
    "'mon will run in " + (runTime / 1000 / 60).toFixed(2) + " minutes."
  );
  setTimeout(despawnMon, runTime);
}
//test spawn
function testspawnMon() {
  if (currentMon) {
    despawnMon();
  }

  for (var key in trainers) {
    trainers[key].currentBalls = pConfig.numberOfAttempts;
    trainers[key].currentGreatBalls = pConfig.numberOfGreatAttempts;
    trainers[key].catching = false;
  }
  let genderran = ["male", "female"];
  let givengen = gender[name];
  if (!givengen) {
    randomGender = genderran[Math.floor(Math.random() * genderran.length)];
  } else {
    randomGender = givengen.gender;
  }
  currentMon = {};
  genedid = Math.floor(Math.random() * Math.floor(dex.length)) + 1;
  currentMon.name = dex[genedid - 1];
  currentMon.id = pdex[currentMon.name].num;
  currentMon.gender = randomGender;
  currentMon.level = Math.floor(Math.random() * Math.floor(50) + 1);
  currentMon.catchChance = pConfig.catchDifficulty / currentMon.level;
  currentMon.catchGreatChance = pConfig.catchGreatDifficulty / currentMon.level;
  currentMon.spawnId =
    Math.floor(Math.random() * Math.floor(9999999 - 999999)) + 999999;
  currentMon.hpiv = Math.floor(Math.random() * Math.floor(31));
  currentMon.atkiv = Math.floor(Math.random() * Math.floor(31));
  currentMon.defiv = Math.floor(Math.random() * Math.floor(31));
  currentMon.spatkiv = Math.floor(Math.random() * Math.floor(31));
  currentMon.spdefiv = Math.floor(Math.random() * Math.floor(31));
  currentMon.speediv = Math.floor(Math.random() * Math.floor(31));
  while (spawns.includes(currentMon.spawnId)) {
    currentMon.spawnId =
      Math.floor(Math.random() * Math.floor(9999999 - 999999)) + 999999;
  }
  spawns.push(currentMon.spawnId);
  updatePoke();

  if (Math.random() < pConfig.shinyChance) {
    currentMon.shiny = true;
  }

  if (currentMon.catchChance > 1) currentMon.catchChance = 1;
  if (currentMon.catchGreatChance > 1) currentMon.catchGreatChance = 1;

  if (!currentMon.shiny)
    currentMon.imgUrl =
      "https://raw.githubusercontent.com/hhhunterwolf/ShinySylveonImage/master/Sprites%20151/" +
      titleCase(currentMon.name) +
      ".png";
  else
    currentMon.imgUrl =
      "https://raw.githubusercontent.com/hhhunterwolf/ShinySylveonImage/master/Sprites%20Shiny/" +
      titleCase(currentMon.name) +
      ".png";

  console.log(currentMon.name + " (Lv " + currentMon.level + ") spawned.");

  var desc;
  if (!currentMon.shiny) desc = `A wild ${currentMon.name} has appeared!`;
  else desc = `A **shiny** wild ${currentMon.name} has appeared!`;

  var showName;
  if (!currentMon.shiny) showName = currentMon.name;
  else showName = "Shiny " + currentMon.name;

  const embed = {
    title: `${showName} (Lv. ${currentMon.level})`,
    description: desc,
    color: 0xfa8072,

    image: {
      url: currentMon.imgUrl
    }
  };

  client.channels.get(pConfig.spawnChannel).send({ embed });
  client.channels
    .get(pConfig.spawnChannel)
    .send(
      `Type \`${pConfig.prefix}catch\` or \`${
        pConfig.prefix
      }gcatch\` to attempt to catch it!\n*(Pokéball catch Chance: ${(
        currentMon.catchChance * 100
      ).toFixed(2)}%)*\n*(Greatball catch Chance: ${(
        currentMon.catchGreatChance * 100
      ).toFixed(2)}%)*`
    );

  console.log(
    "Spawned in <#" +
      pConfig.spawnChannel +
      "> if u arent in the spawn channel type s!mon"
  );
  const runTime =
    Math.floor(
      Math.random() *
        Math.floor(1000 * 60 * (pConfig.maxRunTime - pConfig.minRunTime))
    ) +
    1000 * 60 * pConfig.minRunTime;
  console.log(
    "'mon will run in " + (runTime / 1000 / 60).toFixed(2) + " minutes."
  );
  setTimeout(despawnMon, runTime);
}

function despawnMon() {
  if (currentMon) {
    console.log(currentMon.name + " despawned.");
    currentMon = null;

    //setupSpawn();
  }
}

function attemptCatch(message, mon) {
  if (catchingtr.has("yes"))
    return message.reply("Someone else is catching it!");
  if (
    message.channel.id === pConfig.spawnChannel ||
    !pConfig.requireCatchingInSpawnChannel
  ) {
    if (mon) {
      if (!item[message.author.id])
        return message.channel.send("Buy some pokeballs first");
      if (!trainers[message.author.id]) {
        var obj = {
          name: message.author.username,
          mons: [],
          currentBalls: item[message.author.id].pokeball,
          spawnIds: [],
          catching: false
        };
        trainers[message.author.id] = obj;
      }
      if (!trainers[message.author.id].spawnIds.includes(mon.spawnId)) {
        if (item[message.author.id].pokeball > 0) {
          if (pConfig.animatedCatch) {
            //i fear no man... but that thing... it scares me.
            if (!trainers[message.author.id].catching) {
              catchingtr.add("yes");

              message.channel
                .send("<:pb:702261761113587742>")
                .then(function(sent) {
                  setTimeout(function() {
                    updateAnimation(
                      sent.id,
                      pConfig.animationAmountShakes - 1,
                      message,
                      mon
                    );
                  }, pConfig.animationShakeTime);
                });
              trainers[message.author.id].catching = true;
            }
          } else {
            testCatch(mon, message);
          }
        } else {
          message.reply(`you don't have any Pokéballs left. Buy some!!`);
        }
      } else {
        message.reply("you've already caught this Pokémon!");
      }
    } else message.reply("there is no Pokémon to catch right now.");
  } else
    message.reply("you can only catch Pokémon in the channel they spawn in.");
}

function attemptGreatCatch(message, mon) {
  if (catchingtr.has("yes"))
    return message.reply("Someone else is catching it!");
  if (
    message.channel.id === pConfig.spawnChannel ||
    !pConfig.requireCatchingInSpawnChannel
  ) {
    if (mon) {
      if (!item[message.author.id])
        return message.channel.send("Buy some Greatballs first");
      if (!trainers[message.author.id]) {
        var obj = {
          name: message.author.username,
          mons: [],
          currentGreatBalls: item[message.author.id].greatball,
          spawnIds: [],
          catching: false
        };
        trainers[message.author.id] = obj;
      }
      if (!trainers[message.author.id].spawnIds.includes(mon.spawnId)) {
        if (item[message.author.id].greatball > 0) {
          if (pConfig.animatedGreatCatch) {
            //i fear no man... but that thing... it scares me.
            if (!trainers[message.author.id].catching) {
              catchingtr.add("yes");

              message.channel
                .send("<:gb:702262823786643466>")
                .then(function(sent) {
                  setTimeout(function() {
                    updateGreatAnimation(
                      sent.id,
                      pConfig.animationGreatAmountShakes - 1,
                      message,
                      mon
                    );
                  }, pConfig.animationGreatShakeTime);
                });
              trainers[message.author.id].catching = true;
            }
          } else {
            testGreatCatch(mon, message);
          }
        } else {
          message.reply(`you don't have any Greatballs. Buy some!`);
        }
      } else {
        message.reply("you've already caught this Pokémon!");
      }
    } else message.reply("there is no Pokémon to catch right now.");
  } else
    message.reply("you can only catch Pokémon in the channel they spawn in.");
}

function updateAnimation(sentId, shakesLeft, message, mon) {
  if (shakesLeft > 0) {
    var messageString = "<:pb:702261761113587742>";
    for (var i = 0; i < pConfig.animationAmountShakes - shakesLeft; i++) {
      messageString += " <:pb:702261761113587742>";
    }
    message.channel.fetchMessage(sentId).then(function(got) {
      got.edit(messageString);
    });
    shakesLeft--;
    setTimeout(function() {
      updateAnimation(sentId, shakesLeft, message, mon);
    }, pConfig.animationShakeTime);
  } else {
    message.channel.fetchMessage(sentId).then(function(got) {
      got.delete();
    });
    testCatch(mon, message);
    trainers[message.author.id].catching = false;
  }
}
function updateGreatAnimation(sentId, shakesLeft, message, mon) {
  if (shakesLeft > 0) {
    var messageString = "<:gb:702262823786643466>";
    for (var i = 0; i < pConfig.animationGreatAmountShakes - shakesLeft; i++) {
      messageString += "  <:gb:702262823786643466>";
    }
    message.channel.fetchMessage(sentId).then(function(got) {
      got.edit(messageString);
    });
    shakesLeft--;
    setTimeout(function() {
      updateGreatAnimation(sentId, shakesLeft, message, mon);
    }, pConfig.animationGreatShakeTime);
  } else {
    message.channel.fetchMessage(sentId).then(function(got) {
      got.delete();
    });
    testGreatCatch(mon, message);
    trainers[message.author.id].catching = false;
  }
}
function testCatch(mon, message) {
  const randGen = Math.random();
  if (randGen < mon.catchChance) {
    console.log(`${message.author.username} caught ${mon.name}`);

    var mid = Math.floor(Math.random() * Math.floor(99999 - 9999)) + 9999;
    while (mons[mid]) {
      mid = Math.floor(Math.random() * Math.floor(99999 - 9999)) + 9999;
    }
    let pbam = item[message.author.id].pokeball;
    let gbam = item[message.author.id].greatball;
	let rr = item[message.author.id].candy;
	let stone = item[message.author.id].stone;
    item[message.author.id] = {
      pokeball: pbam - 1,
      greatball: gbam,
	  candy: rr,
	  stone: stone
    };

    fs.writeFile("./Store/item.json", JSON.stringify(item), function(err) {
      if (err) throw err;
    });
    let tosend;
    if (!mon.shiny) {
      tosend = `congratulations! You caught ${
        mon.name
      }!\nIf you'd like to see it type \`${pConfig.prefix}info ${trainers[
        message.author.id
      ].mons.length + 1}\``;
    } else {
      tosend = `congratulations! You caught Shiny ${
        mon.name
      } <:sylvay:710806633508503582> !\nIf you'd like to see it type \`${
        pConfig.prefix
      }info ${trainers[message.author.id].mons.length + 1}\``;
    }
    catchingtr.delete("yes");
    message.reply(tosend);
    despawnMon();
    gennedMon = mon;
    delete gennedMon["imgUrl"];
    gennedMon.owner = message.author.id;
    gennedMon.catchTime = dateFormat("mm/dd/yyyy h:MM TT");
    gennedMon.nickname = "";

    mons[mid] = gennedMon;

    trainers[message.author.id].mons.push(mid);
    trainers[message.author.id].spawnIds.push(mon.spawnId);
    trainers[message.author.id].currentGreatBalls =
      pConfig.numberOfGreatAttempts;
    mons[mid].balls = "<:pb:702261761113587742>";
    despawnMon();

    updatePoke();
  } else {
    let pbam = item[message.author.id].pokeball;
    let gbam = item[message.author.id].greatball;
	let rr = item[message.author.id].candy;
	let stone = item[message.author.id].stone;
    item[message.author.id] = {
      pokeball: pbam - 1,
      greatball: gbam,
	  candy: rr,
	  stone: stone
    };

    fs.writeFile("./Store/item.json", JSON.stringify(item), function(err) {
      if (err) throw err;
    });
    message.reply(
      "your Pokéball missed <:sylvsad:710806436833263667>. You have " +
        item[message.author.id].pokeball +
        " left."
    );
    catchingtr.delete("yes");
  }
  updatePoke();
}

function testGreatCatch(mon, message) {
  const randGen = Math.random();
  if (randGen < mon.catchGreatChance) {
    console.log(`${message.author.username} caught ${mon.name}`);

    var mid = Math.floor(Math.random() * Math.floor(99999 - 9999)) + 9999;
    while (mons[mid]) {
      mid = Math.floor(Math.random() * Math.floor(99999 - 9999)) + 9999;
    }
    let pbam = item[message.author.id].pokeball;
    let gbam = item[message.author.id].greatball;
	let rr = item[message.author.id].candy;
	let stone = item[message.author.id].stone;
    item[message.author.id] = {
      pokeball: pbam,
      greatball: gbam - 1,
	  candy: rr,
	  stone: stone
    };

    fs.writeFile("./Store/item.json", JSON.stringify(item), function(err) {
      if (err) throw err;
    });

    let tosend;
    if (!mon.shiny) {
      tosend = `congratulations! You caught ${
        mon.name
      }!\nIf you'd like to see it type \`${pConfig.prefix}info ${trainers[
        message.author.id
      ].mons.length + 1}\``;
    } else {
      tosend = `congratulations! You caught Shiny ${
        mon.name
      } <:sylvay:710806633508503582> !\nIf you'd like to see it type \`${
        pConfig.prefix
      }info ${trainers[message.author.id].mons.length + 1}\``;
    }
    catchingtr.delete("yes");
    message.reply(tosend);
    despawnMon();
    gennedMon = mon;
    delete gennedMon["imgUrl"];
    gennedMon.owner = message.author.id;
    gennedMon.catchTime = dateFormat("mm/dd/yyyy h:MM TT");
    gennedMon.nickname = "";

    mons[mid] = gennedMon;

    trainers[message.author.id].mons.push(mid);
    trainers[message.author.id].spawnIds.push(mon.spawnId);
    trainers[message.author.id].currentGreatBalls =
      pConfig.numberOfGreatAttempts;
    mons[mid].balls = "<:gb:702262823786643466>";
    despawnMon();

    updatePoke();
  } else {
    let pbam = item[message.author.id].pokeball;
    let gbam = item[message.author.id].greatball;
	let rr = item[message.author.id].candy;
	let stone = item[message.author.id].stone;
    item[message.author.id] = {
      pokeball: pbam,
      greatball: gbam - 1,
	  candy: rr,
	  stone: stone
    };

    fs.writeFile("./Store/item.json", JSON.stringify(item), function(err) {
      if (err) throw err;
    });
    message.reply(
      "your Greatball missed <:sylvsad:710806436833263667>. You have " +
        item[message.author.id].greatball +
        " left."
    );
    catchingtr.delete("yes");
  }
  updatePoke();
}
//stuff not to touch
function updatePoke() {
  fs.writeFile("./Store/mons.json", JSON.stringify(mons), function(err) {
    if (err) throw err;
  });
  fs.writeFile("./Store/marketadd.json", JSON.stringify(marketadd), function(
    err
  ) {
    if (err) throw err;
  });
  fs.writeFile("./Store/trainers.json", JSON.stringify(trainers), function(
    err
  ) {
    if (err) throw err;
  });
  fs.writeFile("./Store/spawns.json", JSON.stringify(spawns), function(err) {
    if (err) throw err;
  });

  fs.writeFile("./Store/xp.json", JSON.stringify(user), function(err) {
    if (err) throw err;
  });
  fs.writeFile("./Store/party.json", JSON.stringify(party), function(err) {
    if (err) throw err;
  });
  fs.writeFile("./Store/money.json", JSON.stringify(eco), function(err) {
    if (err) throw err;
  });
}

function checkHour() {
  if (pConfig.limitSpawnTimes) {
    var now = new Date();
    var dayOfWeek = now.getDay();
    if (dayOfWeek > 0 && dayOfWeek < 6) {
      //falls on a weekday
      if (
        now.getHours() >= pConfig.hourEnableSpawns &&
        now.getHours() < pConfig.hourDisableSpawns
      ) {
        //it's in schedule
        spawnsEnabled = true;
      } else spawnsEnabled = false;
    } else {
      if (!pConfig.enableWeekendSpawns) spawnsEnabled = false;
    }
  }
}

var scheduleHourCheck = schedule.scheduleJob("0 * * * *", function() {
  checkHour();
});
