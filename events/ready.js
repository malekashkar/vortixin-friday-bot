module.exports = async (client) => {
  console.log("The bot is now on.");

  // client.guilds.cache.get("573686158500823055").channels.cache.get("575011119366668289").updateOverwrite("584915458302672916", { SEND_MESSAGES: true });

  setInterval(async () => {
    const guilds = await client.models.guild.find({
      time: { $exists: true, $ne: [] },
    });

    for (let i = 0; i < guilds.length; i++) {
      for (let j = 0; j < guilds[i].time.length; j++) {
        if (guilds[i].time[j].time > Date.now()) return;

        client.guilds.cache
          .get(guilds[i]._id)
          .channels.cache.get(guilds[i].time[j].channel)
          .updateOverwrite(guilds[i].time[j].user, { SEND_MESSAGES: true });

        guilds[i].time = guilds[i].time.filter((x) => x.time >= Date.now());
        await guilds.save();
      }
    }
  }, 5 * 60 * 1000);
};
