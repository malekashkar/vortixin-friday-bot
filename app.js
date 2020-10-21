const { Client, Collection } = require("discord.js");
const client = new Client({ partials: ["MESSAGE", "REACTION", "CHANNEL"] });
const fs = require("fs");

require("./database/");

client.config = require("./config.json");
client.commands = new Collection();
client.models = {
  guild: require("./database/models/guild"),
};

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, props);
  });
});

client.login(client.config.token);
