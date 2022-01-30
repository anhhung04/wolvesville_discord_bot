const wait = require('util').promisify(setTimeout);

module.exports=async function(client, channel, title, fields, role, addField=true, addOption=true){
    const embed = new MessageEmbed();
            embed.setTitle(title);
            embed.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
            embed.setTimestamp();

            const row = new MessageActionRow();
            
            if(fields){
                if(addField){
                    embed.addFields(fields);
                }
                if(addOption){
                    row.addComponents(
                        new MessageSelectMenu()
                            .setPlaceholder('Nothing selected')
                            .setCustomId('select')
                            .addOptions(fields)
                    );
                }
            }

            let mess = await channel.send({ embeds: [embed], components: [row] });

            await wait(5000);

            mess.delete();

            let messRole= await channel.send(`next_turn ${role}`);

            return messRole.delete();
};