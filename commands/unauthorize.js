exports.run = async (client, message, args, guildData) => {
  if (message.author.id !== client.config.owner) return;

  const member = message.mentions.members.first();
  if (!member)
    return message.channel.send(
      `🚫 Please tag a user you would like to take access from!`
    );

  if (!guildData.auth.includes(member.id))
    return message.channel.send(`🚫 That user is not authenticated!`);

  message.channel.send(`✅ User ${member} has been unauthenticated!`);
  guildData.auth = guildData.auth.filter((x) => x !== member.id);
  await guildData.save();
};
