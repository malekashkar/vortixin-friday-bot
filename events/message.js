const Discord = require("discord.js");
const ms = require("ms");

module.exports = async (client, message) => {
  if (message.author.bot && message.author.id !== "766853119039766538") return;
  if (message.channel.type !== "text") return;

  const guildData =
    (await client.models.guild.findById(message.guild.id)) ||
    (await client.models.guild.create({ _id: message.guild.id }));

  if (message.content.indexOf(client.config.prefix) !== 0) {
    guildData.roles.forEach(async (r) => {
      if (!message.member.roles.cache.map((r) => r.id).includes(r.role)) return;
      if (!r.channels.includes(message.channel.id)) return;

      message.channel
        .send(
          new Discord.MessageEmbed()
            .setTitle(`Advertisement Confirmation`)
            .setColor(client.config.color)
            .setDescription(
              `Are you sure you would like to post this advertisement.\nClick the ✅ or 🚫 depending on your choice.`
            )
            .addField(`Message`, message.content, true)
            .addField(`Message Interval`, ms(r.time), true)
        )
        .then((quest) => {
          quest.react("✅");
          quest.react("🚫");

          quest
            .awaitReactions(
              (r, u) =>
                u.id === message.author.id &&
                ["🚫", "✅"].includes(r.emoji.name),
              { max: 1, time: 900000, errors: ["time"] }
            )
            .then(async (reaction) => {
              if (reaction.emoji.name === "✅") {
                message.channel.updateOverwrite(message.author.id, {
                  SEND_MESSAGES: false,
                });
                quest.delete();

                message.react("🚫");

                guildData.time.push({
                  channel: message.channel.id,
                  user: message.author.id,
                  time: Date.now() + r.time,
                });
                await guildData.save();
              } else {
                message.delete();
                quest.delete();
              }
            });
        });
    });
  } else {
    const args = message.content
      .slice(client.config.prefix.length)
      .trim()
      .split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command);
    if (!cmd) return;

    if (message.author.id === client.config.owner) {
      cmd.run(client, message, args);
    } else {
      if (
        ["setup", "lockdown"].includes(command) &&
        message.member.hasPermission("ADMINISTRATOR")
      )
        cmd.run(client, message, args, guildData);
      else if (
        ["setup", "lockdown"].includes(command) ||
        guildData.auth.includes(message.author.id)
      )
        cmd.run(client, message, args, guildData);
      else if (!["setup", "lockdown"].includes(command))
        cmd.run(client, message, args, guildData);
    }
  }
};
