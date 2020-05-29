const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    const agree = "✅";
    const disagree = "❎";

    try {

        let channel;
        let timeS;
        let votingthing;
        if (message.mentions.channels.size > 0 && args[0].startsWith("<#")) {
            channel = message.guild.channels.get(message.mentions.channels.first().id);
            timeS = args[1];
            votingthing = args.splice(2, args.length);
        } else {
            channel = message.channel;
            timeS = args[0];
            votingthing = args.splice(1, args.length);
        }

        if (timeS == '' && votingthing == '') return message.reply("I can't deploy a vote with no parameters! Please use s!poll <channel to send vote in> <seconds for vote to last> <vote message>");
        if (votingthing == '') return message.reply("I can't deploy a vote with no parameters! Please use s!poll <channel to send vote in> <seconds for vote to last> <vote message>");

        if (isNaN(timeS)) {
            // timeS = 10000
            votingthing = timeS + ' ' + votingthing.join(' ');
            timeS = 60000;
        } else {
            votingthing = votingthing.join(' ');
            timeS = parseInt(timeS) * 1000;
        }

        if (timeS < 5000 || timeS > 180000) {
            message.reply('Please pick an appropriate amount of time for the vote to take (no less than 5 seconds and no more than three minutes)');
            return;
        }

        const VoteEmbed = new Discord.RichEmbed()
            .setTitle(votingthing)
            .setDescription("Vote Now!")
            .setFooter(`Started by ${message.author.username}`, message.author.displayAvatarURL)
            .setColor(0xfa8072);

        let msg = await channel.send({
            embed: VoteEmbed
        });
        await msg.react(agree);
        await msg.react(disagree);

        const reactions = await msg.awaitReactions(reaction => reaction.emoji.name === agree || reaction.emoji.name === disagree, {
            time: timeS
        });
        // msg.delete();

        var no = reactions.get(disagree).count;
        var yes = reactions.get(agree);

        if (yes == undefined) {
            var yes = 1;
        } else {
            var yes = reactions.get(agree).count;
        }

        var total = yes > no ? "In Favor of Yes" : "In Favor of No";
        if (yes == no) total = "It was a tie!";

        const embed = new Discord.RichEmbed()
            .setTitle(`${votingthing.replace(/([^\W_]+[^\s-]*) */g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })}`)
            .setDescription("**----------------------------------------**\n" +
                "Total votes (Yes): " + `${yes - 1}\n` +
                "Total votes (No): " + `${no - 1}\n` +
                "\n" +
                `${total}\n` +
                "**----------------------------------------**", true)
            .setColor(0xfa8072)
            .setFooter(`Started by ${message.author.username}`, message.author.displayAvatarURL);

        await msg.edit("Voting finished!", {
            embed
        });
    } catch (err) {
        console.log(err);
    }
};