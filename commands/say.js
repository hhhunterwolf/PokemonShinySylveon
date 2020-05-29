exports.run = (client, message) => {
    let args = message.content.split(" ").slice(1);
    message.delete();
    if (args.join(" ") === "@everyone" || args.join(" ") === "@here") return message.channel.send("You ain't making me Ping anyone BOI!");
    message.channel.send(args.join(" "));
};