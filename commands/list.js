const Discord = require("discord.js");
const ms = require("ms");

exports.run = async (client, message, args, guildData) => {
  if (!guildData.roles.length)
    return message.channel.send(
      new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle(`There are no roles setup currently!`)
    );

  const embed = new Discord.MessageEmbed()
    .setTitle(`Listed Roles`)
    .setColor(client.config.color);

  guildData.roles.forEach((r) =>
    embed.addField(
      message.guild.roles.cache.get(r.role).name,
      `
        **Channels**
        ${r.channels.map((c) => `<#${c}>\n`).join("")}

        **Interval**
        ${ms(r.time)}

        **Autorole**
        ${r.autorole}
        `,
      true
    )
  );

  message.channel.send(embed);
};
