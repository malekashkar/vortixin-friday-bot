const Discord = require("discord.js");
const ms = require("ms");

exports.run = async (client, message, args, guildData) => {
  const userRoles = message.member.roles.cache.map((r) => r.id);
  guildData.roles = guildData.roles.filter((x) => userRoles.includes(x.role));

  const description = `**${client.config.prefix}list** ~ List all roles available and their details.\n**${client.config.prefix}help** ~ Show a list of commands and roles you have.\n**${client.config.prefix}ticket** ~ Create a ticket to send an @ everyone or @ here ad.`;
  const addon = guildData.auth.includes(message.author.id)
    ? `\n**${client.config.prefix}setup** ~ Add a role to the advertising role list.\n**${client.config.prefix}lockdown <server/here>** ~ Lockdown ever channel in the server or your current channel.`
    : message.author.id === client.config.owner
    ? `\n**${client.config.prefix}authorize <@user>** ~ Authorize a user to use the bot commands.\n**${client.config.prefix}unauthorize <@user>** ~ Unauthorize a user from using the bot commands.`
    : ``;

  const embed = new Discord.MessageEmbed()
    .setTitle(`Help Menu`)
    .setColor(client.config.color)
    .setTimestamp()
    .setFooter(
      `Above is a list of advertisement roles you have and bot commands.`
    )
    .setDescription(`${description}${addon}`);

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
