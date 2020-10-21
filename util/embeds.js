const Discord = require("discord.js");
const config = require("../config.json");

function question(title, text) {
    return new Discord.MessageEmbed()
    .setTitle(title)
    .setFooter(text)
    .setColor(config.color)
}

function error(text) {
    return new Discord.MessageEmbed()
    .setTitle(text)
    .setFooter(`Please review the error above.`)
    .setColor("RED")
    .setTimestamp()
}

function lockdown(type) {
    return new MessageEmbed()
    .setTitle(`Operation Complete`)
    .setDescription(type === "server" ? `The server has been locked down.` : `The channel ${message.channel} has been locked down.`)
    .setColor(config.color);
}

function normal(title, text) {
    return new Discord.MessageEmbed()
    .setTitle(title)
    .setDescription(text)
    .setColor(config.color)
}

module.exports = {
    question,
    error,
    lockdown,
    normal
}