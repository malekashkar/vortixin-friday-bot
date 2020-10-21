exports.run = async (client, message, args) => {
  const { lockdown } = require("../util/embeds");
  if (!["server", "here"].includes(args[0]))
    return message.channel.send(
      `**Usage:** ${client.config.prefix}lockdown [server/here]`
    );

  if (args[0] === "server") {
    message.guild.channels.cache.forEach((c) =>
      c.updateOverwrite(message.guild.id, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: false,
      })
    );
    message.channel.send(lockdown(args[0]));
  } else {
    message.channel.updateOverwrite(message.guild.id, {
      VIEW_CHANNEL: true,
      SEND_MESSAGES: false,
    });
    message.channel.send(lockdown(args[0]));
  }
};
