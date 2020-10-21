exports.run = async(client, message, args, guildData) => {
    const { error } = require("../util/embeds");
    const msg = args.join(" ");
    
    if(!msg) return message.channel.send(
        error("Please provide the message you want to send to the user!")
    );

    guildData.roleMessage = msg;
    await guildData.save();

    message.channel.send(
        normal(
            "New role message is set!",
            `The new buy role ticket message is now: \`${msg}\``
        )
    );
}