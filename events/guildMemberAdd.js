module.exports = async(client, member) => {
    const guildData = await client.models.guild.findById(member.guild.id);
    guildData.roles.forEach(r => {
        if(r.autorole) member.roles.add(r.role)
    });
}