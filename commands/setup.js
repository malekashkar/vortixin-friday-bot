exports.run = async (client, message, args, guildData) => {
  const { question, error } = require("../util/embeds");
  const ms = require("ms");

  let roleMention = message.mentions.roles.first();

  if (!roleMention)
    return message.channel.send(
      error(`**Usage:** ${client.config.prefix}setup <@role>`)
    );

  let usedChannels = guildData.roles
  .map((x) => x.channels)
  .flat();

  let channels = message.guild.channels.cache
    .filter((x) => x.type === "text" && !usedChannels.includes(x.id))
    .array()
    .map((x, i) => `${i + 1}. ${x}`)
    .join("\n");

  let roles = guildData.roles
    .map(
      (x) => `<@&${x.role}> \n${x.channels.map((x) => `<#${x}>`).join("\n")}`
    )
    .join("\n\n");

  let a = await message.channel.send(
    `${roles ? `Role Setups:\n${roles}` : ``}\n\n${
      channels ? `Available Channels:\n${channels}` : ``
    }`
  );

  message.channel
    .awaitMessages((m) => m.author.id === message.author.id, {
      max: 1,
      time: 900000,
      errors: ["time"],
    })
    .then(async (channels) => {
      a.delete();
      channels.first().delete();

      channels = channels
        .first()
        .content
        .split(" ")
        .map((x) => message.guild.channels.cache
          .filter((x) => x.type === "text" && !usedChannels.includes(x.id))
          .array()[parseInt(x) - 1]
          .id
          );

      console.log(channels);

      a = await message.channel.send(
        question(
          `How much time should there be between each advertisement?`,
          `Some examples of times are 10s, 50m, or 1d. Please do not go over 1 day.`
        )
      );
      message.channel
        .awaitMessages((m) => m.author.id === message.author.id, {
          max: 1,
          time: 900000,
          errors: ["time"],
        })
        .then(async (time) => {
          a.delete();
          time.first().delete();

          a = await message.channel.send(
            question(
              `Would you like this role to be an autorole to this server?`,
              `Please reply with yes or no.`
            )
          );
          a.react("✅");
          a.react("🚫");

          a.awaitReactions(
            (r, u) =>
              u.id === message.author.id && ["✅", "🚫"].includes(r.emoji.name),
            { max: 1, time: 900000, errors: ["time"] }
          ).then(async (autorole) => {
            a.delete();

            time = ms(time.first().content);
            autorole = autorole.first().emoji.name === "✅";

            let roleData = guildData.roles.find(
              (x) => x.role === roleMention.id
            );

            roleData
              ? (roleData = {
                  role: roleMention.id,
                  channels: channels,
                  autorole: autorole,
                  time: time,
                })
              : guildData.roles.push({
                  role: roleMention.id,
                  channels: channels,
                  autorole: autorole,
                  time: time,
                });

                await guildData.save();

            channels.forEach(async (id) => {
              let channel = await message.guild.channels.cache.get(id);
              channel.overwritePermissions([
                {
                  id: message.guild.id,
                  deny: ["SEND_MESSAGES"],
                  allow: ["VIEW_CHANNEL"],
                },
                {
                  id: roleMention.id,
                  deny: ["MENTION_EVERYONE"],
                  allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                },
              ]);
            });
          });
        });
    });
};
