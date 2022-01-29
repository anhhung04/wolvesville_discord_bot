const { MessageActionRow, MessageEmbed, MessageSelectMenu } = require('discord.js');

module.exports = async function(client, channel,title, fieldsSelect, userIds, callBack,deleteMessage = true, time=99999, role){
    try{
        const embed = new MessageEmbed();
        embed.setTitle(title);
        embed.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
        embed.setTimestamp();

        const row = new MessageActionRow();

        if(fieldsSelect){
            if(embed.addFields(fieldsSelect)){
                embed.addFields(fieldsSelect);
            }

            row.addComponents(
				new MessageSelectMenu()
					.setPlaceholder('Nothing selected')
                    .setCustomId('select')
					.addOptions(fieldsSelect)
			);
        }

        let mess = await channel.send({ embeds: [embed], components: [row] });

        const filter = (i) => {
            i.deferUpdate();
            return userIds.includes(i.user.id) && !i.user.bot;
        };

        const collector = mess.createMessageComponentCollector({filter, componentType: 'SELECT_MENU', time: time });

        collector.on('collect', i => {
			callBack(i, collector, mess);

            if(deleteMessage){
                return i.message.delete();    
            }
		});

		collector.on('end', async (collected, reason) => {
			if(reason!=='messageDelete'&&reason!=='time'){
                let message = await channel.send(reason);
                return message.delete();
            }else if(reason==='time'){
                let message = await channel.send(`next_turn ${role}`);
                return message.delete();
            }
		});

    }catch(err){
        console.log(err);
        let hostChannel = client.channels.cache.get(process.env.HOST_ID);
        let message = await hostChannel.send('Something wrong!');
        return message.delete();
    }
}