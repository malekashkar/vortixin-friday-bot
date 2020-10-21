module.exports = async (client, reaction, user) => {
  if (user.bot) return;
  if (reaction.message.parital) await reaction.message.fetch();

  let message = reaction.message;

  if (
    message.channel.name.split("-")[1] === "ticket" &&
    user.id === client.config.owner
  ) {
    if (reaction.emoji.name === "🚫") return message.channel.delete();
    if (reaction.emoji.name === "✅" && message.embeds[0])
      message.guild.channels.cache
        .get(message.embeds[0].fields[1].value.replace(/<|>|#/gm, ""))
        .send(
          `${message.embeds[0].fields[2].value}\n${message.embeds[0].fields[0].value}`
        );
  } else if (
    r.channels.includes(message.channel.id) &&
    reaction.emoji.name === "🚫" &&
    user.id === client.config.owner
  ) {
    let a = await message.channel.send(
      `Why would you like to delete message with ID **${message.id}**?`
    );
    message.channel
      .awaitMessages((x) => x.author.id === user.id, {
        max: 1,
        time: 900000,
        errors: ["time"],
      })
      .then(async (reason) => {
        a.delete();
        reason.first().delete();
        
        let channel = message.guild.channels.cache.find(x => x.name === "deleted-ads");
        if(channel) channel.send(message.embeds[0]);
      })
      .catch((err) => a.delete());
  }
};
