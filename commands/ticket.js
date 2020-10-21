exports.run = async (client, message, args, guildData) => {
  const { question, normal } = require("../util/embeds");
  const { MessageEmbed } = require("discord.js");

  let channel = await message.guild.channels.create(
    `${message.author.username.replace(/-/gm, "")}-ticket`,
    {
      type: "text",
      //parent: client.config.ticketCategory,
      permissionOverwrites: [
        {
          id: message.guild.id,
          deny: ["VIEW_CHANNEL"],
        },
        {
          id: message.author.id,
          allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
        },
      ],
    }
  );

  let a = await channel.send(
    question(
      `Please pick a ticket version.\n\n🛒 Buy Role\n📖 Buy Advertisement\n💬 Request Support`,
      `You have 15 minutes to react to this message or else the ticket will close.`
    )
  );

  a.react("🛒");
  a.react("📖");
  a.react("💬");

  a.awaitReactions((r, u) => u.id === message.author.id && ["🛒", "📖", "💬"].includes(r.emoji.name), { max: 1, time: 900000, errors: ["time"] })
  .then(async reaction => {
    a.delete();

    if(reaction.first().emoji.name === "🛒") {
      channel.send(
        normal(
          `You have chose to purchase an advertising role!`,
          guildData.roleMessage ? guildData.roleMessage : `Please be patient for a staff member to see this ticket.`
        )
      )
    }

    if(reaction.first().emoji.name === "💬") {
      let a = await channel.send(
        question(
          `What do you need support with?`,
          `Answer this question the best you can.`
        )
      );

      channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 900000, errors: ["time"] })
      .then(async description => {
        channel.send(
          normal(
            `${message.author.usernmame} Support Ticket`,
            `Needs support with: \`${description.first().content}\``
          )
        )
      })
    }

    if(reaction.first().emoji.name === "📖") {
      a = await channel.send(
        question(
          `Please choose the tag you would like to use.`,
          `Please say the word 'everyone' or 'here' depending on the tag you want to use.`
        )
      );
      channel
        .awaitMessages(
          (m) =>
            m.author.id === message.author.id &&
            ["everyone", "here"].includes(m.content.toLowerCase()),
          { max: 1, time: 900000, errors: ["time"] }
        )
        .then(async (tag) => {
          a.delete();
          tag.first().delete();

          a = await channel.send(
            question(
              `Mention the channel in this discord server you would like to post the advertisement in.`,
              `Please tag the channel you would like to send the message in.`
            )
          );
          channel
            .awaitMessages(
              (m) =>
                m.author.id === message.author.id && m.mentions.channels.first(),
              { max: 1, time: 900000, errors: ["time"] }
            )
            .then(async (adChan) => {
              a.delete();
              adChan.first().delete();
    
              a = await channel.send(
                question(
                  `What is the message you would like to advertise in that channel?`,
                  `Please provide the exact message below as there is no turning back.`
                )
              );
              channel
                .awaitMessages((m) => m.author.id === message.author.id, {
                  max: 1,
                  time: 900000,
                  errors: ["time"],
                })
                .then(async (msg) => {
                  a.delete();
                  msg.first().delete();
    
                  channel
                    .send(
                      new MessageEmbed()
                        .setTitle(`Advertisement Request`)
                        .setDescription(
                          `Below is the information the user would like to use.`
                        )
                        .addField(
                          `Tag`,
                          tag.content.toLowerCase() === "everyone"
                            ? `@everyone`
                            : `@here`,
                          true
                        )
                        .addField(`Channel`, adChan.mentions.channels.first(), true)
                        .addField(`Message`, msg.content, true)
                        .setFooter(`Click the check to accept, and the X to deny.`)
                        .setTimestamp()
                    )
                    .then((embed) => {
                      embed.react("✅");
                      embed.react("🚫");
                    });
                });
            });
        });
    }
  })
};
