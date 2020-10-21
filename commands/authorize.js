exports.run = async (client, message, args, guildData) => {
  if (message.author.id !== client.config.owner) return;

  let member = message.mentions.members.first();
  if (!member)
    return message.channel.send(
      `🚫 Please tag a user you would like to give access to!`
    );

  if (guildData.auth.includes(member.id))
    return message.channel.send(`🚫 That user is alerady authenticated!`);

  message.channel.send(`✅ User ${member} has been authenticated!`);
  guildData.auth.push(member.id);
  await guildData.save();
};
