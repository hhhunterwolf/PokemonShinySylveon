exports.run = (client, message, args) => {
  let prefix = "s!";
  let gmodule = args[0];
  if (gmodule === "pokemon") {
    let embed = {
      title: "Pokemon Module",
      color: 0xfa8072,
      fields: [
        {
          name: "Pokemon Module",
          value: "**The pokemon related commands**"
        },
        {
          name: prefix + "spawn",
          value: "To spawn a pokemon"
        },
        {
          name: prefix + "buy",
          value: "To buy pokeballs and stuff from shop"
        },
        {
          name: prefix + "mart",
          value: "The PokeMart"
        },
        {
          name: prefix + "catch",
          value: "To catch a spawned mon."
        },
        {
          name: prefix + "gcatch",
          value: "To catch using greatball"
        },
        {
          name: prefix + "pc",
          value: "Check your caught Pokemons"
        },
        {
          name: prefix + "find",
          value: "Finds the ids of given pokemons!\nUsage: `s!find sylveon`"
        },
        {
          name: prefix + "nickname",
          value:
            "Nickname a Pokemon by pc id\nUsage: `s!nickname <id> <nickname>`"
        },
        {
          name: prefix + "select",
          value: "Select a pokemon\nUsage: `s!select <id>`"
        },
        {
          name: prefix + "info",
          value: "Show selected mon or the given mon\nUsage: `s!info <id>`"
        },
        {
          name: prefix + "party",
          value: "Party\nAdditions: `add`\nUsage: `s!part add <id> <slot>`"
        },
        {
          name: prefix + "give",
          value: "Give someone a Pokemon you own\nUsage: `s!give @user <id>`"
        },
        {
          name: prefix + "market",
          value:
            "Pokemon gts\nAdditions: `add, buy`\nUsage: `s!market add <id>\ns!market buy <market id>`"
        }
      ]
    };
    message.channel.send({ embed: embed });
  } else if (gmodule === "eco") {
    let embed = {
      title: "Economy Module",
      color: 0xfa8072,
      fields: [
        {
          name: prefix + "bal",
          value: "Available balance in Wallet"
        },
        {
          name: prefix + "work",
          value: "To work and earn money.\nCooldown: 1 min"
        },
        {
          name: prefix + "dep",
          value: "To deposit all your wallet money to bank"
        },
        {
          name: prefix + "withdraw",
          value: "To withdraw your bank money"
        },
        {
          name: prefix + "pay",
          value:
            "To pay someone from your wallet.\nUsage: `s!pay @user <amount>`"
        }
      ]
    };
    message.channel.send({ embed: embed });
  } else if (gmodule === "rpg") {
    let embed = {
      title: "RPG Module",
      color: 0xfa8072,
      fields: [
        /*{
                        name: prefix+"chop",
                        value: "Chop trees cuz wynaut"
                    },*/
        {
          name: prefix + "inv",
          value: "Your inventory"
        }
      ]
    };
    message.channel.send({ embed: embed });
  } else if (gmodule === "misc") {
    let embed = {
      title: "Misc Commands",
      color: 0xfa8072,
      fields: [
        {
          name: prefix + "8ball",
          value: "Magic 8ball!"
        },
        {
          name: prefix + "advice",
          value: "Gives an advice"
        },
        {
          name: prefix + "amia",
          value: "Am i a joke to you"
        },
        {
          name: prefix + "coinflip",
          value: "Coin flip"
        },
        {
          name: prefix + "color",
          value:
            "Shows the given color\nUsage: `s!color <hex of the color without #`"
        },
        {
          name: prefix + "anime",
          value: "Shows info on an anime\nUsage: `s!anime <name of anime>`"
        },
        {
          name: prefix + "manga",
          value: "Shows info on a manga\nUsage: `s!manga <name of manga>`"
        },
        {
          name: prefix + "urban",
          value: "Shows the top result of urban dictionary"
        },
        {
          name: prefix + "owofy",
          value: "Owofys a text just try UwU"
        },
        {
          name: prefix + "poll",
          value:
            "Creates a poll!\nUsage: s!poll [channel] <poll question> <time>"
        },
        {
          name: prefix + "roll",
          value: "Rolls the dice"
        },
        {
          name: prefix + "say",
          value: "Says what you want to me to say"
        },
        {
          name: prefix + "truth",
          value: "Say something and will send with truth meme format"
        }
      ]
    };
    message.channel.send({ embed: embed });
  } else if (gmodule === "rp") {
    let embed = {
      title: "RP Commands",
      color: 0xfa8072,
      fields: [
        {
          name: prefix + "cuddle",
          value: "Cuddles a user"
        },
        {
          name: prefix + "feed",
          value: "Feed a user"
        },
        {
          name: prefix + "hug",
          value: "Hugs a user"
        },
        {
          name: prefix + "kiss",
          value: "Kisses a user"
        },
        {
          name: prefix + "pat",
          value: "Pats a user"
        },
        {
          name: prefix + "poke",
          value: "Pokes a user"
        },
        {
          name: prefix + "slap",
          value: "Slaps a user"
        },
        {
          name: prefix + "smug",
          value: "Smugs"
        },
        {
          name: prefix + "tickle",
          value: "Tickles a user"
        },
        {
          name: prefix + "woosh",
          value: "Wooshes"
        }
      ]
    };
    message.channel.send({ embed: embed });
  } else if (gmodule === "dex") {
    let embed = {
      title: "Pokedex Commands",
      color: 0xfa8072,
      fields: [
        {
          name: prefix + "dex",
          value: "Shows dex info of a given pokemon\nUsage: `s!dex sylveon`"
        },
        {
          name: prefix + "mv",
          value: "Move info\nUsage: `s!mv moonblast`"
        },
        {
          name: prefix + "evo",
          value: "Shows the evolution line"
        }
      ]
    };
    message.channel.send({ embed: embed });
  } else if (gmodule === "music") {
    let embed = {
      title: "Music Module",
      color: 0xfa8072,
      fields: [
        {
          name: prefix + "play",
          value:
            "Plays music!\nUsage: `s!play all of me`\nAliases: `play-song` `add` `p`"
        },
        {
          name: prefix + "skip",
          value: "Skips the song"
        },
        {
          name: prefix + "skipto",
          value:
            "Skip to a specific song in the queue, provide the song number as an argument"
        },
        {
          name: prefix + "skipall",
          value: "Skip all songs in queue"
        },
        {
          name: prefix + "queue",
          value: "Shows the queue\nAliases: `song-list` `next-songs`"
        },
        {
          name: prefix + "remove",
          value:
            "Remove a song from queue\nUsage: `s!remove 1` ||To remove song number 1||"
        },
        {
          name: prefix + "pause",
          value: "Pause the song\nAliases: `stop` `hold` `stop-song`"
        },
        {
          name: prefix + "resume",
          value: "Resume the song\nAliases: `resume-song` `continue`"
        },
        {
          name: prefix + "nowplaying",
          value:
            "Shows now playing\nAliases: `np` `now-playing` `currently-playing`"
        },
        {
          name: prefix + "loop",
          value:
            "Loop the current song\nUsage: `s!loop 10` ||that will loop 10 times||"
        },
        {
          name: prefix + "shuffle",
          value: "Shuffles the queue"
        },
        {
          name: prefix + "lyrics",
          value: "Shows lyrics of now playing song or a given song"
        },
        {
          name: prefix + "volume",
          value: "Adjust song volume"
        },
        {
          name: prefix + "musictrivia",
          value:
            "Engage in a music quiz with your friends!\nAliases `music-quiz` `start-quiz`"
        },
        {
          name: prefix + "stopmusictrivia",
          value:
            "End the music trivia\nAliases`stop-music-trivia` `skip-trivia` `end-trivia` `stop-trivia`"
        }
      ]
    };
    message.channel.send({ embed: embed });
  } else {
    let embed = {
      title: "Help Embed",
      description:
        "There are three modules, `pokemon`, `pokedex`, `music`,`rp`, `rpg`, `economy` and `misc`\nFor Pokemon commands do `s!help pokemon`\nFor Pokedex commands do `s!help dex`\nFor Economy commands do `s!help eco`\nFor RP commands do `s!help rp`\nFor RPG commands do `s!help rpg`\nFor Misc commands do `s!help misc`\nAnd for Music do `s!help music`",
      color: 0xfa8072
    };
    message.channel.send({ embed: embed });
  }
};
